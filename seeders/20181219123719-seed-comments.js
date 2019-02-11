'use strict';

const faker = require('faker');

const Comment = require('./../config/sequelize.config').Comment;
const User = require('./../config/sequelize.config').User;
const Product = require('./../config/sequelize.config').Product;


module.exports = {
    up: (queryInterface, Sequelize) => {

        const promises = [];
        /*
        promises.push(Comment.findAndCountAll());
        promises.push(User.findAll());
        promises.push(Product.findAll());
*/
        promises.push(Comment.findAll({attributes: ['id']}));
        promises.push(User.findAll({attributes: ['id']}));
        promises.push(Product.findAll({attributes: ['id']}));

        return Promise.all(promises).then(res => {
            /*const commentsCount = Comment.findAll({
                attributes: [
                    [[sequelize.fn('COUNT', sequelize.col('id'))], 'comments_count']
                ]
            });
            */
            promises.length = 0; // clear array to be reused
            const commentsCount = res[0].length;
            const users = res[1];
            const products = res[2];

            let commentsToSeed = 42;
            commentsToSeed -= commentsCount;

            for (let i = 0; i < commentsToSeed; i++) {
                let user = users[Math.floor(Math.random() * users.length)];
                let product = products[Math.floor(Math.random() * products.length)];
                promises.push(Comment.create({
                    content: faker.lorem.sentence(),
                    userId: user.id,
                    productId: product.id,
                    rating: faker.random.number({min: 1, max: 5}),
                }));
            }

            return Promise.all(promises).then(res => {
                promises.length = 0;
                console.log('[+] Seeded comments');

            }).catch(err => {
                throw err;
            });

        }).catch(err => {
            throw err;
        });

        return Promise.all(promises).then(res => {
            /*const commentsCount = Comment.findAll({
                attributes: [
                    [[sequelize.fn('COUNT', sequelize.col('id'))], 'comments_count']
                ]
            });
            */
            const commentsCount = res[0].count;
            const users = res[1];
            const products = res[2];

            let commentsToSeed = 42;
            commentsToSeed -= commentsCount;

            for (let i = 0; i < commentsToSeed; i++) {
                promises.push(Comment.create({
                    content: faker.lorem.sentence(),
                    user: users[Math.floor(Math.random() * users.length)],
                    product: products[Math.floor(Math.random() * products.length)], // faker.commerce.price() * 100,
                }));
            }

        }).catch(err => {
            throw err;
        });


        // Comment.findAll({attributes: { include: [[sequelize.fn('COUNT', sequelize.col('id')), 'comments_count']] }});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};
