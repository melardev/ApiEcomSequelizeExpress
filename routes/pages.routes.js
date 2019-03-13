const router = require('express').Router();
const PagesController = require('../controllers/pages.controller');

router.get('', PagesController.index);
router.get('/home', PagesController.index);

module.exports = router;
