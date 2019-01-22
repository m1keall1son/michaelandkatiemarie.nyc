const express = require('express')
const logger = require('./logger')
const log = logger()

class Server {
	constructor(){
		this.serverRunning = false
		this.apis = []
		this.express_server = express()
		//logging
		this.express_server.use((req, res, next) => {
			log.channel('Server').verbose("Request - method: ", req.method, ", url: ", req.url)
    		log.channel('Server').reallyVerbose("\t", req)
    		next()
		})
	}

	open(port){
		if(!port){
			log.channel('Server').verbose("server defaulting to port 8080")
		}
		this.port = port || 8080
		log.channel('Server').verbose("starting server on port: ", this.port)
		if(this.apis.length > 0){
			for(var i = 0; i < this.apis.length; i++){
				log.channel('Server').verbose("using middleware: ", this.apis[i].apiName)
				log.channel('Server').verbose("\t root dir: ", this.apis[i].rootDir)
			}
		}

		//set 404 last
		this.express_server.use(function (req, res, next) {
			res.status(404).send("Sorry can't find that!")
		});

		this.connection = this.express_server.listen(this.port, () => { 
			this.serverRunning = true
			log.channel('Server').notice(`Server is listing on port ${this.port}`)
		})
	}

	close(){
		log.channel('Server').verbose("stopping server...")
		return new Promise((resolve,reject)=>{
			if(this.connection){
				this.connection.close(error =>{
					log.channel('Server').verbose("server stopped.")
					this.serverRunning = false
					if(error) reject(Error(error))
					else resolve()
				})
			}else{
				log.channel('Server').warning("attempting to stop a server that was never running.")
				resolve()
			}	
		})
	}

	addApi(api) {
		log.channel('Server').verbose("adding api: ", api.apiName, " root: ", api.rootDir)
		this.express_server.use(api.rootDir, api.router)
		this.apis.push(api)
	}

	isRunning() { return this.serverRunning }
}

module.exports = Server
