'use strict';
const faker = require('faker');
const Order = require('./../config/sequelize.config').Order;
const OrderItem = require('./../config/sequelize.config').OrderItem;
const User = require('./../config/sequelize.config').User;
const Product = require('./../config/sequelize.config').Product;
const Address = require('./../config/sequelize.config').Address;
const ORDER_STATUS = require('../constants').ORDER_STATUS;
const _ = require('lodash');

module.exports = {
    up: (queryInterface, Sequelize) => {
        // Order.findAllAndCount()
        return Order.findAll({
            attributes: ['id']
        }).then(res => {

            // const ordersCount = res.count;
            const ordersCount = res.length;
            let ordersToSeed = 30;
            ordersToSeed -= ordersCount;
            const promises = [];
            if (ordersToSeed > 0) {
                promises.push(User.findAll({
                    attributes: ['id'],
                    include: [{
                        model: Address,
                        attributes: ['id', 'userId']
                    }]
                }));
                promises.push(Address.findAll({attributes: ['id', 'userId']}));
                promises.push(Product.findAll({attributes: ['id', 'name', 'slug', 'price']}));

                return Promise.all(promises).then(res => {
                    promises.length = 0; // Clear the array
                    const users = res[0];
                    const addresses = res[1];
                    const products = res[2];
                    const guestAddresses = addresses.filter(a => a.userId == null);

                    for (let i = 0; i < ordersToSeed; i++) {

                        const order = {
                            trackingNumber: faker.random.alphaNumeric(16), // 16 alphaNumeric chars long
                            orderStatus: _.sample(ORDER_STATUS).ordinal,
                        };

                        let user = users[Math.floor(Math.random() * users.length)];
                        if ((user.addresses.length > 0)
                            &&
                            (faker.random.boolean() || faker.random.boolean() || faker.random.boolean())) {

                            order.userId = user.id;
                            order.addressId = user.addresses[Math.floor(Math.random() * user.addresses.length)].id;
                        } else
                            order.addressId = guestAddresses[Math.floor(Math.random() * guestAddresses.length)].id;

                        promises.push(Order.create(order));
                    }

                    return Promise.all(promises).then(res => {
                        const orders = res;
                        promises.length = 0; // Clear the array

                        for (let i = 0; i < orders.length; i++) {
                            let order = orders[i];
                            const orderItemsToSeed = faker.random.number({min: 1, max: 12});
                            for (let j = 0; j < orderItemsToSeed; j++) {
                                let product = products[Math.floor(Math.random() * products.length)];
                                promises.push(OrderItem.create({
                                    name: product.name,
                                    slug: product.slug,
                                    userId: order.userId,
                                    orderId: order.id,
                                    productId: product.id,
                                    price: Math.min(10, product.price - faker.random.number({min: -50, max: 50})),
                                    quantity: faker.random.number({min: 1, max: 10})
                                }));
                            }
                        }

                        return Promise.all(promises).then(res => {
                            const orderItems = res;

                            console.log('Done');
                        }).catch(err => {
                            throw err;
                        })
                    }).catch(err => {
                        throw err;
                    });
                }).catch(err => {
                    throw err;
                });

            }


        }).catch(err => {
            throw err;
        });
        // Create Order, ORderInfo and Address all at Once
        /*Order.create({
            trackingCode: faker.random.some(),
            userId: user.id,
            orderInfo: {
                status: 1,
                address: {}
            }
        }, {
            include: [
                {
                    association: Order.OrderInfo,
                    include: [OrderInfo.Address]
                }
            ]
        });
        */
    },
    down:
        (queryInterface, Sequelize) => {
            /*
              Add reverting commands here.
              Return a promise to correctly handle asynchronicity.

              Example:
              return queryInterface.bulkDelete('People', null, {});
            */
        }
};
