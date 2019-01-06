const createAPI = require('./api')
const db = require('./db')()

module.exports = () => {

	let api = createAPI('/guest','Guest Management API')

	api.router.route('/list')
		.get((req, res) => {
			if(!db.isConnected()){
				log.error("NO DB CONNECTION")
				res.status(500).json({error: "NO DATABASE CONNECTION"})
			}
			db.guestList((err,guests)=>{
				if(err){
					res.status(500).send(err)
				}else{
					res.send(guests)
				}
			})
	    })
	    
	return api
}
