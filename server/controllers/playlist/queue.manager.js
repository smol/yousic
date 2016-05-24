(function(){
	'use strict';

	module.exports.queue_manager = function(io){
		var STATUS = { PLAYING : 1, STOPPED : 0 }

		var Queue = function queue(){
			this.status = STATUS.STOPPED;
			this.videos = [];
			this.index = 0;

			this.start();
		};

		Queue.prototype.start = function start(){
			if (this.status === STATUS.PLAYING){
				return;
			}

			var self = this;

			function next(){
				io.sockets.emit('queue.change', self.current());

				setTimeout(function(){
					++self.index;

					if (self.index >= self.videos.length)
						self.index = 0;

					next();

				}, self.videos[self.index].duration * 1000);
			}

			if (this.videos.length > 0){
				this.status = STATUS.PLAYING;
				console.info('start');
				next();
			}
		};

		Queue.prototype.remove = function (id) {
			console.warn('splace', id);
			for (var i = 0; i < this.videos.length; i++) {
				if (this.videos[i].id === id){
					this.videos.splice(i, 1);
					console.warn(i, this.index);
					// this.index--;
					return;
				}
			}
		};

		Queue.prototype.current = function(){
			if (!this.videos || this.videos.length === 0)
				return null;
			return this.videos[this.index];
		};

		Queue.prototype.add = function add(video){
			console.warn('add queue', this.videos, video);
			if (!this.videos)
				this.videos = [];

			this.videos.push(video);

			if (this.status === STATUS.STOPPED)
				this.start();
		};

		return new Queue();

	};
})();
