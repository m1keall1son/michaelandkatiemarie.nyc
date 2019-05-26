'use strict';
module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define('Families', {
    name: DataTypes.STRING,
    plusone: DataTypes.BOOLEAN
  }, {});
  Family.associate = function(models) {
    // associations can be defined here
  };
  return Family;
};