(function(){
	'use strict';

	module.exports.controllers = function(io, app){
		this.modules = [];

		this.routes = function(routes){
			for (var i = 0, length = routes.length; i < length; ++i){
				this.modules[routes[i]] = require('./controllers/' + routes[i] + '.controller')[routes[i] + '_controller'](io);
			}
		};

		this.dispatch = function(socket){
			var self = this;

			function call_action(controller, action){
				socket.on(controller + '.' + action, function(data){
					self.modules[controller][action](data).then(function(response){
						if (response){
							if (response.to === 'all')
								io.sockets.emit(controller + '.' + action, response.data);
							else if (response.to === 'caller')
								socket.emit(controller + '.' + action, response.data);
							else if (response.to === 'others')
								socket.broadcast.emit(controller + '.' + action, response.data);
						}
					}).catch(function(data){
						console.error('ERROR SERVER', data);
						socket.emit(controller + '.' + action + '.error', data);
					});
				});
			}

			for (var controller_name in this.modules){
				for (var key in this.modules[controller_name]){
					if (typeof this.modules[controller_name][key] === 'function'){
						call_action(controller_name, key);
					}
				}
			}
		};

		return this;
	};
})();
