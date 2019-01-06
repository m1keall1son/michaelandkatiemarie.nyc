const path = require("path")
const logger = require('./logger')
const log = logger()
const createAPI = require('./api')
const db = require('./db')()
const express = require('express')

const production = process.env.NODE_ENV == "production"

//fast track logged in users
var sessionCheckerMiddleware = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
}

function createFrontend(router) {

	if(!router){
		log.error("NO ROUTER PROVIDED TO CREATE Guest Frontend.")
		return;
	}

	let api = createAPI(router,'/','Guest Frontend')

	api.router.route('/')
		.get(sessionCheckerMiddleware, (req, res) => {
			log.verbose("here")
			res.sendFile(__dirname + '/public/index.html');
		})

	api.router.route('/login')
		.get(sessionCheckerMiddleware, (req, res) => {
			res.sendFile(__dirname + '/public/login.html');
		})
		.post((req, res) => {
			let email = req.body.email
			let password = req.body.password
			db.users.findOne({where:{ email: email }}).then(user => {
				if (!user) {
                	res.redirect('/login');
	            } else if (!user.validPassword(password)) {
	                res.redirect('/login');
	            } else {
	                req.session.user = user.dataValues;
	                res.redirect('/dashboard');
	            }
			})
		})

	api.router.route('/signup')
		.get(sessionCheckerMiddleware, (req,res) => {
			res.sendFile(__dirname + '/public/signup.html');
		})
		.post((req,res) => {
			db.users.create({
	            email: req.body.email,
	            password: req.body.password
	        })
	        .then(user => {
	            req.session.user = user.dataValues;
	            res.redirect('/dashboard');
	        })
	        .catch(error => {
	            res.redirect('/signup');
	        });
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
		        res.redirect('/');
		    } else {
		        res.redirect('/login');
		    }
		});

	api.router.use(express.static('public'))

	return api
}

module.exports = (server, router) => {

	//use cookies & sessions
	var bodyParser = require('body-parser')
	server.set('view engine', 'pug')
	server.use(bodyParser.urlencoded({ extended: true }))
	server.use(bodyParser.json())
	server.use(require('cookie-parser')())
	server.use(require('express-session')({
		key: 'user_sid',
		secret: 'thisisatopsecretsecret',
		resave: false,
		saveUninitialized: false,
		cookie: { expires: 600000 }
	}))
		
	//check for half eaten cookies...
	server.use(function(req,res,next){
		if(req.cookies.user_sid && !req.session.user){
			res.clearCookie('user_sid')
		}
		next()
	})

 	return createFrontend(router)
}