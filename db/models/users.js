'use strict';
const bcrypt = require('bcrypt-nodejs')

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, 
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(user.password, salt)
      },
      beforeUpdate: (user) => {
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(user.password, salt)
      }
    }  
});

  users.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password)
  }

  users.associate = function(models) {
    // associations can be defined here
  };
  
  return users;
};