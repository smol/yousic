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
			.state('root.login', {
				templateUrl : 'login/index.html',
				controller : 'LoginController'
			})
			// .state('root.layout.home', {
			// 	templateUrl : 'home/index.html',
			// 	controller : 'HomeController',
			// })
			.state('root.layout', {
				abstract : true,
				templateUrl : 'playlist/index.html',
				controller : 'PlaylistController'
			})
			.state('root.layout.home', {
				url : '/',
				views : {
					'sidebar' : {
						templateUrl : 'playlist/sidebar.html',
						controller : 'SidebarController'
					},
					'main' : {
						templateUrl : 'playlist/main.html',
						controller : 'IndexController'
					},
					'queue' : {
						templateUrl : 'playlist/queue.html',
						controller : 'QueueController'
					}
				}
			});

		$urlRouterProvider.when('', '/');
	}]);
})();
