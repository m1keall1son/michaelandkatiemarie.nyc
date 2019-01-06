let logger = require('./logger')
let log = logger()

let createApp = require('./app')
let app = createApp()

const PORT = process.env.PORT || 3000

const production = process.env.NODE_ENV == "production"

var config = {};

log.setLogLevel(logger.LogLevel.VERBOSE)

app.configure(config)
app.run(PORT)
