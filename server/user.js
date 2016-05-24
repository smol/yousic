(function () {
	'use strict';

	module.exports.user = function (model, io) {

		var connected_user = [];

		var user = function (socket) {
			this.socket = socket;

			var self = this;
			this.socket.on('join', function (data) {
				self.join(data);
			});

			this.socket.on('disconnect', function () {
				var i = 0;
				for (var length = connected_user.length; i < length; ++i) {
					if (connected_user[i].socket === self.socket)
						break;
				}

				connected_user.splice(i, 1);
				io.sockets.emit('update_connected_users', connected_user);
			});
		};

		user.prototype.join = function (data) {
			var self = this;

			this.login = data.user_login;

			function join_successful() {
				console.warn('user ', data.user_login, 'now connected');
				self.socket.emit('join_success');

				connected_user.push({ socket: self.socket, login: self.login });
				// io.sockets.emit('update_connected_users', connected_user)
			}

			model.find({ login: data.user_login }, function (err, results) {
				if (results.length === 0) {
					var new_user = new model({ login: data.user_login });
					new_user.save(function (err) {
						if (err)
							console.error('error save', err);
						else
							join_successful();
					});
				} else
					join_successful();
			});
		};

		return user;
	};
})();
