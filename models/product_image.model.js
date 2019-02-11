module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('product_images', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'productId'
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'file_name'
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'file_path'
        },
        originalName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'original_name'
        },
        fileSize: {
            type: DataTypes.INTEGER, allowNull: false,
            field: 'file_size'
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
        tableName: 'file_uploads',
        defaultScope: {
            where: {
                productId: {
                    [sequelize.Op.ne]: null
                }
            }
        }
    });

    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, {onDelete: 'cascade'});
    };

    return ProductImage;
};

