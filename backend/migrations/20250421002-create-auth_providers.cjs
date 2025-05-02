'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('auth_providers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      provider: {
        type: Sequelize.ENUM('google', 'facebook'),
        allowNull: false,
      },
      provider_user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      access_token: {
        type: Sequelize.STRING,
      },
      refresh_token: {
        type: Sequelize.STRING,
      },
      linked_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      token_expires_at: {
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('auth_providers')
  }
};
