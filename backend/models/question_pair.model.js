import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class QuestionPair extends Model {
    static associate(models) {
      // Relación con `Questions`
      QuestionPair.belongsTo(models.Question, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE',
      });
    }
  }

  QuestionPair.init(
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
      left_item: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      right_item: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'question_pairs',
      timestamps: false, // No agregamos `createdAt` y `updatedAt`, ya que la migración no los define.
    }
  );

  return QuestionPair;
};
