(function(){
	'use strict';

	module.exports.queue_manager = function(io){
		// queue_manager.prototype.next_video = function(){
		// 			var self = this;
		//
		// 			console.warn('next_video', this.index);
		//
		// 			if (this.videos.length === 0){
		// 				this.is_playing = false;
		// 				return;
		// 			}
		//
		// 			this.is_playing = true;
		// 			console.warn('start video', this.videos[this.index].title, this.videos[this.index].duration);
		// 			this.playing_video_changed(this.io.sockets);
		// 			// io.sockets.emit('playing_video', { video : videos[index_playing], time : 0 });
		//
		// 			setTimeout(function(){
		// 				++self.index;
		//
		// 				if (self.index >= self.videos.length)
		// 					self.index = 0;
		//
		// 				self.next_video();
		// 			}, this.videos[this.index].duration * 100);
		// 		};

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
				console.info('next video', self.current());
				io.sockets.emit('queue.change', self.current());

				setTimeout(function(){
					++self.index;

					if (self.index >= self.videos.length)
						self.index = 0;

					next();


				}, self.videos[self.index].duration * 100);
			}

			if (this.videos.length > 0){
				this.status = STATUS.PLAYING;
				console.info('start');
				next();
			}
		};

		Queue.prototype.current = function(){
			return this.videos[this.index];
		};

		Queue.prototype.add = function add(video){
			console.warn('add queue', this.videos, video);
			this.videos.push(video);

			if (this.status === STATUS.STOPPED)
				this.start();
		};

		return new Queue();

	};
})();
