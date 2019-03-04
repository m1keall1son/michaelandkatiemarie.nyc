const UTILS = require('utils')
const log = UTILS.logger()
const Sequelize = require('sequelize');

class WeddingApp extends UTILS.App {
	constructor(env){
		super(env)

		if(this.environment == UTILS.Environment.TEST){
			log.setLogLevel(UTILS.logger.LogLevel.REALLY_VERBOSE)
		}else if(this.environment == UTILS.Environment.DEVELOPMENT){
			log.setLogLevel(UTILS.logger.LogLevel.VERBOSE)
		}else{
			log.setLogLevel(UTILS.logger.LogLevel.NOTICE)
		}

		this._server = new UTILS.Server()
	}

	configure(config) {
		super.configure(config)
		if(config)this.port = config.port
	}

	run() {
		super.run()

		if(this.environment == UTILS.Environment.TEST){
			let unit_tests = require("./unit_tests")
			return unit_tests({})
		}

		this.db = require('./db/models')

		this.db.sequelize.sync().then(()=>{
			log.channel('WeddingApp').notice('Database connected!')
			//then connect server
			this._server.addApi(require('./guest_api')())
			this._server.addApi(require('./frontend')())
			this._server.open(this.port)

			return Promise.all([this.guestList(),this.userList()])
		}).then((results)=>{
			log.verbose(JSON.stringify(results))		
		}).catch( err =>{
			log.channel('WeddingApp').errorTrace('Database sync error: ',err)
		})
	}

	shutdown() {
		if(this._server){
			this._server.close().then(()=>{
				if(this.db){
					return this.db.close().then(()=>{
						super.shutdown()
					}).catch(error=>{
						log.channel('WeddingApp').error(error)
						super.shutdown()
					})
				}else{
					super.shutdown()
				}
			}).catch(error=>{
				log.channel('WeddingApp').error(error)
				super.shutdown()
			})
		}
		else{
			super.shutdown()
		}
	}

	guestList() {
		return new Promise((resolve,reject)=>{
			this.db.guests.findAll().then(guests => resolve(guests)).catch(error => reject(error))
		})	
	}

	userList() {
		return new Promise((resolve,reject)=>{
			 this.db.users.findAll().then(users => resolve(users)).catch(error => reject(error))
		})	
	}

	isDBConnected(){ return this.db.isConnected() }
	database(){ return this.db }
	server(){ return this._server.express_server }
}

let instance = null

module.exports = () => {
	if(!instance){
		instance = new WeddingApp()
	}
	return instance
}