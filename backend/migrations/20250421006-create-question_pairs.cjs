'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('question_pairs', {
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
      left_item: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      right_item: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('question_pairs')
  }
};
