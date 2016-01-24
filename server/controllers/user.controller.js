(function(){
	'use strict';

	var $q = require('q');
	// var jwt = require('jwt-simple');
	// var moment = require('moment');

	module.exports.user_controller = function(){
	// require('../controllers').controllers = function(){
		var model = require('../models/user.model').user_model();

		return {
			create : function(data){
				var self = this;
				var deferred = $q.defer();

				model.create(data).then(function(){
					console.warn('create successed');
					self.connect(data);
				}).catch(function(data){
					console.warn('error', data);
					deferred.reject(data);
				});

				return deferred.promise;
			}
		};
	};
})();
