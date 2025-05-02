import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AuthProvider extends Model {
    static associate(models) {
      AuthProvider.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  AuthProvider.init(
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
          model: 'users', // Relación con la tabla 'users'
          key: 'id',
        },
      },
      provider: {
        type: DataTypes.ENUM('google', 'facebook'),
        allowNull: false,
      },
      provider_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: true, // Puede ser null si el proveedor no lo requiere
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true, // Puede ser null si no se usa refresh token
      },
      linked_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true, // Puede ser null si no se gestiona expiración
      },
    },
    {
      sequelize,
      tableName: 'auth_providers',
      timestamps: false, // No usamos `createdAt` y `updatedAt` en esta tabla
    }
  );

  return AuthProvider;
};
