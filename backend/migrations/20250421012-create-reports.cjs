'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
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
      target_type: {
        type: Sequelize.ENUM('trivia', 'question', 'comment'),
        allowNull: false,
      },
      target_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'resolved', 'dismissed'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      resolved_by: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      resolved_at: {
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("reports")
  }
};
