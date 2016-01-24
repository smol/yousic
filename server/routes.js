(function(){
	'use strict';

	module.exports.routes = function(io, app){
		this.io = io;
		this.controllers = require('./controllers').controllers(io,app);

		this.controllers.routes(['user', 'playlist']);

		var self = this;

		io.sockets.on('connection', function(socket){
			self.controllers.dispatch(socket);
		});

		return this;
	};


})();
