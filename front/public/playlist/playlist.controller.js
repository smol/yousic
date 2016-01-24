(function(){
	'use strict';

	angular.module('yousic').controller('PlaylistController', ['$scope', '$state', '$timeout', 'youtubeService', 'socketService', function($scope, $state, $timeout, youtubeService, socketService){
		$scope.query = '';

		$scope.results = [];
		$scope.queue = [];
		$scope.current = null;

		socketService.on('playlist.no_video', function(data){
			$scope.current = null;
			$scope.apply();
		});

		socketService.on('queue.change', function(data){
			console.warn('playing_video', data);
			$scope.current = data;
			$scope.$apply();
		});

		socketService.on('playlist.current', function(data){
			console.warn('playing_video', data);
			$scope.current = data;
			$scope.$apply();
		});

		socketService.on('playlist.fetch', function(data){
			console.warn('fetch', data);
			$scope.queue = data;
		});

		socketService.on('playlist.add_video', function(data){

			$scope.queue = data;
			$scope.$apply();
		});

		$timeout(function(){
			socketService.emit('playlist.current');
			socketService.emit('playlist.fetch');
			// console.warn('send');
			// socketService.emit('user.call');
			//
			// socketService.emit('playlist.add_video', {id : 'v2AC41dgww'});
		});



		// socketService.on('update_connected_users', function(data){
		// 	$scope.connected_users = data;
		// 	$scope.$apply();
		// });




	}]);
})();
