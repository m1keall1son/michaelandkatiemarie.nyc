const logger = require('./logger')
const log = logger()
const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize');

const production = process.env.NODE_ENV == "production"

class Database {
	constructor(cb){
		this.databaseName = production ? "db/guests.db" : "db/guests.dev.db"
		this.connected = false;
		this.db = null
		this.connect(cb)
	}
}

Database.prototype.connect = function(cb) { 
	if(!this.db){
		this.db = new Sequelize('sqlite:'+this.databaseName)
		this.db.authenticate()
			.then(() => {
		    	log.notice("loaded guests database: " + this.databaseName)
		    	this.connected = true
		    	this.initModels(cb)
		  	})
			.catch(err => {
		    	log.error('Unable to connect to the database:', err)
			})
	}else{
		log.warning("Database already connected!")
	}
}

Database.prototype.close = function() { 
	if(!this.db){
		log.warning("database is not connected!")
		return;
	}  
	this.db.close()
		.then(() => {
	    	log.notice("database closed.")
	    	this.connected = false
	  	})
		.catch(err => {
	    	log.error('Unable to close database:', err)
		})
}

Database.prototype.initModels = function(cb){
	if(!this.db){
		log.warning("database is not connected!")
		return;
	}  
	// setup User model and its fields.
	this.users = this.db.define('users',
		{
		    email: {
		        type: Sequelize.STRING,
		        unique: true,
		        allowNull: false
		    },
		    password: {
		        type: Sequelize.STRING,
		        allowNull: false
		    }
		}, 
		{
		    hooks: {
		      beforeCreate: (user) => {
		        const salt = bcrypt.genSaltSync()
		        user.password = bcrypt.hashSync(user.password, salt)
		      }
		    }  
		})

	this.users.prototype.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.password)
	}

	this.userToGuestMapping = this.db.define('user_to_guest',
		{
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			guest_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		})

	this.guests = this.db.define('guests',
		{
			firstname: { 
				type: Sequelize.STRING,
				allowNull: false
			},
			lastname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			}
		})

	this.rsvps = this.db.define('rsvps',
		{
			guest_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true
			},
			guest_count: {
				type: Sequelize.INTEGER,
				allowNull: false,
			}
		})

	this.travelPlans = this.db.define('travelPlans',
		{
			guest_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true
			},
			guest_count: {
				type: Sequelize.INTEGER,
				allowNull: false,
			}
		})

	// create all the defined tables in the specified database.
	this.db.sync()
	    .then(() => {
	    	log.notice('tables have been successfully created, if one doesn\'t exist')
	    	this.userList((err,users)=>{ log.verbose(JSON.stringify(users)) })
	    	this.guestList((err,guests)=>{ log.verbose(JSON.stringify(guests)) })
	    	if(cb)cb()
	    })
	    .catch(error => log.error('This error occured', error));

}

Database.prototype.isConnected = function() { return this.connected; }

Database.prototype.guestList = function(cb) {
	let find = this.guests.findAll();
	find.then(guests => {if(cb)cb(null, guests)}).catch(error => {if(cb)cb(error, null)})
};

Database.prototype.userList = function(cb) {
	let find = this.users.findAll();
	find.then(users => {if(cb)cb(null, users)}).catch(error => {if(cb)cb(error, null)})
};

var instance = null

module.exports = (cb) => {
	if(!instance){
		instance = new Database(cb)
	}
 	return instance
}
