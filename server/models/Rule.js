import { Deferrable } from "sequelize";
import { User } from "./User.js";
import db from "./index.js";

export const Rule = (sequelize, DataTypes) => {
  const Rule = sequelize.define(
    "rule",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descryption: {
        type: DataTypes.STRING,
        allowNull: true,
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
      version: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
      },
    },
    { timestamps: true }
  );
  return Rule;
};
