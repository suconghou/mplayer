
	(function($){
		$.fn.mplayer=
		{
			player:new Audio(),
			source:null,
			index:0,
			init:function(dom)
			{
				this.source=dom;
				this.ready(0);
				return this;
			},
			ready:function(index)
			{
				var total=this.source.length;
				if(index>-1&&index<total)
				{
					this.index=index;
					var src=$(this.source[index]).data('src')?$(this.source[index]).data('src'):$(this.source[index]).attr('src');
					this.player.src=src;
				}
				return this;

			},
			event:function(e,fun)
			{
				this.player.addEventListener(e,fun);
			},
			helper:function()
			{
				
			},
			play:function()
			{
				this.player.play();
				return this;
			},
			stop:function()
			{
				if(!this.player.paused)
				{
					this.player.pause(); 
					this.player.currentTime = 0.0;
				}
				return this;
			},
			pause:function()
			{
				this.player.pause();
				return this;
			},
			next:function()
			{
				
				this.ready(this.index+1).play();
			},
			prev:function()
			{
				
				this.ready(this.index-1).play();
			},
			mute:function(on)
			{
				if(typeof on !='undefined')
				{
					this.player.muted=on;
				}
				else
				{
					this.player.muted=!this.player.muted;
				}
				return this;
			},
			volume:function(volume)
			{
				if(volume)
				{
					this.player.volume=volume;
				}
				else
				{
					return this.player.volume;
				}

			},

			current:function(time)
			{
				
				if(time)
				{
					var total=this.player.duration;
					if(time<0)
					{
						time=0;
					}
					else if(time>total)
					{
						time=total;
					}
					this.player.currentTime=time;
				
				}
				else
				{
					return this.player.currentTime;
				}

			},
			playInfo:function(key)
			{
				var info=
				{
					duration:this.player.duration,
					currentTime:this.player.currentTime,
					muted:this.player.muted,
					volume:this.player.volume,
					paused:this.player.paused,
					list:this.source,
					index:this.index
				}
				info.played=(info.currentTime*100/info.duration).toFixed(2)+'%';
				return info;
				
			}

		};
		window.mplayer=function(dom)
		{
			return $.fn.mplayer.init($(dom));
		};
	})(jQuery);

