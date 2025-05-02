import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Choice extends Model {
    static associate(models) {
      // Relación con la tabla `questions`
      Choice.belongsTo(models.Question, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Choice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'choices',
      timestamps: false, // No se agregan `createdAt` y `updatedAt`
    }
  );

  return Choice;
};
