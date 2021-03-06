//TODO: image update

const express = require('express')
const multer = require('multer')

const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/')
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + '_' + file.originalname)
	}
})

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true)
	}else{
		cb(null, false)
	}
}

// const upload = multer({ dest: 'uploads/'})
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
})

const router = express.Router()

router.get('/', ProductsController.products_list)

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product)

router.get('/:productId', ProductsController.get_product)

router.patch('/:productId', checkAuth, ProductsController.update_product)

router.delete('/:productId', checkAuth, ProductsController.delete_product)

module.exports = router;