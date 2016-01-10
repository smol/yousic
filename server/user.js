(function(){
	'use strict';

	module.exports.user = function(model){

		var user = function(socket){
			this.socket = socket;

			this.socket.on('join', function(data){

			});
		};

		user.prototype.join = function (playlist) {
			model.find({ login : data.user_login }, function(err, results){
				if (results.length === 0){
					var new_user = new model({login : data.user_login});
					new_user.save(function(err){
						if (err)
							console.error('error save', err);
						else {
							socket.emit('join_success');
						}
					});
				} else {
					playlist.start();
					socket.emit('join_success');
				}
			});
		};

		return user;
	};
})();
