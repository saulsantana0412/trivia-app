import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Team extends Model {
    static associate(models) {
      // Relación con la tabla `games` (cada equipo pertenece a un juego)
      Team.belongsTo(models.Game, {
        foreignKey: 'game_id',
        onDelete: 'CASCADE',
      });

      // Relación con `GamePlayer` (un equipo tiene varios jugadores)
      Team.hasMany(models.GamePlayer, {
        foreignKey: 'team_id',
        onDelete: 'SET NULL',
      });
    }
  }

  Team.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true, // Puede ser null si no se asigna un ícono
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'teams',
      timestamps: false, // No se gestionan automáticamente `createdAt` y `updatedAt`
    }
  );

  return Team;
};
