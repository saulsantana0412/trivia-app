'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('game_responses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      game_player_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "game_players",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "questions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      answered_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      response_time_ms: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      answers: {
        type: Sequelize.JSON,
        allowNull: false
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('game_responses')
  }
};
