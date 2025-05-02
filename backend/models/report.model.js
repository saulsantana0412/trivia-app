import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // Relación con la tabla `users` (quién hizo el reporte)
      Report.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // Relación con el usuario que resolvió el reporte
      Report.belongsTo(models.User, {
        foreignKey: 'resolved_by',
        as: 'resolver',
        onDelete: 'SET NULL',
      });

      // Relación con los posibles objetos reportados
      Report.belongsTo(models.Trivia, {
        foreignKey: 'target_id',
        constraints: false,
        scope: {
          target_type: 'trivia',
        },
      });

      Report.belongsTo(models.Question, {
        foreignKey: 'target_id',
        constraints: false,
        scope: {
          target_type: 'question',
        },
      });

      Report.belongsTo(models.Comment, {
        foreignKey: 'target_id',
        constraints: false,
        scope: {
          target_type: 'comment',
        },
      });
    }
  }

  Report.init(
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
      target_type: {
        type: DataTypes.ENUM('trivia', 'question', 'comment'),
        allowNull: false,
      },
      target_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      resolved_by: {
        type: DataTypes.UUID,
        allowNull: true, // Puede ser NULL si no ha sido resuelto aún
        references: {
          model: 'users',
          key: 'id',
        },
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'reports',
      timestamps: false, // No agregamos `createdAt` y `updatedAt` porque la migración ya define `created_at`
    }
  );

  return Report;
};
