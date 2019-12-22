const express = require('express')
const mongoose = require('mongoose')

const Product = require('../models/product')

const router = express.Router()

router.get('/', (req, res, next) => {
	Product.find()
	.select('_id name price')
	.exec()
	.then(products => {

		const response = {
			count: products.length,
			products: products.map(product => {
				return {
					_id: product._id,
					name: product.name,
					price: product.price,
					request: {
						description: 'get product details',
						type: 'GET',
						url: 'http://localhost:3000/products/' + product._id
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
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	})

	product.save()
	.then(product => {
		const response = {
			message: "Product created successfully",
			product: {
				_id: product._id,
				name: product.name,
				price: product.price
			},
			request: [
				{
					description: 'get product details',
					type: 'GET',
					url: 'http://localhost:3000/products/' + product._id
				},
				{
					description: 'remove product',
					type: 'DELETE',
					url: 'http://localhost:3000/products/' + product._id
				},
				{
					description: 'update product details',
					type: 'UPDATE',
					url: 'http://localhost:3000/products/' + product._id
				}
			]
		}

		res.status(201).json(response)
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
	.select('_id name price')
	.exec()
	.then(product => {
		if(product){

			const response = {
				_id: product._id,
				name: product.name,
				price: product.price,
				request: [
					{
						description: 'remove product',
						type: 'DELETE',
						url: 'http://localhost:3000/products/' + product._id
					},
					{
						description: 'update product details',
						type: 'UPDATE',
						url: 'http://localhost:3000/products/' + product._id
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

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId

	const updateOptions = {}
	for(const option of req.body){
		updateOptions[option.property] = option.value;
	}

	Product.updateMany({ _id: id }, { $set: updateOptions })
	.exec()
	.then(result => {

		const response = {
			message: "Product updated successfully",
			request: {
				description: 'get product details',
				type: 'GET',
				url: 'http://localhost:3000/products/' + id
			}
		}

		res.status(200).json(response)
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

		const response = {
			message: 'Product removed',
			request: {
				description: 'create product',
				type: 'POST',
				url: 'http://localhost:3000/products/',
				body: {
					name: 'String',
					price: 'Number'
				}
			}
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