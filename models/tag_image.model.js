module.exports = (sequelize, DataTypes) => {
    const TagImage = sequelize.define('tag_images', {
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
                tagId: {
                    [sequelize.Op.ne]: null
                }
            }
        }
    });

    TagImage.associate = (models) => {
        TagImage.belongsTo(models.Tag, {onDelete: 'cascade'});
    };

    return TagImage;
};

