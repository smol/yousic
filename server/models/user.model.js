(function(){
	'use strict';

	var Mongoose = require('mongoose');
	var bcrypt = require('bcrypt');
	var $q = require('q');
	var SALT_WORK_FACTOR = 10;

	var model = Mongoose.model('user', {
		login : { type : String, required : true, match : /^[a-zA-Z0-9-_]+$/ },
		password : { type : String, required : true },
		videos : [{type : Mongoose.Schema.ObjectId, ref : 'video'}]
	});

	module.exports.user_model = function(){
		return {
			find_one : function(data){
				var deferred = $q.defer();

				model.findOne(data, function(err, result){
					console.warn(err, result);
					if (err){
						deferred.reject(err);
						return;
					}
					deferred.resolve(result);
				});

				return deferred.promise;
			},
			create : function(data){
				var deferred = $q.defer();

				var new_user = new model({login : data.login, password : data.password });
				new_user.save(function(err){
					if (err)
						return deferred.reject('error save', err);
					else
						return deferred.resolve(new_user);
				});

				return deferred.promise;
			}
		};
	};
})();
