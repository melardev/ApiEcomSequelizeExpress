'use strict';
const Category = require('./../config/sequelize.config').Category;
module.exports = {
    up: async (queryInterface, Sequelize) => {

        await Category.findOrCreate({where: {'name': 'kids'}, defaults: {description: 'Kids category'}});
        await Category.findOrCreate({
            where: {'name': 'teenagers'},
            defaults: {description: 'teenagers category'}
        });
        await Category.findOrCreate({
            where: {'name': 'adults'},
            defaults: {description: 'Adults category'}
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
