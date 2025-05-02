'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('trivia_questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      trivia_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "trivias",
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
      question_order: {
        type: Sequelize.INTEGER,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("trivia_questions")
  }
};
