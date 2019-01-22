const UTILS = require('utils')
const log = UTILS.logger()
const express = require('express')
const get_app = require('./wedding_app')
const querystring = require('querystring')
const Sequelize = require('sequelize');
const app = get_app()

//fast track logged in users
var sessionCheckerMiddleware = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
}

var session = require('express-session')
var SequelizeStore = require('connect-session-sequelize')(session.Store);

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
		    "storage": db_name
		})

	let expiration = 365 * 24 * 60 * 60 * 1000

	let sessionstore = new SequelizeStore({
		    db: sequelize,
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
		.get(sessionCheckerMiddleware, (req, res) => {
			//res.sendFile(__dirname + '/public/index.html');
			res.redirect('/login')
		})

	api.router.route('/register')
		.get(sessionCheckerMiddleware, (req,res) => {
			res.render('register');
		})
		.post((req,res) => {
			app.database().guests.findOne({
	            where: { email: req.body.email }
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
			res.render('create_pass', {email: req.query.email, name: req.query.name})
		})
		.post((req, res) => {
			app.database().users.create({
	            email: req.body.email,
	            password: req.body.password
	        })
	        .then(user => {
	            req.session.user = user.dataValues;
	            return app.database().guests.update(
	            	{ user_id: user.id },
	            	{ where: { email: req.body.email }})
	            .then(()=>{
	            	res.redirect('/login');
	            })
	        })
	        .catch(error => {
	            res.redirect('/register');
	        });
		})

	api.router.route('/request')
		.get((req, res)=>{
			log.channel("frontend").verbose("user doesn't exist for: ", req.query.email, " sending to request...")
			res.render('request_to_register', {email: req.query.email})
		})
		.post((req, res)=>{
			//send email to me
			log.channel("frontend").verbose("would send email to register this email: " + req.body.email + ", for " + req.body.name)
			res.render('request_to_register', {sent: true})
		})

	api.router.route('/login')
		.get(sessionCheckerMiddleware, (req, res) => {
			res.sendFile(__dirname + '/public/login.html');
		})
		.post((req, res) => {
			let email = req.body.email
			let password = req.body.password
			app.database().users.findOne({where:{ email: email }}).then(user => {
				if (!user) {
					log.channel("frontend").verbose("user doesn't exist")
                	res.redirect('/login');
	            } else if (!user.validPassword(password)) {
	            	log.channel("frontend").verbose("invalid password")
	                res.redirect('/login');
	            } else {
	                req.session.user = user.dataValues;
	                res.redirect('/dashboard');
	            }
			})
		})
	    
	api.router.route('/dashboard')
		.get((req, res) => {
		    if (req.session.user && req.cookies.user_sid) {
		        res.sendFile(__dirname + '/public/dashboard.html');
		    } else {
		        res.redirect('/login');
		    }
		});

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