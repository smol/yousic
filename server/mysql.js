(function(){

	var mysql = require('mysql');

	console.warn('initialisation mysql_wrapper');

	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'yousic'
	});

	connection.connect();

	module.exports.mysql_wrapper = function(){


		return {
			get_connection : function(){
				return connection;
			}
		}
	};
})();
