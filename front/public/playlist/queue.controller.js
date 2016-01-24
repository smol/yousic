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
	}]);
})();
