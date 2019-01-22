'use strict';
module.exports = (sequelize, DataTypes) => {
  const guests = sequelize.define('guests', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  guests.associate = function(models) {
    // associations can be defined here
  };
  return guests;
};