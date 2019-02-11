'use strict';
const bcrypt = require('bcrypt');
const User = require('./../config/sequelize.config').User;
const Role = require('./../config/sequelize.config').Role;
const UserRole = require('./../config/sequelize.config').UserRole;

module.exports = {
    up: (queryInterface, Sequelize) => {

        return Role
            .findOrCreate({
                where: {name: 'ROLE_ADMIN'},
                defaults: {description: 'For Admin users'},
            }).spread((role, created) => {
                return User.findOrCreate({
                    where: {
                        username: 'admin'
                    },
                    include: [Role],
                    defaults: {
                        firstName: process.env.ADMIN_FNAME || 'admin',
                        lastName: process.env.ADMIN_LNAME || 'admin',
                        email: process.env.ADMIN_EMAIL || 'admin@sequelizeblog.com',
                        password: 'password'
                    }
                }).spread((user, created) => {
                    const isAdmin = user.isAdminSync();
                    if (!isAdmin) {
                        return user.setRoles([role]).then(result => {
                            console.log('[+] associated ROLE_ADMIN to admin')
                        }).catch(err => {
                            throw err;
                        });
                    } else {

                    }
                }).catch(err => {
                    console.error(err);
                });

            }).catch(err => {
                console.error(err);
                process.exit(0);
            });
    },

    down:
        (queryInterface, Sequelize) => {
            /*
              Add reverting commands here.
              Return a promise to correctly handle asynchronicity.

              Example:
              return queryInterface.bulkDelete('People', null, {});
            */

            User.destroy({
                where: {
                    username: 'admin',
                },
            }).then(() => {
                console.log('Admin deleted successfully');
            });
        }
}
;
