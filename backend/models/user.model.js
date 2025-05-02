import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relación con `AuthProvider`
      User.hasMany(models.AuthProvider, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // Relación con `Comments`
      User.hasMany(models.Comment, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
      });

      // Relación con `Trivias` (usuario creador de trivias)
      User.hasMany(models.Trivia, {
        foreignKey: 'created_by',
        onDelete: 'SET NULL',
      });

      // Relación con `Games` (usuario creador de juegos)
      User.hasMany(models.Game, {
        foreignKey: 'created_by',
        onDelete: 'SET NULL',
      });

      // Relación con `Ratings` (valoraciones de trivias)
      User.hasMany(models.Rating, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
      });

      // Relación con `Reports` (reportes de contenido)
      User.hasMany(models.Report, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Validación para correos electrónicos.
        },
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50], // Alias entre 3 y 50 caracteres.
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true, // Validación para asegurarse de que es una URL válida.
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: 'users',
      timestamps: false, // Deshabilita la gestión automática de timestamps.
    }
  );

  return User;
};
