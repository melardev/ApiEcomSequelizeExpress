'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('file_uploads', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            tagId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'tags',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onDelete: 'cascade'
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            file_name: {type: Sequelize.STRING, allowNull: false},
            file_path: {type: Sequelize.STRING, allowNull: false},
            original_name: {type: Sequelize.STRING, allowNull: false},
            file_size: {type: Sequelize.INTEGER, allowNull: false},

            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('file_uploads');
    }
};