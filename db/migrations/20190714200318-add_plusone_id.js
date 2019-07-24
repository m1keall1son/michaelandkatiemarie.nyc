'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Families',
      'plusone_id',
      {
        type: Sequelize.BOOLEAN
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Families',
      'plusone_id'
    )
  }
};
