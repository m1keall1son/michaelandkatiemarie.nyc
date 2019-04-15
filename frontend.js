const UTILS = require('utils')
const log = UTILS.logger()
const express = require('express')
const get_app = require('./wedding_app')
const querystring = require('querystring')
const Sequelize = require('sequelize');
const app = get_app()

const amazon = require('node-ses')

const emailClient = amazon.createClient({ key: process.env.EMAIL_KEY, secret: process.env.EMAIL_SECRET });

function loginexc(message, invalidUser, invalidPass){
	this.invalidUser = invalidUser
	this.invalidPass = invalidPass
	this.message = message
}

var sessionCheckerMiddleware = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/wedding');
    } else {
        next();
    }    
}

var session = require('express-session')
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var Page = {
	HOME:"Michael & KatieMarie",
	IDOCREW:"Meet the I-Do-Crew",
	RSVP:"RSVP",
	ADMIN:"Admin",
	LOGIN:"Login",
	ERROR:"Error"
}

var User = {
	REQUEST_ACCESS:"requestaccess",
	CREATE_PASS:"createpass",
	LOGIN:"login",
	AUTHENTICATED:"authenticated"
}

function renderPage(req, res, page, id) {

	let data = {
		constants: {
			Page: Page,
			User: User
		},
		main: { 
			page: page
		}
	}

    log.channel("Frontend").verbose("Looking up user id ", id, "...")
	return app.database().guests.findOne({
        where: { user_id: id }
    })
    .then(guest => {
    	log.channel("Frontend").verbose("user is ", guest.firstname, guest.lastname)
    	data.user = {
			state: User.AUTHENTICATED,
			firstname: guest.firstname,
			lastname: guest.lastname,
			email: guest.email,
			rehearsal: guest.rehearsal,
			admin: guest.admin,
			plusone: guest.plusone,
			family: []
		}

    	if(guest.family != "")
    	{
    		log.channel("Frontend").verbose("has family associations, looking them up...")
    		let members = JSON.parse("[" + guest.family + "]");
    		return app.database().guests.findAll({
    			where: { user_id: members }
    		})
    		.then(family_members => {
		    	for(member in family_members) {
		    		let fam = {
		    			firstname: member.firstname,
						lastname: member.lastname,
						email: member.email,
						rehearsal: member.rehearsal
		    		}
		    		data.user.family.push(fam)
		    	}
		    	log.channel("Frontend").verbose("found all family associations, rendering main")
		    	res.render('main', data)
		    })
		    .catch(error => {
		    	log.channel("Frontend").error("couldn't find the right family member info: ", error)
		    	data = {
					main: { 
						page: Page.ERROR
					}
				}
				res.render('main', data)
		    })
    	}
    	else
    	{
    		log.channel("Frontend").verbose("no family associations, rendering main")
    		res.render('main', data)
    	}
    })
    .catch(error => {
    	log.channel("Frontend").error("couldn't find the right guest info: ", error);
    	res.clearCookie('user_sid');
		req.session.destroy()
    	data = {
    		constants: {
				Page: Page,
				User: User
			},
			main: { 
				page: Page.ERROR
			}
		}
		res.render('main', data)
    })
}

module.exports = () => {

	let db_name = "";
	if(app.environment == UTILS.Environment.TEST){
		db_name = "./db/sessions.test.db";
	}else if(app.environment == UTILS.Environment.DEVELOPMENT){
		log.setLogLevel(UTILS.logger.LogLevel.VERBOSE)
		db_name = "./db/sessions.dev.db";
	}else{
		log.setLogLevel(UTILS.logger.LogLevel.NOTICE)
		db_name = "./db/sessions.db";
	}

	var sequelize = new Sequelize({
		    "dialect": "sqlite",
		    "storage": db_name,
		    "logging": false
		})

	let expiration = 365 * 24 * 60 * 60 * 1000

	let sessionstore = new SequelizeStore({
		    db: sequelize,
		    disableTouch: true,
		    checkExpirationInterval: 60 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
	  		expiration: expiration // The maximum age (in milliseconds) of a valid session.
		})

	//use cookies & sessions
	var bodyParser = require('body-parser')
	app.server().set('view engine', 'pug')
	app.server().use(bodyParser.urlencoded({ extended: true }))
	app.server().use(bodyParser.json())
	app.server().use(require('cookie-parser')())
	app.server().use(session({
		key: 'user_sid',
		secret: 'thisisatopsecretsecret',
		resave: false,
		saveUninitialized: false,
		cookie: { expires: expiration }, //cookie good for 1 year, lol
		store: sessionstore,
		proxy: app.environment == UTILS.Environment.PRODUCTION
	}))

	//how to handle custom 404?
	// // //set 404 last
	// app.server().use(function (req, res, next) {
	// 	let data = {
	// 		main: { 
	// 			page:"404", 
	// 			state:State.ERROR
	// 		}
	// 	}
	// 	res.status(404).render('main', data)
	// });

	sessionstore.sync()
		
	//check for half eaten cookies...
	app.server().use(function(req,res,next){
		if(req.cookies.user_sid && !req.session.user){
			res.clearCookie('user_sid')
		}
		next()
	})

 	let api = new UTILS.API('/','Guest Frontend')

	api.router.route('/')
		.get((req, res) => {
			res.redirect('/savethedate');
		})

	// api.router.route('/test')
	// 	.get((req, res) => {
	// 		res.sendFile(__dirname + '/public/header.html');
	// 	})

	api.router.route('/savethedate')
		.get((req, res) => {
			res.render('savethedate/main')
		})

	api.router.route('/engagement')
		.get((req, res) => {
			res.sendFile(__dirname + '/public/engagement/engagement.html');
		})

	api.router.route('/register')
	.get(sessionCheckerMiddleware, (req,res)=>{
		res.render('login/register')
	})
	.post((req,res) => {
		return app.database().guests.findOne({
            where: { email: req.body.email.toLowerCase().trim() }
        })
        .then(guest => {
        	const query = querystring.stringify({
		          "email": guest.email,
		          "name": guest.firstname
		      })
            res.redirect('/createpass?' + query);
        })
        .catch(error => {
        	log.channel("Frontend").error(error)
        	const query = querystring.stringify({
		          "email": req.body.email,
		      })
            res.redirect('/request?' + query);
        })
	})

	api.router.route('/createpass')
		.get(sessionCheckerMiddleware, (req, res) => {
			res.render('login/create_pass', {user:{email: req.query.email, firstname: req.query.name}})
		})
		.post((req, res) => {
			let password = req.body.password
			let email = req.body.email.toLowerCase().trim()
			log.channel("Frontend").verbose("creating pass for: ", email, "...");
			return app.database().users.findOrCreate({
				where: {
					email: email
				},
				defaults: {
	            	password: password
	        	}
	        })
	        .then(([user, created]) => {

	            req.session.user = user.dataValues;

	        	if(created){
	        		log.channel("Frontend").verbose( "user created successfully: ", JSON.stringify(user))
	        		return app.database().guests.update(
		            	{ user_id: user.id },
		            	{ where: { email: req.body.email }})
	        	}
	        	else {
	        		log.channel("Frontend").verbose("user retrieved, successfully, re-setting password")
	        		user.update({password: password})
	        		.then(()=>{
	        			return app.database().guests.update(
		            	{ user_id: user.id },
		            	{ where: { email: req.body.email }})
	        		})
	        		.catch(error=>{
	        			log.channel("Frontend").error("failed to update password for user");
	        		})
	        	}
	        })
	        .then(()=>{
	        	log.channel("Frontend").verbose("user associated to guest successfully, logging in.");
	        	return app.database().users.findOne({
					where:{ email: email }
				})
				.then(user=>{ 
					if(!user) {
						throw new loginexc("user does not exist", true, true)
					}
					else if(!user.validPassword(password)) {
						throw new loginexc("invlid password", false, true)
					}
					else {
						req.session.user = user.dataValues;
						log.channel("Frontend").verbose("login success!");
		            	res.redirect('/wedding')
					}
				})
	            .catch(error=>{
	            	log.channel("Frontend").warning("login fail: ", error.message)
	            	let data = {
	            		constants: {
							Page: Page,
		        			User: User
	            		},
						main: { 
							page: Page.LOGIN
						},
						user: {
							state: User.LOGIN,
							email: email,
							error: error
						}
					}
					res.render('main', data);
	            })
            })
            .catch(error =>{
            	log.channel("Frontend").error(error)
            	res.redirect('/register')
            })
		})

	api.router.route('/request')
		.get(sessionCheckerMiddleware, (req, res)=>{
			log.channel("frontend").verbose("user doesn't exist for: ", req.query.email, " sending to request...")
			res.render('login/request_to_register', {page:{sent:false},user:{email: req.query.email}})
		})
		.post((req, res)=>{
			emailClient.sendEmail({
			   to: 'philosopher.osopher@gmail.com',
			   from: 'hello@michaelandkatiemarie.nyc',
			   subject: '[WEDDING SITE] Request for access',
			   message: "register this email: " + req.body.email + ", for " + req.body.name,
			   altText: 'plain text'
			}, (err, data, result) => {
			 
				if (err) {
				    log.channel("Frontend").errorTrace("sending mail error: ", JSON.stringify(err));
					res.render('login/request_to_register', {page:{sent:false},user:{email: req.body.email}})
				} else {
				    log.channel("Frontend").verbose('Email sent: ' + JSON.stringify(result));
				    res.render('login/request_to_register', {page:{sent: true}})
				}

			});
		})

	api.router.route('/login')
		.get(sessionCheckerMiddleware, (req, res) => {
			let data = {
				constants: {
					Page: Page,
        			User: User
        		},
				main: { 
					page: Page.LOGIN
				},
				user: {
					state: User.LOGIN
				}
			}
			res.render('main', data);
		})
		.post((req, res) => {
			let email = req.body.email.toLowerCase()
			let password = req.body.password
			log.channel("frontend").verbose("logging in email: ", email, " ...");
			return app.database().users.findOne({
				where:{ email: email }
			})
			.then(user=>{ 
				if(!user) {
					throw new loginexc("user does not exist", true, true)
				}
				else if(!user.validPassword(password)) {
					throw new loginexc("invlid password", false, true)
				}
				else {
					req.session.user = user.dataValues;
					log.channel("Frontend").verbose("login success!");
	            	res.redirect('/wedding')
				}
			})
            .catch(error=>{
            	log.channel("frontend").warning("login fail: ", error.message)
            	let data = {
            		constants: {
						Page: Page,
	        			User: User
            		},
					main: { 
						page: Page.LOGIN
					},
					user: {
						state: User.LOGIN,
						email: email,
						error: error
					}
				}
				res.render('main', data);
            })
		})
	    
	api.router.route('/wedding')
		.get((req, res) => {
		    if (req.session.user && req.cookies.user_sid) {
		    	//authenticated, get their info
		    	return renderPage(req, res, Page.HOME, req.session.user.id)
		    } else {
		    	//not authenticated, redirect
		        res.redirect('/login')
		    }
		});

	api.router.route('/idocrew')
		.get((req, res) => {
			if (req.session.user && req.cookies.user_sid) {
		    	//authenticated, get their info
		    	return renderPage(req, res, Page.IDOCREW, req.session.user.id)
		    } else {
		    	//not authenticated, redirect
		        res.redirect('/login')
		    }
		})

	api.router.route('/admin')
		.get((req, res) => {
			if (req.session.user && req.cookies.user_sid) {
		    	//authenticated, get their info
		    	return renderPage(req, res, Page.ADMIN, req.session.user.id)
		    } else {
		    	//not authenticated, redirect
		        res.redirect('/login')
		    }
		})

	// route for user logout
	api.router.route('/logout')
		.get((req, res) => {
		    if (req.session.user && req.cookies.user_sid) {
		        res.clearCookie('user_sid');
		        req.session.destroy()
		        res.redirect('/');
		    } else {
		        res.redirect('/login');
		    }
		});

	api.router.use(express.static('public'))

	return api
}