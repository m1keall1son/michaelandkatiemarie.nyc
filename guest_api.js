const createAPI = require('./api')
const db = require('./db')()

function createGuestAPI(router) {

	if(!router){
		log.error("NO ROUTER PROVIDED TO CREATE GUEST API.")
		return;
	}

	let api = createAPI(router,'/guest','Guest Management API')

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

module.exports = (router) => {
	return createGuestAPI(router)
}
