const server = require('./server')
const db = require('./db')
const guests = require('./guest_api')
const frontend = require('./frontend')
const logger = require('./logger')
const log = logger()
const fs = require('fs')
const spawn = require('child_process').spawn

let instance = null

const production = process.env.NODE_ENV == "production"

class AppImpl {
	constructor(){
		this.server = server()
		this.db = db()
	}
}

AppImpl.prototype.configure = function(config) {
	if(config){
	}else{
		log.error("config is empty!")
	}
}

AppImpl.prototype.run = function(port) {
	log.notice("------ BEGIN APP("+(production?"production":"dev")+") ------")
	this.server.addApi(frontend())
	this.server.addApi(guests())
	this.server.open(port)
}

AppImpl.prototype.shutdown = function(port) {
	this.db.close()
	log.notice("------ END APP("+(production?"production":"dev")+") ------")
}

AppImpl.prototype.exitHandler = function(options, exitCode) {
	if(options.cleanup) { 
		this.shutdown()
	}

    if (exitCode || exitCode === 0){
    	log.verbose("exit code: ", exitCode)
    }

    if (options.exit) {
    	if(options.error){
	    	console.trace()
	    	process.exit(1)
	    }else{
	    	process.exit()
	    }
    }
}

module.exports = () => {
	if(!instance){
		instance = new AppImpl()
		process.on('exit', instance.exitHandler.bind(instance,{cleanup:true})) //on clean up
		process.on('SIGINT', instance.exitHandler.bind(instance, {exit:true})) //ctrl-c
		process.on('SIGUSR1', instance.exitHandler.bind(instance, {exit:true})) //pkill
		process.on('SIGUSR2', instance.exitHandler.bind(instance, {exit:true})) //pkill
		//process.on('uncaughtException', instance.exitHandler.bind(instance, {exit:true, error:true})) //on fatal error
	}
	return instance
}