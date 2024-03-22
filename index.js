const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())
const port = 3000

const orders = []
const status = "Em preparação"

const checkUserId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if (index<0){
        return response.status(404).json("Error: Order not found")
    }

    request.userIndex = index
    request.userId = id

    next ()
}

const checkUrl = (request, response, next) => {
    console.log('Request URL:', request.originalUrl);
    console.log('Request Type:', request.method);
    
    next ()
}

app.post('/orders', (request, response) => {
    const {clientName, order, price} = request.body
    const client = {id:uuid.v4(), clientName, order, price, status}
    
    orders.push(client)
    
    return response.status(201).json(client)
})

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.put('/orders/:id', checkUserId, checkUrl, (request, response) => {
    const {clientName, order, price, status} = request.body
    const index = request.userIndex
    const id = request.userId

    const updateOrder = {id, clientName, order, price, status: "Em preparação."}

    orders[index] = updateOrder
    
    return response.json(updateOrder)
})

app.delete('/orders/:id', checkUserId, checkUrl, (request, response) => {
    const index = request.userIndex

    orders.splice(index,1)

    return response.json("Order deleted successfull")
})

app.get('/orders/:id', checkUserId, checkUrl, (request, response) => {
    const index = request.userIndex
    return response.json(orders[index])
})

app.patch('/orders/:id', checkUserId, checkUrl, (request, response) => {
    const {clientName, order, price} = request.body
    const index = request.userIndex
    const id = request.userId
    const patchOrder = { id, clientName, order, price, status: "Pronto!" }

    orders[index] = patchOrder
    return response.json(patchOrder)
})

app.listen(port, () =>{
    console.log (`Server started on port ${port}`)
})