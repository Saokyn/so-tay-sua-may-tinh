/* Tự ẩn thanh trên/dưới khi cuộn xuống; hiện lại khi cuộn lên, ở đầu/cuối trang, rê chuột hoặc chạm gần mép */
(function(){var top=document.querySelector('.top'),bot=document.querySelector('.tabbar');if(!top||!bot)return;
var last=window.scrollY,hid=false,tk=false,hold=0;
function set(h){if(h===hid)return;hid=h;document.body.classList.toggle('bars-hidden',h)}
function atEdge(){var y=window.scrollY,max=document.documentElement.scrollHeight-window.innerHeight;return y<40||y>max-40}
function onScroll(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;var y=window.scrollY,d=y-last;
 if(atEdge())set(false);else if(Date.now()>hold){if(d>6)set(true);else if(d<-6)set(false)}
 if(Math.abs(d)>6)last=y})}
window.addEventListener('scroll',onScroll,{passive:true});
function reveal(){set(false);hold=Date.now()+1200}
window.addEventListener('mousemove',function(e){if(!hid)return;if(e.clientY<70||e.clientY>window.innerHeight-80)reveal()},{passive:true});
window.addEventListener('pointerdown',function(e){if(!hid||e.pointerType==='mouse')return;if(e.clientY<60||e.clientY>window.innerHeight-70)reveal()},{passive:true});
document.addEventListener('focusin',function(e){if(top.contains(e.target)||bot.contains(e.target))reveal()});
window.addEventListener('hashchange',function(){set(false);last=0});
})();
