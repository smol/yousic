(function(){
	'use strict';

	var exports = module.exports = {};

	exports.log = {
		error : function(){
			console.error('ERROR', arguments);
		},
		info : function(){
			console.error('LOG', arguments);
		}

	};

})();
