'use strict';

const faker = require('faker');
const Product = require('./../config/sequelize.config').Product;
const Tag = require('./../config/sequelize.config').Tag;
const Category = require('./../config/sequelize.config').Category;
const sequelize = require('./../config/sequelize.config').sequelize;

module.exports = {
    up: (queryInterface, Sequelize) => {

        return sequelize.transaction(function (t) {
            const promises = [];
            promises.push(Product.findAndCountAll());
            promises.push(Tag.findAll());
            promises.push(Category.findAll());
            return Promise.all(promises)
                .then(res => {

                    const productsCount = res[0].count;
                    const tags = res[1];
                    const categories = res[2];
                    let productsToSeed = 42;
                    productsToSeed -= productsCount;

                    const promises = [];
                    /*
                                    if (productsCount === 0) {
                                        productsToSeed--;
                                        // this ilustrates how to create a Product and Tag simultaneously
                                        promises.push(Product.create({
                                            name: faker.commerce.productName(),
                                            description: faker.lorem.sentences(2),
                                            // defaults: min => 0, max => 1000, dec => 2, symbol => ''
                                            price: parseInt(faker.commerce.price(10, 1000, 2)) * 100, // faker.commerce.price() * 100,
                                            stock: faker.random.number({min: 0, max: 120}),
                                            tags: [
                                                {name: 'winter', description: 'Winter cloth'},
                                                {name: 'sport', description: 'Clothes for sport'}
                                            ],
                                            categories: [
                                                {name: 'skinny', description: 'Skinny people'},
                                            ],
                                        }, {
                                            include: [{
                                                model: 'Tag', as: 'tags'
                                            }, {
                                                model: 'Category', as: 'categories'
                                            }]
                                        }));
                                    }
                    */
                    for (let i = 0; i < productsToSeed; i++) {
                        promises.push(Product.create({

                            name: faker.commerce.productName() + faker.random.number({min: 0, max: 120}),
                            description: faker.lorem.sentences(2),
                            // defaults: min => 0, max => 1000, dec => 2, symbol => ''
                            price: parseInt(faker.commerce.price(10, 1000, 2)) * 100, // faker.commerce.price() * 100,
                            stock: faker.random.number({min: 0, max: 120}),
                        }, {transaction: t}));
                    }

                    return Promise.all(promises)
                        .then(res => {
                            console.log(`[+] ${res.length} Products seeded`);
                            promises.length = 0;
                            for (let i = 0; i < res.length; i++) {
                                const tag = tags[Math.floor(Math.random() * tags.length)];
                                const category = categories[Math.floor(Math.random() * categories.length)];
                                promises.push(res[i].setTags([tag], {transaction: t}));
                                promises.push(res[i].setCategories([category], {transaction: t}));
                            }

                            return Promise.all(promises).then(res => {
                                console.log('[+] Done');
                            }).catch(err => {
                                throw err;
                            });
                        }).catch(err => {
                            throw err;
                        });
                }).catch(err => {
                    console.error(err);
                    throw err;
                });
        });


        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
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
