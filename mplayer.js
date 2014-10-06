
	(function($){
		$.fn.mplayer=
		{
			player:new Audio(),
			source:null,
			index:0,
			playerAnalyser:null,
			timer:null,
			init:function(dom)
			{
				this.helper();
				var audioContext = new window.AudioContext();
				this.playerAnalyser = audioContext.createAnalyser();
				
				var playerSource = audioContext.createMediaElementSource(this.player);
				playerSource.connect(this.playerAnalyser);
				
				this.playerAnalyser.connect(audioContext.destination);

				

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

			process:function()
			{

				this.plot();
				// this.bgplot();

			},
			bgplot:function()
			{
				var playerTimeDomainData = new Uint8Array($.fn.mplayer.playerAnalyser.fftSize);
				$.fn.mplayer.playerAnalyser.getByteTimeDomainData(playerTimeDomainData);
				
				var volumn = Array.max(playerTimeDomainData).value - Array.min(playerTimeDomainData).value,
						volumnStep = 0.2;
				
				this.volumnCurrent = this.volumnCurrent || 0;
				if (this.volumnCurrent < volumn) {
					this.volumnCurrent += volumnStep;
				} else {
					this.volumnCurrent -= volumnStep;
				}
				var h = (1 - this.volumnCurrent / 256) * 360,
						s = (volumn / 256) * 30 + 30 * this.volumnCurrent / 256 ,
						l =  (volumn / 256) * 30 + 20;
				
				document.body.style.backgroundColor = 'hsl(' + h + ',' + s + '%, ' +  l + '%)';
			},
			plot:function()
			{
				var canvas = document.getElementById('canvas'),
			    cwidth = canvas.width,
			    cheight = canvas.height - 2,
			    meterWidth = 6, //能量条的宽度
			    gap = 2, //能量条间的间距
			    meterNum = cwidth / (6 + 2), //计算当前画布上能画多少条
			    ctx = canvas.getContext('2d');
				//定义一个渐变样式用于画图
				gradient = ctx.createLinearGradient(0, 0, 0, 300);
				gradient.addColorStop(1, '#0f0');
				gradient.addColorStop(0.5, '#ff0');
				gradient.addColorStop(0, '#f00');
				ctx.fillStyle = gradient;
				var drawMeter = function()
				{
					var array = new Uint8Array($.fn.mplayer.playerAnalyser.frequencyBinCount);
					$.fn.mplayer.playerAnalyser.getByteFrequencyData(array);
				    var step = Math.round(array.length / meterNum); //计算采样步长
				    ctx.clearRect(0, 0, cwidth, cheight); //清理画布准备画画
				    for (var i = 0; i < meterNum; i++)
				    {
				        var value = array[i * step];
				        ctx.fillRect(i * 8 /*频谱条的宽度+条间间距*/ , cheight - value + gap, meterWidth, cheight);
				    }
				    if($.fn.mplayer.timer)
				    {
				    	$.fn.mplayer.timer=requestAnimationFrame(drawMeter);
				    }
				   
				}
				drawMeter();
			},
			event:function(e,fun)
			{
				this.player.addEventListener(e,fun);
			},
			helper:function()
			{
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				
				(function() {
				    var lastTime = 0;
				    var vendors = ['webkit', 'moz'];
				    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
				        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
				                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
				    }

				    if (!window.requestAnimationFrame) {
				        window.requestAnimationFrame = function(callback, element) {
				            var currTime = new Date().getTime();
				            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
				            var id = window.setTimeout(function() {
				                callback(currTime + timeToCall);
				            }, timeToCall);
				            lastTime = currTime + timeToCall;
				            return id;
				        };
				    }
				    if (!window.cancelAnimationFrame) {
				        window.cancelAnimationFrame = function(id) {
				            clearTimeout(id);
				        };
				    }
				}());


				Array.max = function (array) {
					var value = array[0],
						index = 0;
					for (var i = 1; i < array.length; i++) {
						if (array[i] > value) {
							value = array[i];
							index = i;
						}
					}
					return {value : value, index : index};
				};

				Array.min = function (array) {
					var value = array[0],
						index = 0;
					for (var i = 1; i < array.length; i++) {
						if (array[i] < value) {
							value = array[i];
							index = i;
						}
					}
					return {value : value, index : index};
				};

					
			},
			play:function()
			{
				this.timer=1;
				this.process();
				this.player.play();
				return this;
			},
			stop:function()
			{
				this.timer=null;
				if(!this.player.paused)
				{
					this.player.pause(); 
					this.player.currentTime = 0.0;
					window.cancelAnimationFrame(this.timer);
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

