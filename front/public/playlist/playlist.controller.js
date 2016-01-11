(function(){
	'use strict';

	angular.module('yousic').controller('PlaylistController', ['$scope', '$timeout', 'youtubeService', 'socketService', function($scope, $timeout, youtubeService, socketService){
		$scope.query = '';
		$scope.playlist = [];
		$scope.results = [];
		$scope.current = null;

		var timeout_removal = null;

		socketService.emit('fetch_video');
		socketService.emit('fetch_current_video');

		socketService.on('no_video', function(data){
			$scope.current = null;
		});

		socketService.on('playlist_fetched', function(data){
			$scope.playlist = data;
			$scope.$apply();
		});

		socketService.on('update_connected_users', function(data){
			$scope.connected_users = data;
			$scope.$apply();
		});

		socketService.on('playing_video', function(data){
			console.warn('playing_video', data);
			$scope.current = data;
			$scope.$apply();
		});

		$scope.$watch('query', function(){
			if (timeout_removal){
				$timeout.cancel(timeout_removal);
				timeout_removal = null;
			}

			timeout_removal = $timeout(function() {

				youtubeService.search($scope.query).then(function(data){
					console.warn(data);
					$scope.results = data.items;
				});

			}, 500);
		});

		$scope.close_results = function(){
			$scope.results = [];
		};

		$scope.remove_video = function(item){
			socketService.emit('remove_video', item);
		};

		$scope.add_video = function(item){
			youtubeService.add_video(item.id.videoId).then(function(duration){
				item.duration = duration;
				// console.warn(item);
				socketService.emit('add_video', item);
			});

			$scope.results = [];
		};
	}]);
})();
