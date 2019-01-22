
class LoggerChannel {
	constructor(level, channelName){
		this.logLevel = level;
		this.channelName = channelName;
	}
}

LoggerChannel.prototype.setLogLevel = function(level) {
	this.logLevel = level
}

let LogLevel = { REALLY_VERBOSE : 16, VERBOSE : 8, NOTICE : 4,  WARNING : 2, ERROR : 1, SILENT : 0 };

LoggerChannel.prototype.notice = function() {
	if(arguments.length > 0 && this.logLevel >= LogLevel.NOTICE){
		let style = "\x1b[37m\x1b[40m%s\x1b[0m%s";
		let header = "[NOTICE]" + (this.channelName ? `[${this.channelName}]` : "");
		let message = ' ';
		for(let i = 0; i < arguments.length; i++) {
			message += String(arguments[i]);
		}
		console.log(style, header, message);
	}
};

LoggerChannel.prototype.verbose = function() {
	if(arguments.length > 0 && this.logLevel >= LogLevel.VERBOSE){
		let style = "\x1b[32m\x1b[40m%s\x1b[0m%s";
		let header = "[VERBOSE]" + (this.channelName ? `[${this.channelName}]` : "");
		let message = ' ';
		for(let i = 0; i < arguments.length; i++) {
			message += String(arguments[i]);
		}
		console.log(style, header, message);
	}
};


LoggerChannel.prototype.reallyVerbose = function() {
	if(arguments.length > 0 && this.logLevel >= LogLevel.REALLY_VERBOSE){
		let style = "\x1b[32m\x1b[40m%s\x1b[0m%s";
		let header = "[VERBOSE]" + (this.channelName ? `[${this.channelName}]` : "");
		let message = ' ';
		for(let i = 0; i < arguments.length; i++) {
			message += String(arguments[i]);
		}
		console.log(style, header, message);
	}
};

LoggerChannel.prototype.warning = function() {
	if(arguments.length > 0 && this.logLevel >= LogLevel.WARNING){
		let style = "\x1b[33m\x1b[40m%s\x1b[0m%s";
		let header = "[WARNING]" + (this.channelName ? `[${this.channelName}]` : "");
		let message = ' ';
		for(let i = 0; i < arguments.length; i++) {
			message += String(arguments[i]);
		}
		console.log(style, header, message);
	}
};

LoggerChannel.prototype.error = function() {
	if(arguments.length > 0 && this.logLevel >= LogLevel.ERROR){
		let style = "\x1b[31m\x1b[40m%s\x1b[0m%s";
		let header = "[ERROR]" + (this.channelName ? `[${this.channelName}]` : "");
		let message = ' ';
		for(let i = 0; i < arguments.length; i++) {
			message += String(arguments[i]);
		}
		console.trace(style, header, message);
	}
};

LoggerChannel.prototype.fatalError = function() {
	if(arguments.length > 0){
		let style = "\x1b[31m\x1b[40m%s\x1b[0m%s";
		let header = "[ERROR]" + (this.channelName ? `[${this.channelName}]` : "");
		let message = ' ';
		for(let i = 0; i < arguments.length; i++) {
			message += String(arguments[i]);
		}
		console.trace(style, header, message);
		process.exit(1)
	}
};

class Logger extends LoggerChannel {
	constructor(level){
		super(level, null);
		this.channels = {};

		this.channel = function(channelName) {
			if (!this.channels.hasOwnProperty(channelName)) {
				this.channels[channelName] = new LoggerChannel(this.logLevel,channelName);
			}
			return this.channels[channelName];
		};

		this.setLogLevelOnAllChannels = function(level) {
			this.logLevel = level
			for (let property in this.channels) {
				if (this.channels.hasOwnProperty(property)) {
					this.channels.setLogLevel(level);
				}
			}
		};
	}
}

let instance = null;

//todo this should take a config for file logging etc.
module.exports = () => {
	if(!instance){
		instance = new Logger( LogLevel.NOTICE );
	}
	return instance;
}

module.exports.LogLevel = LogLevel;
