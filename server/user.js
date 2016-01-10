(function(){
	'use strict';

	module.exports.user = function(model){

		var user = function(socket){
			this.socket = socket;

			var self = this;
			this.socket.on('join', function(data){
				self.join(data);
			});
		};

		user.prototype.join = function(data) {
			var self = this;
			model.find({ login : data.user_login }, function(err, results){
				if (results.length === 0){
					var new_user = new model({login : data.user_login});
					new_user.save(function(err){
						if (err)
							console.error('error save', err);
						else {
							self.socket.emit('join_success');
						}
					});
				} else {
					// playlist.start();
					self.socket.emit('join_success');
				}
			});
		};

		return user;
	};
})();
