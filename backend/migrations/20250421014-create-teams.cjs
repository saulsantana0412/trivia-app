'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("teams")
  }
};
