(function(){
	'use strict';

	var mysql = require('../mysql').mysql_wrapper().get_connection();
	var $q = require('q');

	module.exports.playlist_model = function(){
		var user = require('./user.model').user_model();

		return {
			find_one : function(data){
				var deferred = $q.defer();

				if (!data)
					return deferred.reject('video\'s id is not defined');

				var sql = '';
				if (data.video_id){
					sql = '\
						SELECT \
							title, \
							duration, \
							thumbnail, \
							video_id as id, \
							user.login as user_login \
						FROM video \
						LEFT JOIN user ON user.id = video.id_user \
						WHERE video.video_id = '+ mysql.escape(data.video_id) +' \
					';
				} else {
					sql = '\
						SELECT \
							title, \
							duration, \
							thumbnail, \
							video_id as id, \
							user.login as user_login \
						FROM video \
						LEFT JOIN user ON user.id = video.id_user \
						WHERE video.id = '+ data +' \
					';
				}

				mysql.query(sql, function(err, rows, fields){
					if (err)
						return deferred.reject('an error occured with video request');
					return deferred.resolve(rows ? rows[0] : null);
				});

				return deferred.promise;
			},
			delete : function(id){
				var deferred = $q.defer();

				var sql = 'DELETE FROM video WHERE video_id='+ mysql.escape(id) +'';

				console.warn(sql);
				mysql.query(sql, function(err, rows, fields){
					console.warn(err, rows, fields);

					if (err)
						return deferred.reject(err);

					return deferred.resolve();
				});

				return deferred.promise;
			},
			all : function(){
				var deferred = $q.defer();

				mysql.query('\
					SELECT \
						title, \
						duration, \
						thumbnail, \
						video_id, \
						user.login as user_login, \
						user.id as user_id \
					FROM video \
					LEFT JOIN user ON user.id = video.id_user \
				', function(err, rows, fields){
					var results = [];

					for (var i = 0; i < rows.length; i++){
						results.push({
							title : rows[i].title,
							duration : rows[i].duration,
							thumbnail : rows[i].thumbnail,
							id : rows[i].video_id,
							user : {
								login : rows[i].user_login
							}
						});
					}

					deferred.resolve(results);
				});

				return deferred.promise;
			},
			insert : function(data){
				var deferred = $q.defer();

				var self = this;

				console.warn(data);

				mysql.query('\
					INSERT INTO \
					video (title, duration, thumbnail, video_id, id_user) \
					VALUES (' + mysql.escape(data.title) + ',\'' + data.duration + '\',\'' + data.thumbnail + '\',\'' + data.id + '\', \''+ data.user.id +'\') \
				', function(err, rows, fields){
					if (err)
						return deferred.reject(err);

					console.warn('insert video', rows);
					self.find_one(rows.insertId).then(function(video){
						console.warn('insert video', video);
						deferred.resolve(video);
					}).catch(function(err){
						console.warn('error insert video', err);
					});
				});
				return deferred.promise;
			}
		};
	};
})();
