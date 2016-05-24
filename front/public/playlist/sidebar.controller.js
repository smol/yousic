(function(){
	'use strict';

	angular.module('yousic').controller('SidebarController', [
		'$scope','$rootScope', '$timeout', '$state', '$cookies', 'youtubeService', 'socketService', 'userService',
		function($scope, $rootScope, $timeout, $state, $cookies, youtubeService, socketService, userService){
		var timeout_removal = null;

		$scope.$watch('query', function(){
			if (timeout_removal){
				$timeout.cancel(timeout_removal);
				timeout_removal = null;
			}

			timeout_removal = $timeout(function() {

				youtubeService.search($scope.query).then(function(data){
					$scope.results = data.items;
				});

			}, 500);
		});

		$scope.logout = function(){

			userService.logout().then(function(){
				$rootScope.user = null;
				$state.go($state.current, {}, {reload : true});
			});
		};

		$scope.close_results = function(){
			$scope.results = [];
		};

		$scope.add_video = function(item){
			youtubeService.add_video(item.id.videoId).then(function(duration){
				item.duration = duration;
				$scope.results = [];


				item.user = $scope.user;
				console.warn('hallo', item);
				socketService.emit('playlist.add_video', {
					id : item.id.videoId,
					title : item.snippet.title,
					duration : item.duration,
					thumbnail : item.snippet.thumbnails.default.url,
					user : $scope.user
				});
			});


		};

	}]);
})();
