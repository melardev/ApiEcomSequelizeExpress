module.exports = (sequelize, DataTypes) => {
    const ProductCategory = sequelize.define('products_categories', {

        productId: {
            type: DataTypes.INTEGER,
            field: 'productId',
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'categoryId'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },
    }, {
        tableName: 'products_categories',
        timestamps: false,
        classMethods: {
            associate(models) {
                ProductCategory.belongsTo(models.Product, {as: 'product', foreignKey: 'productId'});
                // ProductCategory.belongsTo(models.Category);
                ProductCategory.belongsTo(models.Category, {as: 'category', foreignKey: 'categoryId'});
            },
        },
    });

    return ProductCategory;
};
