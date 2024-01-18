export const BankUser = (sequelize, DataTypes) => {
  const BankUser = sequelize.define(
    "BankUser",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      employment_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      annual_income: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      credit_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: true }
  );
  return BankUser;
};
