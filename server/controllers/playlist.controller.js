(function(){
	'use strict';

	var $q = require('q');
	var log = require('../log').log;

	module.exports.playlist_controller = function() {
		var model = require('../models/playlist.model').playlist_model();
		var queue = require('./playlist/queue.manager').queue_manager();

		model.all().then(function(result){
			log.info('queue', result);
			queue.videos = result;
		});

		console.warn(log);

		return {
			add_video : function(data){
				var deferred = $q.defer();

				log.info('add_video', data);
				model.find_one(data.id).then(function(video){
					if (!video){
						queue.add(data);
						return model.insert(data);
					}

					return null;
				}).then(function(data){
					if (!data)
						deferred.reject('error add_video');
					else {
						deferred.resolve({
							to :'all',
							data : queue.videos
						});
					}
				}).catch(function(data){
					console.warn('error add_video', data);
				});

				return deferred.promise;
			},
			remove_video : function(data){
				var deferred = $q.defer();

				return deferred.promise;
			},
			fetch : function(){
				var deferred = $q.defer();

				deferred.resolve({
					to : 'caller',
					data : queue.videos
				});

				return deferred.promise;
			}
		};


		// this.add_video = function(data){
		// 	var self = this;
		//
		// 	console.warn('addvideo', model);
		//
		// 	model.find_one(data.id).then(function(video){
		// 		console.warn('video', video);
		// 		if (video)
		// 			return video;
		// 		console.warn(data);
		// 		return model.insert(data);
		// 	}).then(function(data){
		// 		console.warn('data', data);
		// 	});

			// var promise = new Promise(function(resolve, reject){
			// 	if (!data)
			// 		return reject();
			//
			//
			// 		// if (results.length > 0){
			// 		// 	reject();
			// 		// 	// self.socket.emit('add_video_error', { msg : 'video already in the playlist' });
			// 		// 	return;
			// 		// }
			//
			// 		var video = new model({
			// 			video_id : data.id.videoId,
			// 			title : data.snippet.title,
			// 			thumbnail : data.snippet.thumbnails.default.url,
			// 			duration : data.duration
			// 		});
			//
			// 		return resolve(true);
			//
			// 		// video.save(function(err){
			// 		// 	resolve();
			// 		// 	// if (!err)
			// 		// 	// 	queue_manager.add_video(video);
			// 		// });
			// }).then(function(){
			// 	console.warn('add_video');
			// }).catch(function(){
			// 	console.error('error')
			// });

			// return promise;
		// };
		//
		// this.remove_video = function(data){
		//
		// };

		// var playlist = function(socket){
		// 	var self = this;
		//
		// 	this.socket = socket;
		//
		// 	socket.on('remove_video', function(data){
		// 		self.remove_video(data);
		// 	});
		//
		// 	socket.on('add_video', function(data){
		// 		self.add_video(data)
		// 	});
		//
		// };

		// playlist.prototype.add_video = function(data){
		//
		// };
		//
		// playlist.prototype.remove_video = function(data){
		// 	var self = this;
		// 	model.findOne({ video_id : data.video_id }, function(err, result){
		// 		if (err || result === null)
		// 			return;
		//
		// 		result.remove(function(err){
		// 			if (!err){
		// 				model.find(function(err, videos){
		// 					queue_manager.remove_video(data);
		// 				});
		// 			}
		// 		});
		// 	});
		// };
		// return this;
	}

})();
