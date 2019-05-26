'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('guests', [
        {
          firstname: "Pam",
          lastname: "Allison",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 3,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Everest",
          lastname: "Allison",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 4,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Jack",
          lastname: "Allison",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 4,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Tess",
          lastname: "Apfel",
          email: "tess.kramer@gmail.com",
          user_id: null,
          admin: 0,
          family_id: 6,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Bill",
          lastname: "Brooks",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 8,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Jacques",
          lastname: "Johnson",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 21,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Uncle Tommy",
          lastname: "Gorczynski",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 27,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Uncle Joe",
          lastname: "Iosca",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 33,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Becky",
          lastname: "Preuss",
          email: "rebecca.a.preuss@gmail.com",
          user_id: null,
          admin: 0,
          family_id: 34,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Dr. Bernie",
          lastname: "Kurek",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 37,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Mark",
          lastname: "Lepage",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 39,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Dave",
          lastname: "Liles",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 40,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Uncle Bill",
          lastname: "Matta",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 43,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Skip",
          lastname: "Sutcliffe",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 44,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Kristin",
          lastname: "McGowan",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 45,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Lyla",
          lastname: "Turner",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 47,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Liz",
          lastname: "Patt",
          email: "lizzypetersen@yahoo.com",
          user_id: null,
          admin: 0,
          family_id: 50,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Uncle John",
          lastname: "Pirretti",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 51,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Aunt Lillian",
          lastname: "Pirretti",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 51,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Louis",
          lastname: "Pirretti",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 51,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Greg",
          lastname: "Tanzola",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 52,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Uncle Dave",
          lastname: "Rollison",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 53,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Teddy",
          lastname: "Gorczynski",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 55,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Jon",
          lastname: "Shelley",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 60,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Andrew",
          lastname: "Shelley",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 62,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Frank",
          lastname: "Shelley",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 62,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Trevor",
          lastname: "Shuckhart",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 63,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Brandon",
          lastname: "Shuckhart",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 63,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Dan",
          lastname: "Dalton",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 65,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Tim",
          lastname: "Turck",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 66,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Wanye",
          lastname: "Watford",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 69,
          rehearsal: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstname: "Uncle Bill",
          lastname: "Whiting",
          email: null,
          user_id: null,
          admin: 0,
          family_id: 71,
          rehearsal: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Pam"},
          {lastname: "Allison"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Jack"},
          {lastname: "Allison"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Everest"},
          {lastname: "Allison"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Tess"},
          {lastname: "Apfel"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Bill"},
          {lastname: "Brooks"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Jacques"},
          {lastname: "Johnson"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Uncle Tommy"},
          {lastname: "Gorczynski"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Uncle Joe"},
          {lastname: "Iosca"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Dr. Bernie"},
          {lastname: "Kurek"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Mark"},
          {lastname: "Lepage"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Dave"},
          {lastname: "Liles"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Uncle Bill"},
          {lastname: "Matta"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Skip"},
          {lastname: "Sutcliffe"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Kristin"},
          {lastname: "McGowan"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Lyla"},
          {lastname: "Turner"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Liz"},
          {lastname: "Patt"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Uncle John"},
          {lastname: "Pirretti"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Aunt Lillian"},
          {lastname: "Pirretti"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Louis"},
          {lastname: "Pirretti"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Greg"},
          {lastname: "Tanzola"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Uncle Dave"},
          {lastname: "Rollison"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Teddy"},
          {lastname: "Gorczynski"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Jon"},
          {lastname: "Shelley"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Andrew"},
          {lastname: "Shelley"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Frank"},
          {lastname: "Shelley"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Trevor"},
          {lastname: "Shuckhart"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Brandon"},
          {lastname: "Shuckhart"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Dan"},
          {lastname: "Dalton"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Tim"},
          {lastname: "Turck"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Wayne"},
          {lastname: "Watford"}] 
        }, {}),
      queryInterface.bulkDelete('guests', 
        { [Op.and]: [
          {firstname: "Uncle Bill"},
          {lastname: "Whiting"}] 
        }, {}),
    ])
  }
};


