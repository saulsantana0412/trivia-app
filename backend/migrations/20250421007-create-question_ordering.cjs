'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('question_ordering', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      correct_position: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('question_ordering')
  }
};
