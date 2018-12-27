const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hi Babe! :)'))

app.listen(port, 'localhost', () => console.log('listing on http://localhost:3000'))
