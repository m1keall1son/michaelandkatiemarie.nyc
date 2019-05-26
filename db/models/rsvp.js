'use strict';
module.exports = (sequelize, DataTypes) => {
  const rsvp = sequelize.define('rsvps', {
    guest_id: DataTypes.INTEGER,
    guest_count: DataTypes.INTEGER,
    response: DataTypes.STRING
  }, {});
  rsvp.associate = function(models) {
    // associations can be defined here
  };
  return rsvp;
};