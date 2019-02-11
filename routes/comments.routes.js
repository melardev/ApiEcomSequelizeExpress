const router = require('express').Router();
const commentsController = require('../controllers/comments.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

require('./param_loaders/products.loader').init(router);
require('./param_loaders/comments.loader').init(router);

router.get('/products/:product_load_ids/comments', commentsController.getCommentsFromProduct);
router.get('/products/by_id/:product_load_ids/comments', commentsController.getCommentsFromProduct);
router.get('/comments/:comment', commentsController.getCommentDetails);

router.post('/products/:product_load_ids/comments', AuthMiddleware.isAuthenticated, commentsController.createComment);

router.delete('/products/:skip/comments/:comment_load_ids', AuthMiddleware.isAuthenticated, AuthMiddleware.ownsCommentOrIsAdmin, commentsController.deleteComment);
router.delete('/comments/:comment_load_ids', AuthMiddleware.isAuthenticated, AuthMiddleware.ownsCommentOrIsAdmin, commentsController.deleteComment);

module.exports = router;