export const User = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "BankUser",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
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
      loan_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loan_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loan_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  return User;
};
