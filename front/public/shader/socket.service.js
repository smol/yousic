(function(){
	'use strict';

	angular.module('yousic').service('socketService', [function(){
		var socket = io.connect();

		return socket;
	}]);
})();
