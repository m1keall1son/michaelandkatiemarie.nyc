const express = require('express')
const app = express()
const port = 3000
const path = require("path")

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => {
	//res.render('index')
	res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('/info', (req, res) => {
	res.render('info')
})

app.listen(port, 'localhost', () => console.log('listing on http://localhost:3000'))
