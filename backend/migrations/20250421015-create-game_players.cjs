'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('game_players', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      game_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "games",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      team_id: {
        type: Sequelize.UUID,
        references: {
          model: "teams",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      final_score: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('game_players')

  }
};
