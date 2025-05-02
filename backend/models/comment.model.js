import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Relación con la tabla `users`
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
      });

      // Relación con la tabla `trivias`
      Comment.belongsTo(models.Trivia, {
        foreignKey: 'trivia_id',
        onDelete: 'CASCADE',
      });

      // Relación con comentarios padre-hijo (para respuestas a comentarios)
      Comment.belongsTo(models.Comment, {
        foreignKey: 'parent_comment_id',
        as: 'parentComment',
        onDelete: 'CASCADE',
      });

      // Relación inversa: Un comentario puede tener muchas respuestas
      Comment.hasMany(models.Comment, {
        foreignKey: 'parent_comment_id',
        as: 'replies',
      });
    }
  }

  Comment.init(
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
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1, 1000], // Limitar el comentario entre 1 y 1000 caracteres
        },
      },
      parent_comment_id: {
        type: DataTypes.UUID,
        allowNull: true, // Puede ser null si es un comentario raíz
        references: {
          model: 'comments',
          key: 'id',
        },
      },
      is_flagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: 'comments',
      timestamps: false, // Evita los `createdAt` y `updatedAt` automáticos de Sequelize
    }
  );

  return Comment;
};
