'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users_roles', {

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
        })/*.then(() => {
            let sql = `CREATE UNIQUE INDEX UserRoleCompoundIndex ON UserRoles USING btree ("userId", "roleId")`;
            return queryInterface.sequelize.query(sql, {raw: true});
        });*/
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users_roles');
    }
};