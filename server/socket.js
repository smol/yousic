(function(){
	'use strict';

	module.exports.socket_manager = function(io, mongoose){
		var user_model = mongoose.model('user', { login : String });
		var video_model = mongoose.model('video', { video_id : String, title : String, thumbnail : String, duration : Number });

		var Queue = require('./queue').queue();
		var playlist_module = require('./playlist');
		var user_module = require('./user');

		var queue = new Queue(io);


		var Playlist = playlist_module.playlist(video_model, queue, io);
		var User = user_module.user(user_model, io);

		queue.callback = function(socket){

		};

		io.sockets.on('connection', function(socket){
			new Playlist(socket);
			new User(socket);


			socket.on('get_queue', function(data){
				console.warn('get_queue');
				queue.queue_changed(socket);
			});

			socket.on('get_playing_video', function(data){
				queue.playing_video_changed(socket);
			});
		});
	};
})();
