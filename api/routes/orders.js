const express = require('express')
const router = express.Router()

const Order = require('../models/order')
const Product = require('../models/product')

const mongoose = require('mongoose')

router.get('/', (req, res, next) => {
    Order.find()
    .select('_id productId quantity')
    .exec()
    .then(orders => {
        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    productId: order.productId,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

router.post('/', (req, res, next) => {
    const id = req.body.productId
    Product.findById(id)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            productId: req.body.productId,
            quantity: req.body.quantity
        })

        return order.save()
    })
    .then(order => {
        const response = {
            message: 'Order created',
            order: {
                _id: order._id,
                productId: order.productId,
                quantity: order.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + order._id
            }
        }

        res.status(201).json(response)
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .select('_id productId quantity')
    .exec()
    .then(order => {
        if(order){

            const response = {
                order: order,
                request: [
                    {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    },
                    {
                        type: 'DELETE',
                        url: 'http://localhost:3000/orders' + order._id
                    }
                ]
            }

            res.status(200).json(response)
        }
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    Order.deleteOne({ _id: id })
    .exec()
    .then(result => {
        const response = {
            message: 'Order removed',
            result: result
        }
        res.status(200).json(response)
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

module.exports = router;