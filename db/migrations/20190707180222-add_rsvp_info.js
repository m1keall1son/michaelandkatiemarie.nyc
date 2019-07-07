'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    const dropRsvp = queryInterface.dropTable('rsvps')

    const addRsvp = queryInterface.addColumn(
      'guests',
      'rsvp',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )

    const addAllergies = queryInterface.addColumn(
      'guests',
      'allergies',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )

    const addArrival = queryInterface.addColumn(
      'Families',
      'arrival',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )

    const addDeparture = queryInterface.addColumn(
      'Families',
      'departure',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )

    const addNotes = queryInterface.addColumn(
      'Families',
      'notes',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )

    const addAccomodations = queryInterface.addColumn(
      'Families',
      'accomodations',
      {
        type: Sequelize.STRING,
        defaultValue:""
      }
    )

    const addTraveling = queryInterface.addColumn(
      'Families',
      'traveling',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    )

    return Promise.all([dropRsvp, addRsvp, addAllergies, addArrival, addDeparture, addNotes, addAccomodations, addTraveling]);
  },

  down: (queryInterface, Sequelize) => {
      
    const createRsvp = sequelize.createTable('rsvps', {
        guest_id: DataTypes.INTEGER,
        guest_count: DataTypes.INTEGER,
        response: DataTypes.STRING
    });

    const removeRsvp = queryInterface.removeColumn(
      'guests',
      'rsvp'
    )

    const removeAllergies = queryInterface.removeColumn(
      'guests',
      'allergies'
    )

    const removeArrival = queryInterface.removeColumn(
      'Families',
      'arrival'
    )

    const removeDeparture = queryInterface.removeColumn(
      'Families',
      'departure'
    )

    const removeNotes = queryInterface.removeColumn(
      'Families',
      'notes'
    )

    const removeAccomodations = queryInterface.removeColumn(
      'Families',
      'accomodations'
    )

    const removeTraveling = queryInterface.removeColumn(
      'Families',
      'traveling'
    )

    return Promise.all([createRsvp, removeRsvp, removeAllergies, removeArrival, removeDeparture, removeNotes, removeAccomodations, removeTraveling]);
  }
};
