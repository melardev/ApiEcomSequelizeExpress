module.exports = function (sequelize, DataTypes) {
    const Address = sequelize.define(
        'addresses', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            firstName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'first_name'
            },
            lastName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                field: 'last_name'
            },
            city: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            address: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            country: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },

            zipCode: {
                type: DataTypes.STRING(6),
                allowNull: false,
                field: 'zip_code',
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
                field: 'created_at'
            },

            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
                field: 'updated_at'
            },
        }, {
            tableName: 'addresses'
        }
    );

    Address.associate = function (models) {
        Address.belongsTo(models.User, {onDelete: 'cascade', foreignKey: 'userId'});
    };
    return Address;
};