import { v4 as uuidv4 } from "uuid";

export const Rule = (sequelize, DataTypes) => {
  const Rule = sequelize.define(
    "rule",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tables: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      inputAttributes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      outputAttributes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      condition: {
        type: DataTypes.JSON,
        defaultValue: { nodes: [], edges: [] },
      },
      tested: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      version: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
      },
    },
    { timestamps: true }
  );
  return Rule;
};
