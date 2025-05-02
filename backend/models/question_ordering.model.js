import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class QuestionOrdering extends Model {
    static associate(models) {
      // Relación con `Questions`
      QuestionOrdering.belongsTo(models.Question, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });
    }
  }

  QuestionOrdering.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correct_position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1, // Asegurar que la posición no sea negativa
        },
      },
    },
    {
      sequelize,
      tableName: 'question_ordering',
      timestamps: false, // No agregamos `createdAt` y `updatedAt` porque la migración no los define.
    }
  );

  return QuestionOrdering;
};
