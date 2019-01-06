const express = require('express')

class API {
	constructor(rootDir,name){
		this.router = express.Router()
		this.apiName = name
		this.rootDir = rootDir
	}
}
module.exports = (rootDir,name)=>{ return new API(rootDir,name) }
