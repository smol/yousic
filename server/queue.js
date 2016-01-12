(function(){
	module.exports.queue = function(){
		var STATE = { NO_VIDEO : -1, RUNNING : 1, IDLE : 0 };

		function state_changed(state, manager){
			manager.is_playing = !(state === STATE.IDLE || state === STATE.NO_VIDEO);

			manager.callback(state);
		}

		var queue_manager = function(io){
			this.io = io;
			this.is_playing = false;
			this.index = 0;

			this.videos = [];

			this.state = STATE.IDLE;
		};

		queue_manager.prototype.playing_video_changed = function(socket){
			var video = this.get_playing_video();

			if (video)
				socket.emit('send_playing_video', video);
			else
				socket.emit('no_playing_video');
		};

		queue_manager.prototype.queue_changed = function(socket){
			socket.emit('queue_changed', this.videos);
		};

		queue_manager.prototype.get_playing_video = function(){
			if (this.index < this.videos.length){
				return this.videos[this.index];
			}

			return null;
		};

		queue_manager.prototype.next_video = function(){
			var self = this;

			if (this.videos.length === 0){
				this.is_playing = false;
				return;
			}

			console.warn('start video', this.videos[this.index].title, this.videos[this.index].duration);
			this.playing_video_changed(this.io.sockets);
			// io.sockets.emit('playing_video', { video : videos[index_playing], time : 0 });

			setTimeout(function(){
				++self.index;

				if (self.index >= self.videos.length)
					self.index = 0;

				self.next_video();
			}, this.videos[this.index].duration * 1000);
		};

		queue_manager.prototype.remove_video = function(video){
			var index = 0;
			for (var length = this.videos.length; index < length; ++index){
				if (this.videos[index].video_id === video.video_id)
					break
			}

			if (index < this.videos.length){
				this.videos.splice(index, 1);
				this.queue_changed(this.io.sockets);
			}
		};

		queue_manager.prototype.add_video = function(video){
			if (video instanceof Array){
				for (var i = 0, length = video.length; i < length; ++i){
					this.videos.push(video[i]);
				}
			} else {
				this.videos.push(video);
			}

			this.queue_changed(this.io.sockets);

			if (this.is_playing === false){
				this.next_video();
			}
		};

		return queue_manager;
	};
})();
