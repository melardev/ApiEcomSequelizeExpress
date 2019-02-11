const Product = require('../../config/sequelize.config').Product;
const AppResponseDto = require('./../../dtos/responses/app_response.dto');
const _ = require('lodash');

function init(router) {
    // Preload product objects on routes with ':product'
    router.param('product_slug', function (req, res, next, slug) {
        req.query = {slug: req.params.product_slug};
        next();
    });


// place the product in the request object when :product_id is present in path
    router.param('productId', function (req, res, next, slug) {
        req.query = {id: req.params.productId};
        next();
    });



    router.param('product_load_ids', async function (req, res, next, slugOrId) {
        const query = {attributes: ['id']};
        if (isNaN(slugOrId))
            query.where = {slug: slugOrId};
        else
            query.where = {id: slugOrId};

        await Product.findOne(query)
            .then(product => {
                if (product) {
                    req.product = product;
                    req.product_id = product.id;
                    return next();
                } else {
                    return res.json(AppResponseDto.buildWithErrorMessages('Product does not exist'), 404);
                }
            }).catch(err => {
                return res.json(AppResponseDto.buildWithErrorMessages(err.message));
            });
    });
}

module.exports = {
    init
};