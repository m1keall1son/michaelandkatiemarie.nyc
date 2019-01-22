'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('guests', [
      {
        firstname: 'Michael',
        lastname: 'Allison',
        email: 'hello@michaelallison.lol',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'KatieMarie',
        lastname: 'Gorczynski',
        email: 'katiemarie.gorczynski@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Cat',
        lastname: 'The Cat',
        email: 'hello@michaelandkatiemarie.nyc',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('guests', null, {});
  }
};
