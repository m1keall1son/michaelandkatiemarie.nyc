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
						no: 0,
						unresponded: 0
					}
				}

				for(let i = 0; i < rsvps.length; ++i){
					if(rsvps[i].rsvp == "yes"){
						data.rsvp_totals.yes++
					} else if(rsvps[i].rsvp == "no") {
						data.rsvp_totals.no++
					} else {
						data.rsvp_totals.unresponded++
					}
				}

				for(let i=0; i < families.length; ++i) {

					let f = {
						name: families[i].name,
						id: families[i].id,
						plusone: families[i].plusone,
						arrival: families[i].arrival,
						departure: families[i].departure,
						accomodations: families[i].accomodations,
						traveling: families[i].traveling,
						notes: families[i].notes,
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
							allergies: guests[j].allergies,
							rehearsal: guests[j].rehearsal,
							family: guests[j].family_id,
							user_id: guests[j].user_id,
							rsvp: null
						}

						for(let k = 0; k < rsvps.length; ++k) {
							if(rsvps[k].id == g.id){
								let r = {
									response: rsvps[k].rsvp
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

	api.router.route('/rsvp')
		.post((req,res) => {

			log.channel("API").verbose("rsvp response for family: ", JSON.stringify(req.body.family))

			return app.database().Families.findOne({
				where: {
					id: req.body.family 
				}
	        })
	        .then(family => {

	            log.channel("API").verbose("retrieved family: ", family.name)

	        	const params = {}

	        	if(family.traveling){
	        		if(req.body.arrival){
	        			params.arrival = req.body.arrival;
	        		}

	        		if(req.body.departure){
	        			params.departure = req.body.departure;
	        		}

	        		if(req.body.accomodations){
	        			params.accomodations = req.body.accomodations;
	        		}
	        	}

	        	if(req.body.notes){
        			params.notes = req.body.notes;
        		}

        		log.channel("API").verbose("family setting family values: ", JSON.stringify(params))

	        	return family.update(params)
	        	.then(_=>{

	        		const updates = []

	        		log.channel("API").verbose("guests: ", JSON.stringify(req.body.guests));

	        		for(let i = 0; i < req.body.guests.length; ++i){

	        			let guest = req.body.guests[i]

	        			log.channel("API").verbose("guest response: ", JSON.stringify(guest));

	        			const update = app.database().guests.findOne({
							where: {
								id: guest.id 
							}
				        }).then(guest_record=>{
				        	log.channel("API").verbose("setting guest info... ", JSON.stringify(guest))
				        	return guest_record.update({ allergies: guest.allergies, rsvp: guest.rsvp })
				        	.then(_=>{  
				        		log.channel("API").verbose("Successfully updated guest info!")
				        	})
				        })
				        updates.push(update);
	        		}

	        		return Promise.all(updates)
	        			.then(_=>{
	        				res.status(200).send("RSVP received.")
	        			})
	        			.catch(error=>{
	        				log.channel("API").verbose("Something went wrong while updating a guest's rsvp record!")
				        	res.status(500).send(error)
	        			})
	        	})
	        	.catch(error=>{
	        		log.channel("API").error("could not find family: ", req.body.family, error)
	        		res.status(500).send(error)
	        	})
	        })
	        .catch(error=>{
	        	log.channel("API").error("could not find family: ", req.body.family, error)
	        	res.status(500).send(error)
	        })

		});

	return api
}
