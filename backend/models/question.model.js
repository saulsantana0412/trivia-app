import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      // Relación con la tabla `categories`
      Question.belongsTo(models.Category, {
        foreignKey: 'category_id',
        onDelete: 'SET NULL',
      });

      // Relación con la tabla `users` (quién la creó)
      Question.belongsTo(models.User, {
        foreignKey: 'created_by',
        onDelete: 'SET NULL',
      });

      Question.belongsToMany(models.Trivia, {
        through: models.TriviaQuestion,
        foreignKey: 'question_id'
      })

      // Relación con `choices`, `question_pairs` y `question_ordering`
      Question.hasMany(models.Choice, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });

      Question.hasMany(models.QuestionPair, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });

      Question.hasMany(models.QuestionOrdering, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });
      

    }
  }

  Question.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('multiple_choice', 'multi_answer', 'true_false', 'matching', 'ordering'),
        allowNull: false,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'easy',
      },
      media_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isUrl: true, // Verifica que sea una URL válida
        },
      },
      is_competitive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'questions',
      timestamps: false, // No agregamos `createdAt` y `updatedAt` porque la migración ya los define.
    }
  );

  return Question;
};
