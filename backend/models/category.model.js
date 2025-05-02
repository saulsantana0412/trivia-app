import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Relación con preguntas y trivias
      Category.hasMany(models.Question, {
        foreignKey: 'category_id',
        onDelete: 'SET NULL',
      });

      Category.hasMany(models.Trivia, {
        foreignKey: 'category_id',
        onDelete: 'SET NULL',
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50], // Limitar el nombre a un tamaño razonable
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'categories',
      timestamps: false, // No agregamos automáticamente createdAt/updatedAt
    }
  );

  return Category;
};
