'use strict';
const faker = require('faker');
const Tag = require('./../config/sequelize.config').Tag;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await Tag.findOrCreate({where: {'name': 'jeans'}, defaults: {description: 'Jeans or the like'}});
        await Tag.findOrCreate({where: {'name': 'shoes'}, defaults: {description: 'Shoes of any kind'}});
        await Tag.findOrCreate({
            where: {'name': 'jackets'},
            defaults: {description: 'Jackets against the cold'}
        });
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
