(function(){
	'use strict';

	var app = angular.module('yousic');

	/**
	 * Configuration du module principal : routeApp
	 */
	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('root', {
				abstract : true,
				templateUrl : 'root.html',
				controller : 'RootController'
			})
			.state('root.layout', {
				abstract:true,
				views : {
					'' : { template : '<div data-ui-view></div>' },
				}
			})
			.state('root.layout.home', {
				templateUrl : 'home/index.html',
				controller : 'HomeController',
			})
			.state('root.layout.playlist', {
				url : '/',
				templateUrl : 'playlist/index.html',
				controller : 'PlaylistController'
			});

		$urlRouterProvider.when('', '/');
	}]);
})();
