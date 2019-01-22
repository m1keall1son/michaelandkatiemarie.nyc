const UTILS = require('utils')
const log = UTILS.logger()

const app = require('./wedding_app')()

var config = {
	port: process.env.PORT || 3000
};

app.configure(config)
app.run()
