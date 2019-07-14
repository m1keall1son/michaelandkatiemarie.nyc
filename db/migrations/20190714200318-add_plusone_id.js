'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Families',
      'plusone',
      {
        type: Sequelize.BOOLEAN
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Families',
      'plusone'
    )
  }
};
