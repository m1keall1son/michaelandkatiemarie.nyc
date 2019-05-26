const UTILS = require('utils')
const log = UTILS.logger()
const get_app = require('./wedding_app')
const app = get_app()

module.exports = () => {

	let api = new UTILS.API('/api','Guest Management API')

	api.router.route('/list')
		.get((req, res) => {
			return app.guestList()
				.then(guests=>res.send(guests))
				.catch(error=>res.status(500).send(error))
	    })

	api.router.route('/adminlist')
		.get((req, res) => {
			let familyPromise = app.familyList()
			let guestPromise = app.guestList()
			let rsvpPromise = app.rsvpList()
			return Promise.all([guestPromise,familyPromise, rsvpPromise])
			.then(([guests, families, rsvps]) => {

				let data = {
					families: [],
					rsvp_totals: {
						yes: 0, 
						no: 0
					}
				}

				for(let i = 0; i < rsvps.length; ++i){
					if(rsvps[i].response == "yes"){
						data.rsvp_totals.yes++;
					} else {
						data.rsvp_totals.no++;
					}
				}

				for(let i=0; i < families.length; ++i) {

					let f = {
						name: families[i].name,
						id: families[i].id,
						plusone: families[i].plusone,
						guests: []
					}

					for(let j = 0; j < guests.length; ++j){

						if(guests[j].family_id != f.id)
							continue

						let g = {
							id: guests[j].id,
							firstname: guests[j].firstname,
							lastname: guests[j].lastname,
							admin: guests[j].admin,
							email: guests[j].email,
							rehearsal: guests[j].rehearsal,
							family: guests[j].family_id,
							user_id: guests[j].user_id,
							rsvp: null
						}

						for(let k = 0; k < rsvps.length; ++k) {
							if(rsvps[k].guest_id == g.id){
								let r = {
									response: rsvps[k].response
								}
								g.rsvp = r
								break
							}
						}
						f.guests.push(g)
					}
					data.families.push(f)
				}
				res.render('admin/guestrecord.pug', data)
			})
			.catch(error=>res.status(500).send(error))
	    })
	    
	api.router.route('/families')
		.get((req, res) => {
			return app.familyList()
				.then(families => {
					let data = {
						families: []
					}
					for(let i=0; i < families.length; ++i) {
						let f = {
							name: families[i].name,
							id: families[i].id,
							plusone: families[i].plusone
						}
						data.families.push(f)
					}
					res.send(data)
				})
				.catch(error=>res.status(500).send(error))
		})


	api.router.route('/family/:family_id/plusone/yes')
		.post((req,res)=>{
			return app.allowPlusOne(req.params.family_id)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/family/:family_id/plusone/no')
		.post((req,res)=>{
			return app.disallowPlusOne(req.params.family_id)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/:guest_id/rehearsal/yes')
		.post((req,res)=>{
			return app.inviteToRehearsal(req.params.guest_id)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/:guest_id/rehearsal/no')
		.post((req,res)=>{
			return app.uninviteFromRehearsal(req.params.guest_id)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/new')
		.post((req,res)=>{
			return app.newGuest(req.body.firstname, req.body.lastname, req.body.email, req.body.family_id, req.body.rehearsal)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/family/new')
		.post((req,res)=>{
			return app.newFamily(req.body.name, false)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/guestupdate')
		.post((req,res) => {
			log.channel("API").verbose("updating guest: ", req.body.id)
			if(req.body.rehearsal){
				if(req.body.rehearsal == 'true'){
					return app.inviteToRehearsal(req.body.id).then(_=> res.send()).catch(error=>res.status(500).send(error))
				} else { 
					return app.uninviteFromRehearsal(req.body.id).then(_=> res.send()).catch(error=>res.status(500).send(error))
				}
			}
			//default
			res.send()
		})

	api.router.route('/rsvp/yes/:id')
		.post((req,res)=>{
			log.channel("API").verbose("rsvp yes: ", req.params.id)
			return app.database().rsvps.findOrCreate({
				where: {
					guest_id: req.params.id 
				},
				defaults: {
	            	guest_id: req.params.id
	        	}
	        })
	        .then(([rsvp,created]) => {
	        	return rsvp.update({ response: "yes" })
	        	.then(_=> res.send())
				.catch(error=>{
					log.channel("API").error("could not set rsvp response: ", error)
					res.status(500).send(error)
				})
	        })
	        .catch(error=>{
	        	log.channel("API").error("could not fond or create rsvp: ", error)
	        	res.status(500).send(error)
	        })
		})

	api.router.route('/rsvp/no/:id')
		.post((req,res)=>{
			log.channel("API").verbose("rsvp no: ", req.params.id)
			return app.database().rsvps.findOrCreate({
				where: {
					guest_id: req.params.id 
				},
				defaults: {
	            	guest_id: req.params.id
	        	}
	        })
	        .then(([rsvp,created]) => {
	        	return rsvp.update({ response: "no" })
	        	.then(_=> res.send())
				.catch(error=>{
					log.channel("API").error("could not set rsvp response: ", error)
					res.status(500).send(error)
				})
	        })
	        .catch(error=>{
	        	log.channel("API").error("could not find or create rsvp: ", error)
	        	res.status(500).send(error)
	        })
		})

	return api
}
