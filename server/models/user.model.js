(function(){
	'use strict';

	var mysql = require('../mysql').mysql_wrapper().get_connection();
	var $q = require('q');
	var SALT_WORK_FACTOR = 10;


	module.exports.user_model = function(){
		return {
			find_one : function(data){
				var deferred = $q.defer();
				var sql = null;

				console.warn(data);
				if (data.login)
					sql = 'SELECT id, login, password from user WHERE login = \'' + data.login + '\'';
				else if (data.id)
					sql = 'SELECT id, login, password from user WHERE id = \'' + data.id + '\'';
				else
					return;

				mysql.query(sql, function(err, rows, fields){
					console.warn(err, rows);
					if (err){
						deferred.reject(err);
						return;
					}
					deferred.resolve(rows[0]);
				});

				return deferred.promise;
			},
			create : function(data){
				var deferred = $q.defer();
				var self = this;

				var new_user = { login : data.login, password : data.password };

				var sql = 'INSERT INTO user (login, password, id_role) VALUES(\''+ data.login +'\',\'' + data.password + '\', 3)';

				mysql.query(sql, function(err, rows, fields){
					if (err){
						console.warn('error', err);

						deferred.reject(err);
						return;
					}

					console.warn('success');

					deferred.resolve(new_user);
				});

				return deferred.promise;
			}
		};
	};
})();
