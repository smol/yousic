(function(){
	'use strict';

	angular.module('yousic').service('userService', ['$http', '$cookies',function($http, $cookies){
		return {
			authenticate : function(login, password){
				return $http.post('/authenticate/', { login : login, password : password }).then(function success(response){
					return response.data;
				}, function error(response){
					console.warn('error', response);
				});
			},
			create : function(login, password){
				return $http.post('/create_account/', { login : login, password : password }).then(function success(response){
					return response.data;
				}, function error(response){
					console.warn('error', response);
				});
			},
			verify_token : function(){
				return $http.get('/verify_token/');
			},
			logout : function(){
				return $http.get('/logout/');
			}
		};
	}]);
})();
