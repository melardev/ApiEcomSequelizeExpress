module.exports = (sequelize, DataTypes) => {
    const FileUpload = sequelize.define('file_uploads', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tagId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'tagId'
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'categoryId'
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'productId'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'productId'
        },

        fileName: {type: DataTypes.STRING, allowNull: false},
        filePath: {type: DataTypes.STRING, allowNull: false},
        originalName: {type: DataTypes.STRING, allowNull: false},
        fileSize: {type: DataTypes.INTEGER, allowNull: false},

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
        tableName: 'file_uploads'
    });

    FileUpload.associate = (models) => {
        FileUpload.belongsTo(models.Tag, {onDelete: 'cascade',});
        FileUpload.belongsTo(models.Product, {foreignKey: 'productId', onDelete: 'cascade'});
        FileUpload.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'cascade'});
        FileUpload.belongsTo(models.Category, {onDelete: 'cascade'});
    };

    return FileUpload;
};

