module.exports = (sequelize, DataTypes) => {
    const {INTEGER, STRING, TEXT, DATE} = DataTypes;
    const Role = sequelize.define('roles', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: STRING(50),
            allowNull: false,
            unique: true,
        },
        description: {
            type: TEXT(255),
            allowNull: false,
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
        tableName: 'roles',
    });

    Role.associate = function (models) {
        // In Sequelize through is required
        // now we can call : getUsers, setUsers, addUser, addUsers
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: 'roleId',
            otherKey: 'userId',
        });
    };

    return Role;
};
