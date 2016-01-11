(function(){
	'use strict';

	module.exports.playlist = function(model, io) {
		var is_playing = false;
		var index_playing = 0;

		var playlist_videos = [];
		var playlist = model.find(function(err, videos){
			playlist_videos = videos;

			is_playing = true;
			start_playlist(videos);
			// if (playlist_videos.l)
		});

		function start_playlist(videos){
			if (videos.length === 0){
				is_playing = false;
				io.sockets.emit('no_video');
				return;
			}

			console.warn('start video', videos[index_playing].title, videos[index_playing].duration);
			io.sockets.emit('playing_video', { video : videos[index_playing], time : 0 });

			setTimeout(function(){
				++index_playing;

				if (index_playing >= playlist_videos.length)
					index_playing = 0;

				start_playlist(playlist_videos);
			}, videos[index_playing].duration * 1000);
			// , 2000);
		}

		var playlist = function(socket){
			this.socket = socket;

			var self = this;

			socket.on('fetch_current_video', function(data){
				if (playlist_videos[index_playing])
					self.socket.emit('playing_video', { id : playlist_videos[index_playing].video_id, time : 0 })
			});

			socket.on('remove_video', function(data){
				self.remove_video(data);
			});

			socket.on('fetch_video', function(data){
				console.warn('fetch_video');
				self.fetch();
			});

			socket.on('add_video', function(data){
				self.add_video(data)
			});

		};

		playlist.prototype.start = function (first_argument) {

		};

		playlist.prototype.add_video = function(data){
			var self = this;

			model.find({ video_id : data.id.videoId }, function(err, results){
				if (results.length > 0){
					socket.emit('add_video_error', { msg : 'video already in the playlist' });
					return;
				}

				console.warn(data);
				var video = new model({ video_id : data.id.videoId, title : data.snippet.title, thumbnail : data.snippet.thumbnails.default.url, duration : data.duration });
				video.save(function(err){
					if (!err){
						playlist_videos.push(video);

						console.warn('add video :', data.snippet.title, 'to the playlist');
						if (playlist_videos.length >= 1 && !is_playing){
							start_playlist(playlist_videos);
							is_playing = true;
						}
						self.fetch(true);
					}
				});
			});
		};

		playlist.prototype.remove_video = function(data){
			var self = this;
			model.findOne({ video_id : data.video_id }, function(err, result){
				if (err || result === null)
					return;

				result.remove(function(err){
					if (!err){
						model.find(function(err, videos){
							playlist_videos = videos;
							self.fetch(true);
						});

					}
				});
			});
		};

		playlist.prototype.fetch = function(for_all){
			if (for_all){
				io.sockets.emit('playlist_fetched', playlist_videos);
			} else {
				this.socket.emit('playlist_fetched', playlist_videos);
			}
		};

		return playlist;
	}

})();
