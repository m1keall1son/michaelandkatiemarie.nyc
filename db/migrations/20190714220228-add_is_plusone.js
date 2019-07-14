'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'guests',
      'is_plusone',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('guests', 'is_plusone')
  }
};
