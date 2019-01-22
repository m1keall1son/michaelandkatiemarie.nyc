const logger = require('./logger')
const log = logger()
const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize');

class Database {

	constructor(database, init){
		this.databaseName = database
		this.connected = false;
		this.sqlite = null
		this.initModels = init
		this.models = {}
	}

	connect() { 
		return new Promise((resolve,reject)=>{
			if(!this.sqlite){
				this.sqlite = new Sequelize('sqlite:'+this.databaseName, { logging: log.channel("Sequelize").verbose })
				this.sqlite.authenticate()
					.then(() => {
				    	log.channel('Database').reallyVerbose("loaded database: " + this.databaseName)
				    	this.connected = true
				    	this.models = this.initModels(this.sqlite)
						// create all the defined tables in the specified database.
						this.sqlite.sync()
						    .then(() => {
						    	log.channel('Database').reallyVerbose('tables have been successfully created, if one doesn\'t exist')
						    	resolve()
						    })
						    .catch(error => reject(Error(error)))
				  	})
					.catch(err => {
				    	log.channel('Database').error('Unable to connect to the database:', err)
				    	reject(Error(err))
					})
			}else{
				log.channel('Database').warning("Database already connected!")
				resolve()
			}
		})
	}

	close() { 
		return new Promise((resovle,reject)=>{
			if(!this.sqlite){
				log.channel('Database').warning("database is not connected!")
				resovle()
			}  
			this.sqlite.close()
				.then(() => {
			    	log.channel('Database').notice("database closed.")
			    	this.connected = false
			    	resolve()
			  	})
				.catch(err => {
			    	log.channel('Database').error('Unable to close database:', err)
			    	reject(Error(err))
				})
		})
	}

	isConnected() { return this.connected; }
}

module.exports = Database
