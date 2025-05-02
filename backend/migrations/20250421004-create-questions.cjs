'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT, 
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('multiple_choice', 'multi_answer', 'true_false', 'matching', 'ordering'),
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: "easy",
      },
      media_url: {
        type: Sequelize.STRING(255), 
      },
      is_competitive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('questions')
  }
};
