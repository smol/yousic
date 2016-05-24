(function(){
	'use strict';

	angular.module('yousic').controller('QueueController', ['$scope', '$timeout', 'socketService', function($scope, $timeout, socketService){
		// $scope.queue = [];
		//
		// $scope.remove_video = function(item){
		// 	socketService.emit('remove_video', item);
		// };
		//
		// socketService.on('queue_changed', function(data){
		// 	$scope.queue = data;
		// 	$scope.$apply();
		// });
		//
		// $timeout(function(){
		// 	socketService.emit('get_queue');
		// });

		$scope.remove = function(item){
			console.warn('hallo', item);
			socketService.emit('playlist.remove_video', item);
		};

		socketService.on('playlist.remove_video', function(data){
			console.warn('queue_changed', data);
			
			// socketService.emit('playlist.current');
			socketService.emit('playlist.fetch');
		});
	}]);
})();
