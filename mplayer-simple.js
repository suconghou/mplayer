(function(w)
{

	function basePlay()
	{
		var player=new Audio();
		var base=
		{
			ready:function(index,source)
			{
				if(source)
				{
					player.source=Array.isAray(source)?source:[source];
				}
				src=player.source?player.source[index]:index;
				if(src)
				{
					player.src=src;
					player.index=src==index?(!function(){player.source=[src];return 0;}):index;
				}
				return this;
			},
			play:function(src)
			{
				if(src)
				{
					player.src=src;
				}
				if(!player.src)
				{
					return console.warn('player has no stream');
				}
				player.play();
			},
			pause:function()
			{
				player.pause();
			},
			stop:function()
			{
				player.pause();
				player.currentTime = 0.0;
			},
			next:function()
			{
				this.ready(player.index+1).play();
			},
			prev:function()
			{
				this.ready(player.index-1).play();
			},
			mute:function(on)
			{
				if(typeof on !=='undefined')
				{
					player.muted=on;
				}
				else
				{
					player.muted=!player.muted;
				}
			},
			volume:function(volume)
			{
				if(volume)
				{
					player.volume=volume;
				}
				else
				{
					return player.volume;
				}
			},
			current:function(time)
			{
				if(typeof time !=='undefined')
				{
					var total=player.duration;
					if(time<0)
					{
						time=0;
					}
					else if(time>total)
					{
						time=total;
					}
					player.currentTime=time;
				}
				else
				{
					return player.currentTime;
				}
			},
			playInfo:function()
			{
				var info=
				{
					player:player,
					duration:player.duration,
					currentTime:player.currentTime,
					muted:player.muted,
					volume:player.volume,
					paused:player.paused,
					source:player.source,
					index:player.index
				};
				info.played=(info.currentTime*100/info.duration).toFixed(2)+'%';
				return info;
			},
			on:function(e,fun,off)
			{
				if(off)
				{
					player.removeEventListener(e,fun);
				}
				else
				{
					player.addEventListener(e,fun,false);
				}
				return this;
			},
			destroy:function()
			{
				if(player)
				{
					player.pause();
					player=null;
				}
			}
		};
		return base;
	}

	function addEventListenerOnce(element, event, fn)
	{
		var func=function(e)
		{
			element.removeEventListener(event,func);
			fn.call(this,e);
		};
		element.addEventListener(event,func);
	}



	w.mplayer=function(cfg)
	{
		if(cfg&&cfg.btn&&cfg.init)
		{
			var playerList=[];
			var btnlist=document.querySelectorAll(cfg.btn);
			var bootstrap=function(e)
			{
				var id=cfg.key?cfg.key.call(this,this,e):this.parentNode.dataset.id;
				if(!playerList[id])
				{
					var player=new basePlay();
					cfg.init.call(this,player,this,e);
					playerList[id]=player;
					player.call=call;
					this.click();
				}
			};
			var call=function(player,fn,param)
			{
				var players;
				if(!(player instanceof basePlay))
				{
					if(!(playerList[player] instanceof basePlay))
					{
						players=playerList;
					}
					else
					{
						player=playerList[player];
					}
				}
				(players||[player]).forEach(function(player)
				{
					var func=player[fn];
					if(typeof func=='function')
					{
						func.apply(player,param);
					}
					else
					{
						console.warn('player has no method '+fn.toString());
					}
				});
			};
			for (var i = 0, len = btnlist.length; i < len; i++)
			{
				addEventListenerOnce(btnlist[i],'click',bootstrap);
			}
			return {playerList:playerList,call:call};
		}
		else
		{
			return new basePlay();
		}
	};

})(window);
