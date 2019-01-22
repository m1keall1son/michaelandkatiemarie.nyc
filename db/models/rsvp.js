'use strict';
module.exports = (sequelize, DataTypes) => {
  const rsvp = sequelize.define('rsvp', {
    guest_id: DataTypes.INTEGER,
    guest_count: DataTypes.INTEGER
  }, {});
  rsvp.associate = function(models) {
    // associations can be defined here
  };
  return rsvp;
};