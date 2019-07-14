'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    const addAddress = queryInterface.addColumn(
      'Families',
      'address',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )
    const addAddress2 = queryInterface.addColumn(
      'Families',
      'address2',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )
    const addZip = queryInterface.addColumn(
      'Families',
      'zip',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )
    return Promise.all([ addAddress, addAddress2, addZip])
  },

  down: (queryInterface, Sequelize) => {

    const removeAddress = queryInterface.removeColumn(
      'Families',
      'address'
    )
    const removeAddress2 = queryInterface.removeColumn(
      'Families',
      'address2'
    )
    const removeZip = queryInterface.removeColumn(
      'Families',
      'zip'
    )
    return Promise.all([removeAddress, removeAddress2, removeZip])
  }
};
