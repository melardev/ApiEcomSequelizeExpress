const productsController = require('../controllers/products.controller');
const router = require('express').Router();
const upload = require('../utils/upload').upload;
const setUploadPath = require('../middlewares/upload.middleware').setUploadPath;

const AuthMiddleware = require('../middlewares/auth.middleware');

require('./param_loaders/products.loader').init(router);
require('./param_loaders/tags.loader').init(router);

router.get('', productsController.getAll);

router.get('/:product_slug', productsController.getByIdOrSlug);
router.get('/by_id/:productId', productsController.getByIdOrSlug);

router.get('/by_tag/:tag_slug', productsController.getByTag);
router.get('/by_tag_id/:tagId', productsController.getByTag);

router.get('/by_category/:category_slug', productsController.getByCategory);
router.get('/by_category_id/:categoryId', productsController.getByCategory);

router.post('', AuthMiddleware.mustBeAuthenticated, AuthMiddleware.isAdmin, setUploadPath('./public/images/products'), upload.array('images', 6), productsController.createProduct);
router.put('/:product', AuthMiddleware.mustBeAuthenticated, AuthMiddleware.isAdmin, setUploadPath('./public/images/products'), upload.array('images', 6), productsController.updateProduct);

router.delete('/:product_load_ids', AuthMiddleware.mustBeAuthenticated, AuthMiddleware.isAdmin, productsController.deleteProduct);
router.delete('/by_id/:product_load_ids', AuthMiddleware.mustBeAuthenticated, AuthMiddleware.isAdmin, productsController.deleteProduct);

module.exports = router;
