'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('users_roles', {
        userId: {
            type: DataTypes.INTEGER,
            field: 'userId'
        },
        roleId: {
            type: DataTypes.INTEGER,
            field: 'roleId'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },
    }, {
        tableName: 'users_roles',
        timestamps: false,
    });
    UserRole.associate = function (models) {
        // associations can be defined here
        // UserRole.belongsTo(models.Role);
        // UserRole.belongsTo(models.User);
    };
    return UserRole;
};