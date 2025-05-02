'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      parent_comment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      is_flagged: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('comments')
  }
};
