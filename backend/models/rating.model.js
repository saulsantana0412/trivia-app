import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      // Relación con la tabla `users` (quién hizo la valoración)
      Rating.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
      });

      // Relación con la tabla `trivias` (trivia que fue valorada)
      Rating.belongsTo(models.Trivia, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Rating.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      trivia_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'trivias',
          key: 'id',
        },
      },
      rating: {
        type: DataTypes.DECIMAL(3,2),
        allowNull: false,
        validate: {
          min: 0.00, // Valor mínimo
          max: 5.00, // Valor máximo
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'ratings',
      timestamps: false, // No agregamos `createdAt` y `updatedAt`, ya que la migración ya define `created_at`
    }
  );

  return Rating;
};
