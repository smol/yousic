(function(){
	'use strict';

	angular.module('yousic').controller('PlaylistController', ['$scope', '$state', '$timeout', 'youtubeService', 'socketService', function($scope, $state, $timeout, youtubeService, socketService){
		$scope.query = '';

		$scope.results = [];
		$scope.current = null;

		socketService.on('no_playing_video', function(data){
			$scope.current = null;
			$scope.apply();
		});

		socketService.on('send_playing_video', function(data){
			console.warn('playing_video', data);
			$scope.current = data;
			$scope.$apply();
		});


		$timeout(function(){
			console.warn('send');
			socketService.emit('get_playing_video');
		});



		// socketService.on('update_connected_users', function(data){
		// 	$scope.connected_users = data;
		// 	$scope.$apply();
		// });




	}]);
})();
