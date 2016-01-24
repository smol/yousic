(function(){
	'use strict';

	angular.module('yousic').controller('LoginController',
		['$scope', '$rootScope', '$state', '$timeout', '$window', 'userService', function($scope, $rootScope, $state, $timeout, $window, userService){
		$scope.login = null;

		$scope.account_popup = false;

		$scope.join = function(){
			userService.authenticate($scope.login, $scope.password).then(function(data){
				$rootScope.user = data.user;
				$state.go('root.layout.home');
			});
		};

		$scope.create_account = function(){
			if ($scope.account_password !== $scope.account_re_password)
				return;

			userService.create($scope.account_login, $scope.account_password).then(function(data){
				$rootScope.user = data.user;
				$state.go('root.layout.home');
			});
		};

		// var token = localStorage.getItem('yousic_token');

		// if (token){
		// 	socketService.on('user.verify_token', function(data){
		// 		$scope.$parent.user = data;
		// 		console.warn($scope.$parent.user);
		// 		$state.go('root.layout.playlist.views');
		// 	}).emit('user.verify_token', {token : token});
		// }

		// socketService.on('user.join.error', function(data){
		// 	console.warn('error', data);
		// });

		// socketService.on('user.connect', function(data){
		// 	$scope.$parent.user = data;
		// 	localStorage.setItem('yousic_token', data.token);
		// 	$state.go('root.layout.playlist.views');
		// 	// sessionStorage.setItem('user_login', $scope.login);
		// 	//
		// });
		//
		// socketService.on('user.create', function(data){
		// 	console.warn('user created');
		// 	$scope.account_popup = false;
		// });
		//
		// $scope.create_account = function(){
		//
		// 	console.warn($scope.account_login, $scope.account_password, $scope.account_re_password);
		// 	if (!$scope.account_login || !$scope.account_password || !$scope.account_re_password)
		// 		return;
		//
		// 	if ($scope.account_password !== $scope.account_re_password)
		// 		return;
		//
		// 	socketService.emit('user.create', {
		// 		login : $scope.account_login,
		// 		password : $scope.account_password
		// 	});
		// };
		//
		//
		//
		// $scope.create_account_popup = function(){
		// 	$scope.account_popup = true;
		// };
		//
		// $scope.join = function(){
		// 	socketService.emit('user.connect', { login : $scope.login, password : $scope.password });
		// };
	}]);
})();
