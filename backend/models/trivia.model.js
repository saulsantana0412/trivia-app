import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Trivia extends Model {
    static associate(models) {
      // Relación con la tabla `categories`
      Trivia.belongsTo(models.Category, {
        foreignKey: 'category_id',
        onDelete: 'SET NULL',
      });

      // Relación con `users` (autor de la trivia)
      Trivia.belongsTo(models.User, {
        foreignKey: 'created_by',
        onDelete: 'SET NULL',
      });

      // Relación con `trivia_questions` (preguntas dentro de la trivia)
      Trivia.hasMany(models.TriviaQuestion, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });

      Trivia.belongsToMany(models.Question, {
        through: models.TriviaQuestion,
        foreignKey: 'trivia_id'
      })

      // Relación con `games` (juegos generados a partir de la trivia)
      Trivia.hasMany(models.Game, {
        foreignKey: 'trivia_id',
        onDelete: 'SET NULL',
      });

      // Relación con `ratings` (valoraciones recibidas)
      Trivia.hasMany(models.Rating, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });

      // Relación con `comments` (comentarios en la trivia)
      Trivia.hasMany(models.Comment, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });

      // Relación con `reports` (reportes realizados sobre esta trivia)
      Trivia.hasMany(models.Report, {
        foreignKey: 'target_id',
        scope: { target_type: 'trivia' },
        onDelete: 'CASCADE',
      });

    }
  }

  Trivia.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
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
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_competitive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      play_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.DECIMAL(3,2),
        defaultValue: 0,
      },
      rating_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'trivias',
      timestamps: true,
    }
  );

  return Trivia;
};
