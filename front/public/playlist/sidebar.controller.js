(function(){
	'use strict';

	angular.module('yousic').controller('SidebarController', [
		'$scope', '$timeout', 'youtubeService', 'socketService', function($scope, $timeout, youtubeService, socketService){
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
			sessionStorage.removeItem('user_login');
			$state.go('root.layout.home');
		};

		$scope.close_results = function(){
			$scope.results = [];
		};

		$scope.add_video = function(item){
			youtubeService.add_video(item.id.videoId).then(function(duration){
				item.duration = duration;
				$scope.results = [];
				socketService.emit('add_video', item);
			});


		};

	}]);
})();
