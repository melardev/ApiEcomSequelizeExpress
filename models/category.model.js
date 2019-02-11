const slugify = require('slugify');
module.exports = function (sequelize, DataTypes) {

    const {INTEGER, STRING, TEXT} = DataTypes;
    const Category = sequelize.define('categories', {
        /*  id: {
            type: UUID,
            defaultValue: UUIDV4,
            allowNull: false,
            primaryKey: true,
            // autoIncrement: true,
          },
      */
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(50),
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
        timestamps: false,
        tableName: 'categories',

        hooks: {
            beforeValidate: function (category, options) {
                category.slug = slugify(category.name, {lower: true});
            }
        },
    });

    Category.associate = function (models) {
        Category.belongsToMany(models.Product, {through: models.ProductCategory});
        Category.hasMany(models.CategoryImage, {as: 'images'});
    };
    Category.beforeBulkUpdate(category => {
        category.attributes.updateTime = new Date();
        return category;
    });

    return Category;
};
