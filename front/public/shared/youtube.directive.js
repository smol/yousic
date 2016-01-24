(function(){
	'use strict';

	angular.module('yousic').directive('youtube', ['$timeout', '$window', function($timeout, $window){
		return {
			restrict : 'E',
			replace : true,
			scope : {
				id : '=',
				time : '='
			},
			template : '<div class="video"></div>',
			link : function(scope, element, attrs){
				var tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';

				var head_tag = document.getElementsByTagName('script')[0];
				head_tag.parentNode.insertBefore(tag, head_tag);

				var player;

				$window.onYouTubeIframeAPIReady = function(){
					player = new YT.Player(element[0], {
						height : '390',
						width : '640',
						events: {
							'onReady': onPlayerReady,
							'onStateChange': onPlayerStateChange
						}
					});

				};

				scope.$watch('id', function(){
					console.warn('scope id', scope.id);
					if (player){
						player.loadVideoById(scope.id, 0, 'medium');
						player.playVideo();
					}
				});

				function onPlayerReady(event){
					console.warn('player ready', scope.id);
					if (scope.id){
						player.loadVideoById(scope.id, 0, 'medium');
						player.playVideo();
					}
				}

				var done = false;
				function onPlayerStateChange(event){
					if (event.data === YT.PlayerState.PLAYING && !done){
						// $timeout(stopVideo, 6000);
						done = true;
					}
				}

				function stopVideo(){
					player.stopVideo();
				}
			}
		};
	}]);
})();
