import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class GamePlayer extends Model {
    static associate(models) {
      // Relación con la tabla `games`
      GamePlayer.belongsTo(models.Game, {
        foreignKey: 'game_id',
        onDelete: 'CASCADE',
      });

      // Relación con la tabla `users`
      GamePlayer.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
      });

      // Relación con la tabla `teams` (puede ser null)
      GamePlayer.belongsTo(models.Team, {
        foreignKey: 'team_id',
        onDelete: 'SET NULL',
      });
    }
  }

  GamePlayer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      game_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      team_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      final_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: 0, // No permitir valores negativos
        },
      },
    },
    {
      sequelize,
      tableName: 'game_players',
      timestamps: false, // No se gestionan automáticamente `createdAt` y `updatedAt`
    }
  );

  return GamePlayer;
};
