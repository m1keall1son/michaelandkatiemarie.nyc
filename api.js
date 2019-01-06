class API {
	constructor(router,rootDir,name){
		this.router = router
		this.apiName = name
		this.rootDir = rootDir
	}
}
module.exports = (router,rootDir,name)=>{ return new API(router,rootDir,name) }
