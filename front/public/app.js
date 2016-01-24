(function(){
	// js/script.js
	'use strict';


	/**
	 * Déclaration de l'application routeApp
	 */
	var app = angular.module('yousic', [
		// Dépendances du "module"
		'ui.router',
		'ngCookies'
	]);

	app.run(['$rootScope', '$state', '$stateParams', '$cookies', 'userService',
			function($rootScope, $state, $stateParams, $cookies, userService) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			console.warn('$stateChangeError: ', event, toState, toParams, fromState, fromParams, error);
			if (error) {
				switch(error.code) {
					case 404:
						$state.go('root.public.404', {error: error}, {location:false});
						break;
					default:
						$state.go('root.public.error', {error: error}, {location:false});
				}
			}
		});

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (toState.name !== 'root.login' && !$cookies.get('token')){
				console.warn('fail');
				$state.go('root.login');
				event.preventDefault();
				return;
			} else if (toState.name !== 'root.login' && !$rootScope.user) {
				userService.verify_token().then(function success(response){
					var params = angular.copy(toParams);
					$rootScope.user = response.data;
					$state.go(toState.name, params);
				}, function error(error){
					$state.go('root.login');
				});
				event.preventDefault();
				return;
			}
		});

		$rootScope.$on('$stateChangeSuccess',function(){

		});
	}]);
})();
