const UTILS = require('utils')
const log = UTILS.logger()
const get_app = require('./wedding_app')
const app = get_app()
const fileUpload = require('express-fileupload')
const fs = require('fs')
const fsp = fs.promises;
const browser = require('browser-detect')

module.exports = () => {

	app.server().use(fileUpload());

	let api = new UTILS.API('/photobooth','Photobooth API')

	api.router.route('/upload')
		.post((req, res) => {
			if (Object.keys(req.files).length == 0) {
				return res.status(400).send('No files were uploaded.');
			}

		  	let videoFile = req.files.video;
		  	let posterFile = req.files.poster;
		  	let metadataFile = req.files.metadata;
 
		  	log.channel("Photobooth").verbose(req.files.video.name)
		  	log.channel("Photobooth").verbose(req.files.poster.name)
		  	log.channel("Photobooth").verbose(req.files.metadata.name)

		  	if (!fs.existsSync(__dirname + '/public/photobooth/')){
			    fs.mkdirSync(__dirname + '/public/photobooth/');
			}

		  	if (!fs.existsSync(__dirname + '/public/photobooth/sessions/')){
			    fs.mkdirSync(__dirname + '/public/photobooth/sessions/');
			}

			if (!fs.existsSync(__dirname + '/public/photobooth/sessions/' + req.body.sessionId)){
			    fs.mkdirSync(__dirname + '/public/photobooth/sessions/' + req.body.sessionId);
			}

			//todo this can contain all configurations for the visual
			let config = {
				name : req.body.username,
				message : req.body.usermessage
			}
			let configStr = JSON.stringify(config, null, 2);
			
		  	Promise.all([
		  		fsp.writeFile(__dirname + '/public/photobooth/sessions/' + req.body.sessionId +'/config.json', configStr),
		  		videoFile.mv(__dirname + '/public/photobooth/sessions/' + req.body.sessionId + "/" + req.files.video.name),
		  		posterFile.mv(__dirname + '/public/photobooth/sessions/' + req.body.sessionId + "/" + req.files.poster.name),
		  		metadataFile.mv(__dirname + '/public/photobooth/sessions/' + req.body.sessionId + "/" + req.files.metadata.name)
		  		])
		  	.then(_=>{
	  			log.channel("Photobooth").verbose('moved files succcessfully')
	  			res.send("Uploaded files successfully")
	  		}).catch(error=>{
	  			log.channel("Photobooth").error('failed to move files: ', error)
	  			res.status(500).send('failed to move files: ' + error)
	  		})
	    })

	api.router.route('/session/:sessionId')
		.get((req, res) => {
		 	const result = browser(req.headers['user-agent']);
			log.channel("Frontend").verbose(JSON.stringify(result))
			if(result.name == "ie"){
				log.channel("Frontend").verbose("redirecting ie users to login")
			    res.redirect("/login")
			    //todo make this render an error page
			}
			else{
				log.channel("Photobooth").verbose("serving session: ", req.params.sessionId)
				res.render('photobooth/main', { sessionId: req.params.sessionId })
			}
		})

	return api
}
