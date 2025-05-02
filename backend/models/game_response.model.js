import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class GameResponse extends Model {
    static associate(models) {
      // Relación con `GamePlayer` (quién respondió)
      GameResponse.belongsTo(models.GamePlayer, {
        foreignKey: 'game_player_id',
        onDelete: 'CASCADE',
      });

      // Relación con `Questions` (pregunta respondida)
      GameResponse.belongsTo(models.Question, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });
    }
  }

  GameResponse.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      game_player_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'game_players',
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
      answered_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      response_time_ms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0, // No permitir tiempos negativos
        },
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: false, // Guarda los índices de respuestas seleccionadas
      },
    },
    {
      sequelize,
      tableName: 'game_responses',
      timestamps: false, // No se gestionan automáticamente `createdAt` y `updatedAt`
    }
  );

  return GameResponse;
};
