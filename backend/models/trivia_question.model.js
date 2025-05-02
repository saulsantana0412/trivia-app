import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TriviaQuestion extends Model {
    static associate(models) {
      // Relación con la tabla `trivias`
      TriviaQuestion.belongsTo(models.Trivia, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });

      // Relación con la tabla `questions`
      TriviaQuestion.belongsTo(models.Question, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });
    }
  }

  TriviaQuestion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      trivia_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'trivias',
          key: 'id',
        },
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      question_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'trivia_questions',
      timestamps: false, // No se agregan `createdAt` y `updatedAt`
    }
  );

  return TriviaQuestion;
};
