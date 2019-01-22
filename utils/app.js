const logger = require('./logger')
const log = logger()

const Environment = {
	TEST: "test",
	DEVELOPMENT: "development",
	PRODUCTION: "production"
}

class App {
	constructor(env){
		if(!env) env = process.env.NODE_ENV
		this.environment = env;
		process.on('exit', this.exitHandler.bind(this,{cleanup:true})) //on clean up
		process.on('SIGINT', this.exitHandler.bind(this, {exit:true})) //ctrl-c
		process.on('SIGUSR1', this.exitHandler.bind(this, {exit:true})) //pkill
		process.on('SIGUSR2', this.exitHandler.bind(this, {exit:true})) //pkill
		if(this.environment == Environment.PRODUCTION)
			process.on('uncaughtException', this.exitHandler.bind(this, {exit:true, error:true})) //on fatal error
	}

	configure(config) {
		if(!config)log.channel('App').error("config is empty!")
	}

	run() {
		log.channel('App').notice("------ BEGIN APP("+this.environment+") ------")
	}

	shutdown() {
		log.channel('App').notice("------ END APP("+this.environment+") ------")
	}

	exitHandler(options, exitCode) {
		if(options.cleanup) { 
			this.shutdown()
		}

	    if (exitCode || exitCode === 0){
	    	log.channel('App').verbose("exit code: ", exitCode)
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
}

module.exports = App
module.exports.Environment = Environment