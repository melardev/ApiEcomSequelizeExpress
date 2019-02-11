const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = function (sequelize, DataTypes) {
    const {INTEGER, STRING, DATE, UUID, UUIDV4} = DataTypes;

    const User = sequelize.define('users', {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: STRING(50),
            allowNull: false,
            field: 'first_name'
        },
        lastName: {
            type: STRING(50),
            allowNull: false,
            field: 'last_name'
        },
        username: {
            type: STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: STRING(50),
            allowNull: false,
        },
        email: {
            type: STRING(50),
            allowNull: true,
        },

        createdAt: {
            type: DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },

        updatedAt: {
            type: DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'updated_at'
        },
    }, {
        // timestamps: false,
        tableName: 'users',

        instanceMethods: {},

        hooks: {
            beforeCreate: function (user, options) {
                const hashed_password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
                user.password = hashed_password;//bcrypt.hashSync(user.pwd, bcrypt.genSaltSync(10), null);
            },
            afterCreate: function (user, options) {
                /*
                if (user.roles == null) {
                    user.getRoles().then(roles => {
                        if (roles == null || roles.length === 0) {
                            return this.sequelize.models.roles.findOrCreate({
                                where: {'name': 'ROLE_USER'},
                                defaults: {description: 'For standard users'}
                            }).spread(async (role, created) => {
                                // user.addRole(role) // or
                                // user.setRoles([role]) // or
                                // or
                                new this.sequelize.models.users_roles({
                                    roleId: role.id,
                                    userId: user.id
                                }).save()
                                    .then(ur => {
                                        console.log('attached to ROLE_USER');
                                    }).catch(err => {
                                    throw err
                                });
                            }).catch(err => {
                                throw err;
                            });
                        }
                    });
                }
                */
            },
        }
    });

    User.associate = function (models) {

        User.hasMany(models.Order);

// http://docs.sequelizejs.com/class/lib/associations/belongs-to-many.js~BelongsToMany.html#instance-method-get
// user.addRoles, user.countRoles, user.createRole, user.getRoles, user.getRoles, user.removeRole, user.removeRoles, user.setRoles
        User.belongsToMany(models.Role, {through: 'users_roles', foreignKey: 'userId', otherKey: 'roleId'});
// User.belongsToMany(models.Role, {through: models.UserRole, foreignKey: 'userId', otherKey: 'roleId'});

        User.hasMany(models.Comment);

        User.hasMany(models.Address,); //{as: 'Addresses'});

// User.belongsToMany(models.Role, {through: 'UserRole'});
    };

    User.beforeBulkUpdate(user => {
        user.attributes.updateTime = new Date();
        return user;
    });

    User.beforeCreate((user) => {
        console.log(user);
        return user;
    });
    User.prototype.isAdminSync = function () {
        return this.roles != null && this.roles.some(role => role.name === 'ROLE_ADMIN');
    };
    User.prototype.isAdminAsync = async function () {
        let isAdmin = false;
        await this.getRoles().then(roles => {
            isAdmin = roles.some(r => r.name === 'ROLE_ADMIN');
        }).catch(err => {
            console.error(err);
// foreignKey: 'userId', otherKey: 'roleId'
        });

        return isAdmin;
    };

    User.prototype.isValidPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };
    User.prototype.generateJwt = function () {
        return jwt.sign(
            {
                userId: this.id,
                username: this.get('username,'),
                roles: this.roles.map(role => role.name)
            },
            process.env.JWT_SECRET || 'JWT_SUPER_SECRET',
            {expiresIn: process.env.EXPIRE_TIME || 360000}
        );
    };
    return User;
};
