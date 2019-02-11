const express = require('express');
const router = express.Router();
const tagCategoriesController = require('../controllers/tags_categories.controller');
const upload = require('../utils/upload').upload;
const AuthMiddleware = require('../middlewares/auth.middleware');
const setUploadPath = require('../middlewares/upload.middleware').setUploadPath;

router.get('/categories', tagCategoriesController.getCategories);
router.get('/tags', tagCategoriesController.getTags);
router.post('/categories', AuthMiddleware.mustBeAuthenticated, AuthMiddleware.isAdmin, setUploadPath('./public/images/categories'), upload.array('images', 6), tagCategoriesController.createCategory);
router.post('/tags', AuthMiddleware.mustBeAuthenticated, AuthMiddleware.isAdmin, setUploadPath('./public/images/tags'), upload.array('images', 6), tagCategoriesController.createTag);
module.exports = router;