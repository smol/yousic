(function(){
	'use strict';

	var Mongoose = require('mongoose');
	var $q = require('q');

	module.exports.playlist_model = function(){
		var user = require('./user.model').user_model();

		var video = Mongoose.model('video', Mongoose.Schema({
			id : { type : String, required : true, index : { unique : true } },
			title : String,
			thumbnail : String,
			duration : Number,
			user : Mongoose.model('user').schema
		}));

		return {
			find_one : function(id){
				var deferred = $q.defer();

				if (!id)
					return deferred.reject('video\'s id is not defined');

				video.findOne({ id : id }).populate('user', 'login').exec(function(err, result){
					if (err)
						return deferred.reject('an error occured with video request');
					return deferred.resolve(result);
				});

				return deferred.promise;
			},
			all : function(){
				var deferred = $q.defer();

				video.find({}).populate('user', 'login').exec(function(err, result){
					deferred.resolve(result);
				});

				return deferred.promise;
			},
			insert : function(data){
				var deferred = $q.defer();

				user.find_one({login : data.user.login }).then(function(result){
					data.user = result;

					var new_video = new video(data);

					new_video.save(function(err){
						console.warn('save', err);
						if (err)
							return deferred.reject('an error occured on save video');
						return deferred.resolve(new_video);
					});

				});
				return deferred.promise;
			}
		};
	};
})();
