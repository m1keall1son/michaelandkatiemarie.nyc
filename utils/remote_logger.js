const logger = require('./logger')
const log = logger()
const createAPI = require('./api')

module.exports = () => { 
	
	let api = createAPI(router,'/log','Remote Logger API')

	api.router.route('/level/:level')
		.get((req, res) => {
			log.notice("setting log level: ", req.params.level)
			if(req.params.level == "verbose" || req.params.level == "v"){
				log.setLogLevel(logger.LogLevel.VERBOSE)
				res.json({message: "Successfully set log level to VERBOSE"})
			}else if(req.params.level == "notice" || req.params.level == "n"){
				log.setLogLevel(logger.LogLevel.NOTICE)
				res.json({message: "Successfully set log level to NOTICE"})
			}else if(req.params.level == "reallyverbose" || req.params.level == "v2"){
				log.setLogLevel(logger.LogLevel.REALLY_VERBOSE)
				res.json({message: "Successfully set log level to REALLY_VERBOSE"})
			}else if(req.params.level == "warning" || req.params.level == "w"){
				log.setLogLevel(logger.LogLevel.WARNING)
				res.json({message: "Successfully set log level to WARNING"})
			}else if(req.params.level == "error" || req.params.level == "e"){
				log.setLogLevel(logger.LogLevel.ERROR)
				res.json({message: "Successfully set log level to ERROR"})
			}else if(req.params.level == "silent" || req.params.level == "s"){
				log.setLogLevel(logger.LogLevel.SILENT)
				res.json({message: "Successfully set log level to SILENT"})
			}else{
				res.status(500).json({error: "Did not set the right level, must be one of ['verbose','v','reallyverbose','v2','notice','n','warning','w','error','e','silent','s']"})
			}
	    })
	    
	api.router.route('/channelLevel/:channel/:level')
		.get((req, res) => {
			log.notice(`setting log level: ${req.params.level} for channel ${req.params.channel}`)

			let logChannel = log

			if(req.params.channel != "default"){
				logChannel = log.channel(req.params.channel)
			}

			if(req.params.level == "verbose" || req.params.level == "v"){
				logChannel.setLogLevel(logger.LogLevel.VERBOSE)
				res.json({message: `Successfully set log level for channel ${req.params.channel} to VERBOSE`})
			}else if(req.params.level == "notice" || req.params.level == "n"){
				logChannel.setLogLevel(logger.LogLevel.NOTICE)
				res.json({message: `Successfully set log level for channel ${req.params.channel} to NOTICE`})
			}else if(req.params.level == "reallyverbose" || req.params.level == "v2"){
				logChannel.setLogLevel(logger.LogLevel.REALLY_VERBOSE)
				res.json({message: `Successfully set log level for channel ${req.params.channel} to REALLY_VERBOSE`})
			}else if(req.params.level == "warning" || req.params.level == "w"){
				logChannel.setLogLevel(logger.LogLevel.WARNING)
				res.json({message: `Successfully set log level for channel ${req.params.channel} to WARNING`})
			}else if(req.params.level == "error" || req.params.level == "e"){
				logChannel.setLogLevel(logger.LogLevel.ERROR)
				res.json({message: `Successfully set log level for channel ${req.params.channel} to ERROR`})
			}else if(req.params.level == "silent" || req.params.level == "s"){
				logChannel.setLogLevel(logger.LogLevel.SILENT)
				res.json({message: `Successfully set log level for channel ${req.params.channel} to SILENT`})
			}else{
				res.status(500).json({error: "Did not set the right level, must be one of ['verbose','v','reallyverbose','v2','notice','n','warning','w','error','e','silent','s']"})
			}
	    })

	api.router.route('/levelAll/:level')
		.get((req, res) => {
			log.notice(`setting log level: ${req.params.level} for channel ${req.params.channel}`)

			if(req.params.level == "verbose" || req.params.level == "v"){
				log.setLogLevelOnAllChannels(logger.LogLevel.VERBOSE)
				res.json({message: `Successfully set log level on all channels to VERBOSE`})
			}else if(req.params.level == "notice" || req.params.level == "n"){
				log.setLogLevelOnAllChannels(logger.LogLevel.NOTICE)
				res.json({message: `Successfully set log level on all channels to NOTICE`})
			}else if(req.params.level == "reallyverbose" || req.params.level == "v2"){
				log.setLogLevelOnAllChannels(logger.LogLevel.REALLY_VERBOSE)
				res.json({message: `Successfully set log level on all channels to REALLY_VERBOSE`})
			}else if(req.params.level == "warning" || req.params.level == "w"){
				log.setLogLevelOnAllChannels(logger.LogLevel.WARNING)
				res.json({message: `Successfully set log level on all channels to WARNING`})
			}else if(req.params.level == "error" || req.params.level == "e"){
				log.setLogLevelOnAllChannels(logger.LogLevel.ERROR)
				res.json({message: `Successfully set log level on all channels to ERROR`})
			}else if(req.params.level == "silent" || req.params.level == "s"){
				log.setLogLevelOnAllChannels(logger.LogLevel.SILENT)
				res.json({message: `Successfully set log level on all channels to SILENT`})
			}else{
				res.status(500).json({error: "Did not set the right level, must be one of ['verbose','v','reallyverbose','v2','notice','n','warning','w','error','e','silent','s']"})
			}
	    })

	    api.router.route('/put/:level/:message')
		.get((req, res) => {
			if(req.params.level == "verbose" || req.params.level == "v"){
				log.verbose(req.params.message)
				res.status(200)
			}else if(req.params.level == "notice" || req.params.level == "n"){
				log.notice(req.params.message)
				res.status(200)
			}else if(req.params.level == "reallyverbose" || req.params.level == "v2"){
				log.reallyVerbose(req.params.message)
				res.status(200)
			}else if(req.params.level == "warning" || req.params.level == "w"){
				log.warning(req.params.message)
				res.status(200)
			}else if(req.params.level == "error" || req.params.level == "e"){
				log.error(req.params.message)
				res.status(200)
			}else{
				res.status(500).json({error: "Did not set the right level, must be one of ['verbose','v','reallyverbose','v2','notice','n','warning','w','error','e']"})
			}
	    })

	    api.router.route('/put/:channel/:level/:message')
		.get((req, res) => {
			if(req.params.level == "verbose" || req.params.level == "v"){
				log.channel().verbose(req.params.message)
				res.status(200)
			}else if(req.params.level == "notice" || req.params.level == "n"){
				log.notice(req.params.message)
				res.status(200)
			}else if(req.params.level == "reallyverbose" || req.params.level == "v2"){
				log.reallyVerbose(req.params.message)
				res.status(200)
			}else if(req.params.level == "warning" || req.params.level == "w"){
				log.warning(req.params.message)
				res.status(200)
			}else if(req.params.level == "error" || req.params.level == "e"){
				log.error(req.params.message)
				res.status(200)
			}else{
				res.status(500).json({error: "Did not set the right level, must be one of ['verbose','v','reallyverbose','v2','notice','n','warning','w','error','e']"})
			}
	    })

	return api
}