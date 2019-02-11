const Order = require('./../../config/sequelize.config').Order;
const OrderItem = require('./../../config/sequelize.config').OrderItem;
const AppResponseDto = require('../../dtos/responses/app_response.dto');

function init(router) {
    router.param('order_load_ids', function (req, res, next) {

        Order.findOne({
            where: {id: req.params.order_load_ids},
            attributes: ['id', 'userId'],
            include: [OrderItem]
        }).then(function (order) {
            if (!order)
                return res.json(AppResponseDto.buildWithErrorMessages('Order not found'), 404);
            req.order = order;
            req.userOwnable= order; // userOwnable is read by the authorization middleware
            return next();
        }).catch(err => {
            return res.json(AppResponseDto.buildWithErrorMessages(err), 404);
        });
    });
}

module.exports = {
    init
};