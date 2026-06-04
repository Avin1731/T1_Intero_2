const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Practitioner = sequelize.define(
  'Practitioner',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ihsNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'practitioners',
    timestamps: true,
  }
);

module.exports = Practitioner;
