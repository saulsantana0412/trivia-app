'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      trivia_id: {
        type: Sequelize.UUID,
        references: {
          model: "trivias",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      mode: {
        type: Sequelize.ENUM('classic', 'challenge', 'time_attack', 'head_to_head', 'party'),
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.ENUM('easy', 'medium', 'hard'),
        allowNull: false
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      started_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ended_at: {
        type: Sequelize.DATE,
      },
      is_ranked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('games')
  }
};
