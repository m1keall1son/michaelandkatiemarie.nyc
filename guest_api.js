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
			log.channel("API").verbose("getting admin list...")
			let familyPromise = app.familyList()
			let guestPromise = app.guestList()
			let rsvpPromise = app.rsvpList()
			return Promise.all([guestPromise,familyPromise, rsvpPromise])
			.then(([guests, families, rsvps]) => {

				log.channel("API").verbose("got guests, families and rsvps, buidling render...")

				let data = {
					families: [],
					rsvp_totals: {
						yes: 0, 
						no: 0,
						unresponded: 0,
						cancelled: 0
					}
				}

				for(let i = 0; i < rsvps.length; ++i){
					if(rsvps[i].rsvp == "yes"){
						data.rsvp_totals.yes++
					} else if(rsvps[i].rsvp == "no") {
						data.rsvp_totals.no++
					} else if(rsvps[i].rsvp == "cancelled") {
						data.rsvp_totals.cancelled++
					} else {
						data.rsvp_totals.unresponded++
					}
				}

				log.channel("API").verbose("calculated rsvps. building each family")

				for(let i=0; i < families.length; ++i) {

					log.channel("API").verbose("building family: ", i, JSON.stringify(families[i]))

					let f = {
						name: families[i].name,
						id: families[i].id,
						plusone: families[i].plusone,
						arrival: families[i].arrival,
						accomodations: families[i].accomodations,
						traveling: families[i].traveling,
						address: families[i].address,
						address2: families[i].address2,
						zip: families[i].zip,
						plusone_id: families[i].plusone_id,
						guests: [],
						plusone_guest: null
					}

					for(let j = 0; j < guests.length; ++j){

						if(guests[j].family_id != f.id)
							continue

						log.channel("API").verbose("adding memeber: ", j)

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
							rsvp: { response: guests[j].rsvp },
							is_plusone: guests[j].is_plusone
						}

						if(g.is_plusone){
							log.channel("API").verbose("memeber: ", j, " is a plus one")
							f.plusone_guest = g
						}else{
							f.guests.push(g)
						}
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


	api.router.route('/new/family')
		.post((req,res)=>{
			return app.newFamily(req.body.name, false)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('new/family/:id/guest')
		.post((req,res)=>{
			return app.newGuest(req.body.firstname, req.body.lastname, req.body.email, req.body.family_id, req.body.rehearsal)
			.then(_=> res.send())
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/update/guest/:id')
		.post((req,res) => {
			log.channel("API").verbose("updating guest: ", req.params.id, " with: ", JSON.stringify(req.body))
			if(req.body.rehearsal != undefined){
				return app.database().guests.findOne({where:{id: req.params.id}})
				.then(guest=>{
					return guest.update({rehearsal: req.body.rehearsal}).then(_=> res.send()).catch(error=>res.status(500).send(error))
				}).catch(error=>{
					log.channel("API").verbose("failed to find guest: ",req.params.id)
					res.status(500).send(error)
				})
			}
			//default
			res.send()
		})

	api.router.route('/new/family/:id/plusone')
		.post((req,res)=>{
			log.channel("API").verbose("creating new plusone record for family:", req.params.id)
			return app.database().guests.create({
				firstname: req.body.firstname || "",
				lastname: req.body.lastname || "",
				rsvp: req.body.rsvp,
				rehearsal: req.body.rehearsal,
				family_id: req.params.id
	        }).then(guest => {
	        		log.channel("API").verbose("created new plusone guest:", guest.id)
	        		return app.database().Families.findOne({ where: { id: req.params.id } })
		        	.then(fam=>{
		        		return fam.update({ plusone_id: guest.id })
		        		.then(_=>{
		        			log.channel("API").verbose("updated family with new plusone id")
			        		const params = {
								user : {
									family: {
										id: req.params.id,
										plusone: true
									},
									guest: {
										id: guest.id,
										firstname: "",
										lastname: "",
										rsvp: "",
										allergies: ""
									},
									rehearsal: req.body.rehearsal
								}
							}
							res.status(200).render("home/sections/plusone.pug", params)
		        		}).catch(error=>res.status(500).send(error))
		        	}).catch(error=>res.status(500).send(error))
	        }).catch(error=>res.status(500).send(error))
		})

	api.router.route('update/family/plusone/:id')
		.post((req,res)=>{
			log.channel("API").verbose("updating family: ", req.params.id, " plusone, with: ", JSON.stringify(req.body))
			return app.database().guests.findOne({ where : { id: req.body.plusone_id, family_id: req.params.id } })
			.then(guest => {
				return guest.update({ 
					firstname: req.body.firstname,
					lastname: req.body.lastname, 
					rehearsal: req.body.rehearsal,
					rsvp: req.body.rsvp
				}).then(guest=> {

					const params = {
						user : {
							family: {
								id: req.params.id,
								plusone: true
							},
							guest: {
								id: guest.id,
								firstname: guest.firstname,
								lastname: guest.lastname,
								rsvp: guest.rsvp,
								allergies: guest.allergies
							},
							rehearsal: req.body.rehearsal
						}
					}
					res.render("home/sections/plusone.pug", params)

				}).catch(error=>res.status(500).send(error))
			})
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/update/family/travel/:id')
		.post((req,res) => {
			log.channel("API").verbose("updating family: ", req.params.id, " with: ", JSON.stringify(req.body))
			return app.database().Families.findOne({ where : { id: req.params.id } })
			.then(family => {
				return family.update({ 
					arrival: req.body.arrival,
					accomodations: req.body.accomodations, 
					address: req.body.address,
					address2: req.body.address2,
					zip: req.body.zip,
				}).then(_=> res.send()).catch(error=>res.status(500).send(error))
			})
			.catch(error=>res.status(500).send(error))
		})

	api.router.route('/update/family/:id')
		.post((req,res) => {
			log.channel("API").verbose("updating family: ", req.params.id, " with: ", JSON.stringify(req.body))
			return app.database().Families.findOne({ where : { id: req.params.id } })
			.then(family => {
				return family.update({ plusone: req.body.plusone, traveling: req.body.traveling }).then(family => {
					const params = {
						family : family
					}
					res.render("admin/travel.pug", params)
				}).catch(error=>res.status(500).send(error))
			})
			.catch(error=>res.status(500).send(error))
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

	        		if(req.body.accomodations){
	        			params.accomodations = req.body.accomodations.name;
	        			params.address = req.body.accomodations.address;
	        			params.address2 = req.body.accomodations.address2;
	        			params.zip = req.body.accomodations.zip;
	        		}
	        	}

	        	if(family.plusone){
	        		log.channel("API").verbose("family setting plus one guest: ", JSON.stringify(req.body.guest))
	        		return findPlusone = app.database().guests.findOrCreate({
						where: {
							family_id: family.id,
							is_plusone: true
						},
						defaults: {
			            	is_plusone: true
			        	}
			        }).then(([plusone, created])=>{
			        	return plusone.update({ 
			        		firstname: req.body.guest.firstname,
			        		lastname: req.body.guest.lastname,
			        		allergies: req.body.guest.allergies,
			        		rsvp: req.body.guest.rsvp
				        }).then(plus=>{

				        	log.channel("API").verbose("family setting family values: ", JSON.stringify(params))

				        	params.plusone_id = plus.id

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

				        }).catch(error=>res.status(500).send(error))

			        }).catch(error=>res.status(500).send(error))

	        	} else {

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

	        	}
	        })
	        .catch(error=>{
	        	log.channel("API").error("could not find family: ", req.body.family, error)
	        	res.status(500).send(error)
	        })

		});

		api.router.route('/rsvp/:id')
		.post((req,res)=>{
			log.channel("API").verbose("rsvp: ", req.params.id, " response: ", req.body.rsvp)
			return app.database().guests.findOne({
				where: {
					id: req.params.id 
				}
	        })
	        .then(guest => {
	        	return guest.update({ rsvp: req.body.rsvp })
	        	.then(_=> { 

	        		const data = {
	        			record: {
	        				id: guest.id,
	        				rsvp: { response: guest.rsvp }
	        			}
	        		}

	        		log.channel("API").verbose("rendering rsvp with data: ", JSON.stringify(data))

	        		res.render('admin/rsvp_layout.pug', data)

	        	})
				.catch(error=>{
					log.channel("API").error("could not set rsvp: ", error)
					res.status(500).send(error)
				})
	        })
	        .catch(error=>{
	        	log.channel("API").error("could not find guest: ", req.params.id , error)
	        	res.status(500).send(error)
	        })
		})

	return api
}
