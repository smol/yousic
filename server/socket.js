(function(){
	'use strict';

	module.exports.socket_manager = function(io, mongoose){
		var sockets = [];

		var user_model = mongoose.model('user', { login : String });
		var video_model = mongoose.model('video', { video_id : String, title : String, thumbnail : String, duration : Number });

		var playlist_module = require('./playlist');
		var user_module = require('./user');

		var Playlist = playlist_module.playlist(video_model, io);
		var User = user_module.user(user_model);

		io.sockets.on('connection', function(socket){

			sockets.push(socket);


			new Playlist(socket);
			new User(socket);
		});
	};
})();
