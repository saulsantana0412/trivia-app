'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('trivias', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
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
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_competitive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      play_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.DECIMAL(3,2),
        defaultValue: 0
      },
      rating_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    },  { timestamps: true })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("trivias")
  }
};
