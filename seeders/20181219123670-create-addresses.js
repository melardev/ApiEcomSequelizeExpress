'use strict';
const faker = require('faker');
const Address = require('./../config/sequelize.config').Address;
const User = require('./../config/sequelize.config').User;
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            Address.findAndCountAll(),
            User.findAll({include: [{model: Address}]}),
        ]).then(res => {

            const addressCount = res[0].count;
            const users = res[1];

            let addressesToSeed = 53;
            addressesToSeed -= addressCount;
            if (addressesToSeed > 0) {
                const promises = [];
                for (let i = 0; i < addressesToSeed; i++) {
                    const address = {
                        address: faker.address.streetAddress(true),
                        country: faker.address.country(),
                        city: faker.address.city(),
                        zipCode: faker.address.zipCode(),
                    };
                    const user = users[Math.floor(Math.random() * users.length)];
                    if (faker.random.boolean() || faker.random.boolean()) {
                        address.userId = user.id;
                        address.firstName = user.firstName;
                        address.lastName = user.lastName;
                        // you could also do user.createAddress(address);
                    } else {
                        address.firstName = faker.name.firstName();
                        address.lastName = faker.name.lastName();
                    }

                    promises.push(Address.create(address));
                }

                return Promise.all(promises).then(res => {
                    console.log('[+] ' + res.length + ' Addresses seeded');
                }).catch(err => {
                    throw err
                });
            }

            return true;
        }).catch(err => {
            console.error(err);
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
