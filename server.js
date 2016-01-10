(function(){
	var express = require('express');
	var app = express();
	var server = app.listen(8080);
	var http = require('http').Server(app);
	var io = require('socket.io')(server);

	var mongoose = require('mongoose');
	var morgan = require('morgan');
	var body_parser = require('body-parser');
	var method_override = require('method-override');

	mongoose.connect('mongodb://localhost/yousic');

	app.use(express.static(__dirname + '/front/build'));
	app.use(morgan('dev'));
	app.use(body_parser.urlencoded({'extended' : 'true'}));
	app.use(body_parser.json());
	app.use(body_parser.json({ type : 'application/vnd.api+json' }));
	app.use(method_override());

	var playlist_module = require('./server/playlist');
	var user_module = require('./server/user');

	var user_model = mongoose.model('user', { login : String });
	var video_model = mongoose.model('video', { video_id : String, title : String, thumbnail : String, duration : Number });



	io.on('connection', function(socket){
		console.warn(playlist_module);

		var playlist = playlist_module.playlist(video_model, socket);
		var user = user_module.user(user_model, socket);
		user.join();
	});


	app.get('/', function(req, res) {
		res.sendFile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});


	console.log('App listening on port 8080');
})();
