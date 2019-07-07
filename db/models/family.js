'use strict';
module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define('Families', {
    name: DataTypes.STRING,
    plusone: DataTypes.BOOLEAN,
    traveling: DataTypes.BOOLEAN,
    arrival: DataTypes.STRING,
    departure: DataTypes.STRING,
    accomodations: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {});
  Family.associate = function(models) {
    // associations can be defined here
  };
  return Family;
};