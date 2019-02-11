const OrderDto = require('../dtos/responses/orders.dto');
const AppResponseDto = require('../dtos/responses/app_response.dto');
const Order = require('./../config/sequelize.config').Order;
const User = require('./../config/sequelize.config').User;
const Product = require('./../config/sequelize.config').Product;
const Address = require('./../config/sequelize.config').Address;
const sequelize = require('./../config/sequelize.config').sequelize;
const OrderItem = require('./../config/sequelize.config').OrderItem;

exports.getOrders = function (req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 5;
    const offset = (page - 1) * pageSize;

    return Promise.all([Order.findAndCountAll({
        order: [
            ['createdAt', 'DESC'],
        ],

        include: [
            {
                model: OrderItem,
                attributes: ['id',
                    // [sequelize.fn('count', sequelize.col('order_items.id')), 'orderItemCount']
                ],
                // group: ['order_items.orderId'],
            },
        ],

        where: {userId: req.user.id},
        offset, limit: pageSize,
    }),
        Order.findAndCountAll({where: {userId: req.user.id}, attributes: ['id']})
    ]).then(function (results) {
        const ordersCount = results[1].count;
        results[0].rows.forEach(order => order.order_items_count = order.order_items.length);
        return res.json(OrderDto.buildPagedList(results[0].rows, page, pageSize, ordersCount, req.baseUrl, false));
    }).catch(err => {
        return res.json(AppResponseDto.buildSuccessWithMessages(err.message));
    });
};

async function createOrderNewAddress(req, res, transaction) {
    const country = req.body.country;
    const city = req.body.city;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const address = req.body.address;
    const zipCode = req.body.zip_code;

    const addr = new Address({
        country, city, firstName, lastName, address, zipCode
    });

    if (req.user != null) {
        addr.userId = req.userId;
    }

    await addr.save({transaction}).then(async address => {
        address.user = req.user;
        await _createOrderFromAddress(req, res, address, transaction);
    }).catch(err => {
        throw err;
    });
}

exports.createOrder = async function (req, res, next) {
    const addressId = req.body.address_id;
    let transac = undefined;
    sequelize.transaction({autocommit: false}).then(async function (transaction) {
        transac = transaction;
        if (req.user != null && addressId != null) {
            await _createOrderReuseAddress(req, res, addressId, transaction);
        } else if (addressId == null) {
            await createOrderNewAddress(req, res, transaction);
        }
        transaction.commit();
    }).catch(err => {
        transac.rollback();
        return res.json(AppResponseDto.buildWithErrorMessages(err.message));
    });
};

exports.getOrderDetails = function (req, res, next) {
    Order.findOne({
        where: {id: req.order.id},
        path: 'address',
        include: [{
            model: Address,
            // this is just to show how to load nested relations, normally I would not do this, I would load user from Order for readability
            include: [User]
        }, {
            model: OrderItem,
            attributes: ['id', 'name', 'slug', 'price']
        }],
    }).then(order => {
        order.user = order.address.user;
        return res.json(OrderDto.buildDto(order, true, true, true));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err));
    });
};

// TODO
exports.updateOrder = (req, res, next) => {
    return res.json(AppResponseDto.buildWithErrorMessages('not implemented'));
};

async function _createOrderReuseAddress(req, res, addressId, transaction) {

    await Address.findOne({
        where: {id: addressId},
        attributes: ['id', 'userId', 'firstName', 'lastName', 'zipCode', 'address']
    }).then(async address => {
        if (address.userId !== req.user.id) {
            throw new Error('You do not own this address');
        } else {
            await _createOrderFromAddress(req, res, address, transaction);
        }
    }).catch(err => {
        throw err;
    });
}

async function _createOrderFromAddress(req, res, address, transaction) {

    await Order.create({
        userId: address.userId, addressId: address.id
    }, {transaction}).then(async order => {
        const cartItems = req.body.cart_items;
        await Product.findAll({
            where: {
                id: {
                    [sequelize.Op.in]: cartItems.map(product => product.id)
                }
            }
        }).then(async products => {
            // if a cartItem has a productId which no longer exists(or the user has tampered with that param) then error
            if (products.length !== cartItems.length)
                return AppResponseDto.buildWithErrorMessages('Make sure the products still exist');

            const promises = products.map((product, index) => {
                return new OrderItem({
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    quantity: cartItems[index].quantity,
                    userId: req.user ? req.user.id : undefined,
                    orderId: order.id
                }).save({transaction});
            });
            await Promise.all(promises).then(orderItems => {
                order.order_items = orderItems;
                order.address = address;
                order.user = req.user;
                return res.json(OrderDto.buildDto(order, false, true, true));
            }).catch(err => {
                throw err;
            });
        }).catch(err => {
            throw err;
        });
    }).catch(err => {
        throw err;
    });
}
