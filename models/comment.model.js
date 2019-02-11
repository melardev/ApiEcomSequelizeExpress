module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'productId'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'userId'
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            // validate: {len: [1, 10]}
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
        tableName: 'comments'
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.Product, {onDelete: 'cascade'});

        Comment.belongsTo(models.User /*, { foreignKey: 'userId' }*/);
    };

    return Comment;
};

