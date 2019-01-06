const express = require('express')
const logger = require('./logger')
const log = logger()

class ServerImpl {
	constructor(){
		this.serverRunning = false
		this.apis = []
		this.server = express()
		//logging
		this.server.use((req, res, next) => {
			log.verbose("Request - method: ", req.method, ", url: ", req.url)
    		log.reallyVerbose("\t", req)
    		next()
		})
	}
}

ServerImpl.prototype.open = function(port){
	if(!port){
		log.verbose("server defaulting to port 8080")
	}
	this.port = port || 8080
	log.verbose("starting server on port: ", this.port)
	if(this.apis.length > 0){
		for(var i = 0; i < this.apis.length; i++){
			log.verbose("using middleware: ", this.apis[i].apiName)
			log.verbose("\t root dir: ", this.apis[i].rootDir)
		}
	}
	this.serverRunning = true
	
	//set 404 last
	this.server.use(function (req, res, next) {
		res.status(404).send("Sorry can't find that!")
	});

	this.server.listen(this.port, () => log.notice(`Server is listing on port ${this.port}`))
}

ServerImpl.prototype.close = function(){
	log.verbose("stopping server...")
	this.server.close()
	this.serverRunning = false
}

ServerImpl.prototype.addApi = function(api) {
	log.verbose("adding api: ", api.apiName, " root: ", api.rootDir)
	this.server.use(api.rootDir, api.router)
	this.apis.push(api)
}

ServerImpl.prototype.isRunning = function() {
	return this.serverRunning
}

let instance = null

module.exports = () => {
	if(!instance){
		instance = new ServerImpl()
	}
	return instance
}
