module.exports = (sequelize, DataTypes) => {
    const ProductTag = sequelize.define('products_tags', {

        productId: {
            type: DataTypes.INTEGER,
            field: 'productId'
        },
        tagId: {
            type: DataTypes.INTEGER,
            field: 'tagId'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: new Date(),
        }
    }, {
        tableName: 'products_tags',
        timestamps: false,
        classMethods: {
            associate(models) {
                ProductTag.belongsTo(models.Product);
                ProductTag.belongsTo(models.Tag);
            },
        },
    });

    return ProductTag;
};
