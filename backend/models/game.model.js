import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      // Relación con la tabla `trivias`
      Game.belongsTo(models.Trivia, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });

      // Relación con la tabla `users` (creador del juego)
      Game.belongsTo(models.User, {
        foreignKey: 'created_by',
        onDelete: 'SET NULL',
      });

      // Relación con `GamePlayer` (jugadores en la partida)
      Game.hasMany(models.GamePlayer, {
        foreignKey: 'game_id',
        onDelete: 'SET NULL',
      });
    }
  }

  Game.init(
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
      mode: {
        type: DataTypes.ENUM('classic', 'challenge', 'time_attack', 'head_to_head', 'party'),
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      started_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_ranked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'games',
      timestamps: false, // No agregamos `createdAt` y `updatedAt` porque la migración ya maneja fechas manualmente
    }
  );

  return Game;
};
