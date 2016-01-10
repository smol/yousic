(function(){
	'use strict';

	angular.module('yousic').controller('RootController', ['$scope', '$state', function($scope, $state){
		if (!$scope.user){
			$state.go('root.layout.home', { notify : false });
			return;
		}
	}]);
})();
