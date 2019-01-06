const guests = require('../guests')
const guestDB = guests(()=>{
	guestDB.guests.bulkCreate([
	  { firstname: 'Michael', lastname: 'Allison', email:'hello@michaelallison.lol' },
	  { firstname: 'KatieMarie', lastname: 'Gorczynski', email:'katiemarie.gorczynski@gmail.com' },
	]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
	  	return guestDB.guests.findAll();
	}).then(users => {
		console.log("success!")
	  	console.log(users) // ... in order to get the array of user objects
	    guestDB.close()
	}).catch(error=>console.log(error))
})

