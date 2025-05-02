'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
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
      rating: {
        type: Sequelize.DECIMAL(3,2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ratings')
  }
};
