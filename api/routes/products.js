const express = require('express')
const mongoose = require('mongoose')

const Product = require('../models/product')

const router = express.Router()

router.get('/', (req, res, next) => {
	Product.find()
	.exec()
	.then(products => {
		if(products.length > 0){
			res.status(200).json({
				products: products
			})
		}
	})
	.catch(error => {
		res.status(500).json({
			error: error
		})
	})
})

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	})

	product.save()
	.then(product => {
		res.status(201).json({
			message: "Product created successfully",
			product: product
		})
	})
	.catch(error => {
		console.log(error)
		res.status(500).json({
			error: error
		})
	})
})

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId

	Product.findById(id)
	.exec()
	.then(product => {
		if(product){
			res.status(200).json({
				product: product
			})
		}else{
			res.status(404).json({
				message: "Product not found"
			})
		}
	})
	.catch(error => {
		res.status(500).json({
			error: error
		})
	})
})

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId

	const updateOptions = {}
	for(const option of req.body){
		updateOptions[option.property] = option.value;
	}

	console.log(updateOptions)
	Product.updateMany({ _id: id }, { $set: updateOptions })
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Product updated successfully",
			result: result
		})
	})
	.catch(error => {
		res.status(500).json({
			error: error
		})
	})
})

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId

	Product.remove({ _id: id })
	.exec()
	.then(result => {
		res.status(200).json({
			result: result
		})
	})
	.catch(error => {
		res.status(500).json({
			error: error
		})
	})
})

module.exports = router;