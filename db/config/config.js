// {
//   "development": {
//     "storage": "db/guests.dev.db",
//     "dialect": "sqlite"
//   },
//   "test": {
//     "storage": "db/guests.test.db",
//     "dialect": "sqlite"
//   },
//   "production": {
//     "storage": "db/guests.db",
//     "dialect": "sqlite"
//   }
// }


const fs = require('fs')
const UTILS = require('utils')
const log = UTILS.logger()

module.exports = {
  development: {
    storage: 'db/guests.dev.db',
    dialect: 'sqlite',
    logging: log.verbose
  },
  test: {
    storage: 'db/guests.test.db',
    dialect: 'sqlite',
    logging: log.verbose
  },
  production: {
    storage: 'db/guests.db',
    dialect: 'sqlite',
    logging: log.verbose
  }
}