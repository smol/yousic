(function(){
	'use strict';

	module.exports.playlist = function(model, socket) {
		var is_playing = false;
		var index_playing = 0;

		var playlist_videos = [];
		var playlist = model.find(function(err, videos){
			playlist_videos = videos;

			start_playlist(videos);
			// if (playlist_videos.l)
		});

		function start_playlist(videos){
			if (videos.length === 0)
				return;

			socket.emit('playing_video', { id : videos[index_playing].video_id, time : 0 });

			setTimeout(function(){
				++index_playing;

				if (index_playing === playlist_videos.length)
					index_playing = 0;

				start_playlist(playlist_videos);
			}, videos[index_playing].duration * 1000);

			socket.on('player_loaded', function(){

			});
		}

		var playlist = {
			add_video : function(data){
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

							if (playlist_videos.length === 1){
								start_playlist(playing_videos);
							}
							self.fetch();
						}
					});
				});
			},
			start : function(){
				start_playlist(playlist_videos);
			},
			remove_video : function(data){
				var self = this;
				model.findOne({ video_id : data.video_id }, function(err, result){
					if (err || result === null)
						return;

					result.remove(function(err){
						if (!err){
							model.find(function(err, videos){
								playlist_videos = videos;
								self.fetch();
							});

						}
					});
				});
			},
			fetch : function(){
				socket.emit('playlist_fetched', playlist_videos);
			}
		};

		socket.on('remove_video', function(data){
			playlist.remove_video(data);
		});

		socket.on('fetch_video', function(data){
			console.warn('fetch video');
			playlist.fetch();
		});

		socket.on('add_video', function(data){
			playlist.add_video(data)
		});

		return this;
	}

})();
