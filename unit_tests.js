const UTILS = require('utils')
const log = UTILS.logger()
const get_app = require('./wedding_app')
const app = get_app()

module.exports = (data) => {

	if(!data){
		log.fatalError('must give a data object to unit tests')
	}

	///database tests

	//app tests

	return 0
}