(function(){
	'use strict';

	angular.module('yousic').controller('HomeController', ['$scope', '$state', 'socketService', function($scope, $state, socketService){
		$scope.login = null;

		if (sessionStorage.getItem('user_login')){
			$state.go('root.layout.playlist.views');
			return;
		}

		socketService.on('join_success', function(data){
			sessionStorage.setItem('user_login', $scope.login);
			$scope.$parent.user = $scope.login;

			$scope.login = null;
			$state.go('root.layout.playlist.views');
		});

		$scope.join = function(){
			socketService.emit('join', { user_login : $scope.login });
		};
	}]);
})();
