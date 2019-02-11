const ORDER_STATUS = require('../constants').ORDER_STATUS;
const _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
    const {INTEGER, DATE, BIGINT, DECIMAL, UUID, STRING, UUIDV4} = DataTypes;

    const Order = sequelize.define('orders', {

        id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        userId: {
            type: INTEGER,
            allowNull: true,
            field: 'userId',
        },

        trackingNumber: {
            type: DataTypes.STRING,
            unique: true,
            field: 'tracking_number'
        },

        addressId: {
            type: DataTypes.INTEGER,
            field: 'addressId',
            references: {
                model: 'Addresses',
                key: 'id'
            }
        },

        orderStatus: {
            type: DataTypes.INTEGER,
            field: 'order_status',
            values: [ORDER_STATUS.processed.ordinal, ORDER_STATUS.delivered.ordinal, ORDER_STATUS.shipped.ordinal]
        },

        orderStatusStr: {
            type: DataTypes.VIRTUAL,
            get: function () {
                let result = undefined;
                _.forOwn(ORDER_STATUS, (value, key) => {
                    if (value.ordinal === this.get('orderStatus')) {
                        return result = key;
                    }
                });
                return result;
            }
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
        timestamps: false,
        tableName: 'orders',
        indexes: [
            {fields: ['userId']},
            {fields: ['trackingNumber']},
        ],
    });

    // Order.hasOne(OrderInfo, {foreign_key: 'orderId'});

    Order.associate = (models) => {
        Order.hasMany(models.OrderItem);
        Order.belongsTo(models.User, {foreignKey: 'userId'});
        Order.belongsTo(models.Address, {foreignKey: 'addressId'});
    };

    Order.beforeBulkUpdate(order => {
        order.attributes.updateTime = new Date();
        return order;
    });

    return Order;
};
