const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Driver",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      forename: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        //fecha de nacimiento
        type: DataTypes.DATE, 
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
