const UTILS = require('utils')
const log = UTILS.logger()
const get_app = require('./wedding_app')
const app = get_app()

module.exports = () => {

	let api = new UTILS.API('/guest','Guest Management API')

	api.router.route('/list')
		.get((req, res) => {
			return app.guestList()
				.then(guests=>res.send(guests))
				.catch(error=>res.status(500).send(error))
	    })

	api.router.route('/adminlist')
		.get((req, res) => {
			return app.guestList()
				.then(guests=>{ 
					let data = {
						guestdata: []
					}
					for(let i = 0; i < guests.length; ++i){
						let g = {
							firstname: guests[i].firstname,
							lastname: guests[i].lastname,
							admin: guests[i].admin,
							email: guests[i].email,
							rehearsal: guests[i].rehearsal,
							plusone: guests[i].plusone,
							family: guests[i].family,
							user_id: guests[i].user_id
						}
						data.guestdata.push(g)
					}
					res.render('admin/guestrecord.pug', data)
				})
				.catch(error=>res.status(500).send(error))
	    })
	    
	return api
}
