(function(){
	'use strict';

	angular.module('yousic').service('youtubeService', ['$http', 'socketService', function($http, socketService){
		var base_url = 'https://www.googleapis.com/youtube/v3/';
		var api_key = 'AIzaSyDZ5VrXpyv-TRT5ijOaInJz9bIx-Svj8LU';

		return {
			search : function(query){
				return $http.get(
					base_url + 'search?q="'+query+'"&category=music&maxResults=10&part=snippet&type=video&videoDuration=any&key=' + api_key
				).then(function(response){
					return response.data;
				});
			},
			add_video : function(id){
				return $http.get(
					base_url + 'videos?id='+id+'&part=contentDetails&key=' + api_key
				).then(function(response){
					var regex = /PT([0-9]+)M([0-9]+)S/;
					var matches = regex.exec(response.data.items[0].contentDetails.duration);

					var min = +matches[1];
					var sec = +matches[2];

					return min * 60 + sec;
				});
			}
		};
	}]);
})();
