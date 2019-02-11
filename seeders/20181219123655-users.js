'use strict';
const faker = require('faker');
const User = require('./../config/sequelize.config').User;

const Role = require('./../config/sequelize.config').Role;
const UserRole = require('./../config/sequelize.config').UserRole;

module.exports = {
    up: (queryInterface, Sequelize) => {

        let rolePromise = Role
            .findOrCreate({
                where: {name: 'ROLE_USER'},
                defaults: {description: 'For Authenticated users'}
            });
        let userPromise = User.findAndCountAll({
            attributes: ['id'],
            include: [{
                model: Role,
                where: {name: 'ROLE_USER'},
                through: {
                    attributes: ['id'],
                }
            }]
        });

        return Promise.all([
            rolePromise, userPromise
        ]).then(res => {
            let userRole = res[0][0];
            const userRoleCreated = res[0][1];
            const userCount = res[1].count;
            let usersToSeed = 36;
            usersToSeed -= userCount;
            const promises = [];
            if (userRoleCreated) {
                console.log(`[+] 'ROLE_USER' role seeded successfully`);
            }

            if (usersToSeed > 0) {
                console.log(`[+] Seeding ${usersToSeed} users`);
                for (let i = 0; i < usersToSeed; i++) {
                    const fname = faker.name.firstName();
                    const lname = faker.name.lastName();
                    promises.push(User.create({
                        firstName: fname,
                        lastName: lname,
                        username: fname + '_' + lname,
                        email: faker.internet.email(),
                        password: 'password',
                    }));
                }
            }
            return Promise.all(promises).then(res => {
                promises.length = 0;
                res.forEach(user => promises.push(user.setRoles([userRole])));
                return Promise.all(promises).then(userRoles => {
                    console.log('[+] Seeded ' + res.length + ' Users');
                }).catch(err => {
                    console.error('Something went wrong');
                });

            });
        }).catch(err => {
            throw err;
        });

// Role
        /*  return User.findAll({
              attributes: ['id'], // Select only User.id
              include: [
                  {
                      model: UserRole,
                      attributes: ['id'], // select only Role.id
                      through: {
                          attributes: ['name'],
                          where: {name: 'ROLE_ADMIN'}
                      }
                  }]
          }).then(res => {
              const hashed_password = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'password', bcrypt.genSaltSync(10));
              // || bcrypt.hashSync('password', 10),
              User.create({
                  first_name: process.env.ADMIN_FNAME || 'admin',
                  last_name: process.env.ADMIN_LNAME || 'admin',
                  email: process.env.ADMIN_EMAIL || 'admin',
                  password: hashed_password
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
