const UTILS = require('utils')
const log = UTILS.logger()
const get_app = require('./wedding_app')
const app = get_app()
const fileUpload = require('express-fileupload');
const fs = require('fs')

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

		  	Promise.all([
		  		videoFile.mv(__dirname + '/public/photobooth/' + req.files.video.name),
		  		posterFile.mv(__dirname + '/public/photobooth/' + req.files.poster.name),
		  		metadataFile.mv(__dirname + '/public/photobooth/' + req.files.metadata.name)
		  		])
		  	.then(_=>{
	  			log.channel("Photobooth").verbose('moved files succcessfully')
	  			res.send("Uploaded files successfully")
	  		}).catch(error=>{
	  			log.channel("Photobooth").error('failed to move files: ', error)
	  			res.status(500).send('failed to move files: ' + error)
	  		})
	    })

	return api
}
