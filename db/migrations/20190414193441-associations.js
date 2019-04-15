'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
       'guests',
       'family',
       {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false
       }
    ).then(_ => queryInterface.addColumn(
       'guests',
       'plusone',
       {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
       }
    ))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('guests', 'family')
        .then(_ => queryInterface.removeColumn('guests', 'plusone'))
  }
};
