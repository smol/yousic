(function(){
	// js/script.js
	'use strict';


	/**
	 * Déclaration de l'application routeApp
	 */
	var app = angular.module('yousic', [
		// Dépendances du "module"
		'ui.router'
	]);

	app.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
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

		});

		$rootScope.$on('$stateChangeSuccess',function(){

		});
	}]);
})();
