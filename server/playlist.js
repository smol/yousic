(function(){
	'use strict';

	module.exports.playlist = function(model, queue_manager, io) {
		var playlist = model.find(function(err, videos){
			queue_manager.add_video(videos);
		});

		var playlist = function(socket){
			var self = this;

			this.socket = socket;

			socket.on('remove_video', function(data){
				self.remove_video(data);
			});

			socket.on('add_video', function(data){
				self.add_video(data)
			});

		};

		playlist.prototype.add_video = function(data){
			var self = this;

			model.find({ video_id : data.id.videoId }, function(err, results){
				if (results.length > 0){
					socket.emit('add_video_error', { msg : 'video already in the playlist' });
					return;
				}

				var video = new model({
					video_id : data.id.videoId,
					title : data.snippet.title,
					thumbnail : data.snippet.thumbnails.default.url,
					duration : data.duration
				});

				video.save(function(err){
					if (!err)
						queue_manager.add_video(video);
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
							queue_manager.remove_video(data);
						});
					}
				});
			});
		};
		return playlist;
	}

})();
