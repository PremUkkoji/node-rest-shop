const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: ""
    })
})

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: ""
    })
})

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: ""
    })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: ""
    })
})

module.exports = router;