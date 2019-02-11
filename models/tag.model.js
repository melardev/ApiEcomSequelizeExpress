'use strict';
const slugify = require('slugify');
module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('tags', {
        name: DataTypes.STRING,
        slug: {type: DataTypes.STRING, allowNull: false},
        description: DataTypes.STRING,
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
        hooks: {
            beforeValidate: function (tag, options) {
                tag.slug = slugify(tag.name, {lower: true});

                /*
                if(user.getRoles().length === 0)
                    user.setRoles([]);
                */
                // cb(null, options);
            }
        }
    });
    Tag.associate = function (models) {
        // as is required because Tag.hasMany ProductTag and Product.hasMany ProductTag so sequelize
        // generates the same alias twice and hence it throws an exception, with as, we are setting another alias name
        // in order to not collide.
        //    Tag.hasMany(models.ProductTag,{as: 'productsTags'});
        Tag.belongsToMany(models.Product, {through: models.ProductTag});
        Tag.hasMany(models.TagImage, {as: 'images'});
    };
    return Tag;
};