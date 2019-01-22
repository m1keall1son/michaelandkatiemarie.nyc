const UTILS = require('utils')
const get_app = require('./wedding_app')
const app = get_app()

module.exports = () => {

	let api = new UTILS.API('/guest','Guest Management API')

	api.router.route('/list')
		.get((req, res) => {
			app.guestList()
				.then(guests=>res.send(guests))
				.catch(error=>res.status(500).send(error))
	    })
	    
	return api
}
