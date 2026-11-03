(function(){
var D=window.SDATA,S=window.SVG,$=function(s){return document.querySelector(s)};
var V=$('#view');
function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'d').toLowerCase()}
window.norm=norm;
var FK='stsmt.fav';function favs(){try{return JSON.parse(localStorage.getItem(FK))||[]}catch(e){return []}}
function isFav(id){return favs().indexOf(id)>=0}
function togFav(id){var f=favs(),i=f.indexOf(id);i>=0?f.splice(i,1):f.push(id);localStorage.setItem(FK,JSON.stringify(f));toast(i>=0?'Đã bỏ khỏi Yêu thích':'Đã lưu vào Yêu thích');route()}
window.togFav=togFav;
window.toast=function(m){toast(m)};function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},1800)}
function A(id){return D.A.filter(function(a){return a.id===id})[0]}
function diff(n){return '<span class="chip d'+n+'">'+['','Dễ','Trung bình','Khó'][n]+'</span>'}
function head(t,back){return '<div class="phead">'+(back?'<a class="back" href="'+back+'" aria-label="Quay lại">‹</a>':'')+'<h1>'+t+'</h1></div>'}
var SAFE='<div class="alert danger"><b>⚠️ An toàn trước tiên:</b> Lưu và sao lưu dữ liệu quan trọng trước khi sửa. Tắt máy, rút sạc trước khi lau chùi. Pin phồng, mùi khét, khói, đổ nước → tắt máy, rút điện, ngưng dùng. Không mở vỏ máy/bộ nguồn nếu không có kinh nghiệm.</div>';
function ltabs(k,base){return '<nav class="ltabs" aria-label="Loại"><b>Loại:</b>'+[['','Tất cả'],['sua','🛠 Sửa lỗi'],['hd','📘 Hướng dẫn']].map(function(o){return '<a class="ltab'+(k===o[0]?' on':'')+'" href="'+base(o[0])+'">'+o[1]+'</a>'}).join('')+'</nav>'}
function isHow(c){return c==='hd'}
function home(k){k=k||'';
 var h='<section class="hero"><div><p class="eyebrow"><span class="live"></span>Trợ lý sửa máy</p><h1>Máy tính gặp chuyện gì?</h1><p>Chọn chủ đề → triệu chứng → trả lời vài câu → xem cách xử lý từng bước.</p><div class="hstat"><span><b>'+D.G.filter(function(g){return g.kind!=='how'}).length+'</b> cách sửa lỗi</span><span><b>'+D.G.filter(function(g){return g.kind==='how'}).length+'</b> hướng dẫn cài đặt</span><span><b>'+D.A.length+'</b> chủ đề</span><span><b>AI</b> hỗ trợ</span></div></div><div class="hero-ill">'+S('shield')+'</div></section>';
 h+='<form class="sbar" onsubmit="location.hash=\'#/search/\'+encodeURIComponent(this.q.value);return false"><input name="q" type="search" placeholder="Tìm: may cham, man hinh xanh, may in…" aria-label="Tìm kiếm"><button>Tìm</button></form>';
 h+='<div class="quick"><a href="#/tools">'+S('keyboard')+'<span>Phím tắt</span></a><a href="#/parts">'+S('book')+'<span>Thuật ngữ</span></a><a href="#/maint">'+S('clock')+'<span>Bảo trì</span></a><a href="#/ai">'+S('chat')+'<span>Hỏi AI</span></a></div>';
 h+=ltabs(k,function(x){return x?'#/loai/'+x:'#/'});
 D.CATS.filter(function(c){return !k||(k==='hd')===isHow(c.id)}).forEach(function(c){var n=D.G.filter(function(g){return g.cat===c.id}).length;h+='<h2 class="sec">'+esc(c.name)+' <small class="muted">· '+n+' hướng dẫn</small></h2><div class="grid">'+D.A.filter(function(a){return a.cat===c.id}).map(function(a){return '<a class="card app" href="#/a/'+a.id+'">'+S(a.icon)+'<b>'+esc(a.name)+'</b><small>'+a.syms.length+(isHow(a.cat)?' hướng dẫn':' triệu chứng')+'</small></a>'}).join('')+'</div>'});
 h+='<h2 class="sec">'+(k==='hd'?'Tất cả hướng dẫn cài đặt':k==='sua'?'Tất cả cách sửa lỗi':'Tất cả hướng dẫn')+'</h2><div class="list">'+D.G.filter(function(g){return !k||(k==='hd')===(g.kind==='how')}).map(function(g){return '<a class="row" href="#/g/'+g.id+'"><span>'+esc(g.title)+'<small>'+(g.kind==='how'?'📘 Hướng dẫn cài đặt · ':'')+(g.pro?'🏪 '+D.CALL:'✅ '+D.DIY)+'</small></span><i>›</i></a>'}).join('')+'</div>';
 h+='<a class="alert warn lnk" href="#/safety"><b>⚠️ Quy tắc an toàn &amp; khi nào nên mang ra tiệm</b> ›</a>';
 h+='<p class="muted" style="text-align:center"><a href="#/credits">Nguồn hình ảnh</a></p>';
 return h}
function appl(id){var a=A(id);if(!a)return nf();
 var hw=isHow(a.cat);return head(esc(a.name),hw?'#/loai/hd':'#/')+'<p class="muted">'+(hw?'Chọn việc cần làm:':'Chọn triệu chứng:')+'</p><div class="list">'+a.syms.map(function(s){return '<a class="card symc" href="'+(hw?'#/g/'+s.fb:'#/d/'+a.id+'/'+s.id)+'">'+fig(s.img,'sm')+'<span class="symn"><b>'+esc(s.name)+'</b><i>›</i></span></a>'}).join('')+'</div>'}
function diag(aid,sid,step){var a=A(aid);if(!a)return nf();var s=a.syms.filter(function(x){return x.id===sid})[0];if(!s)return nf();
 step=+step||0;if(step>=s.qs.length){location.replace('#/g/'+s.fb);return ''}
 var q=s.qs[step];
 return head(esc(s.name),'#/a/'+aid)+'<div class="prog"><i style="width:'+Math.round((step+1)/(s.qs.length+1)*100)+'%"></i></div>'+fig(s.img)+'<div class="qcard"><p class="eyebrow">Câu hỏi '+(step+1)+'/'+s.qs.length+'</p><h2>'+esc(q.q)+'</h2><div class="yn"><a class="btn yes" href="#/g/'+q.yes+'">Có</a><a class="btn no" href="#/d/'+aid+'/'+sid+'/'+(step+1)+'">Không</a></div><a class="skip" href="#/g/'+s.fb+'">Bỏ qua, xem hướng dẫn chung ›</a></div>'}
function fig(id,cls){var m=D.IMG&&D.IMG[id];if(!m)return '';return '<figure class="fig'+(cls?' '+cls:'')+'"><img src="img/'+id+'.webp" width="'+m.w+'" height="'+m.h+'" loading="lazy" decoding="async" alt="'+esc(m.alt)+'"><figcaption>🔍 '+esc(m.cap)+'</figcaption></figure>'}
function cx(t){return esc(t).replace(/`([^`]+)`/g,'<code>$1</code>')}
function lst(a,cls){return '<ul'+(cls?' class="'+cls+'"':'')+'>'+a.map(function(t){return '<li>'+cx(t)+'</li>'}).join('')+'</ul>'}
function guide(id){var g=D.GM[id];if(!g)return nf();
 var hw=g.kind==='how';var h=head(esc(g.title),'javascript:history.back()');
 h+='<div class="meta">'+(hw?'<span class="chip how">📘 Hướng dẫn cài đặt</span>':'')+(g.pro?'<span class="chip pro">🏪 '+D.CALL+'</span>':'<span class="chip d1">✅ '+D.DIY+'</span>')+diff(g.diff)+(g.time&&g.time!=='—'?'<span class="chip">⏱ '+esc(g.time)+'</span>':'')+'<button class="chip fav'+(isFav(id)?' on':'')+'" onclick="togFav(\''+id+'\')">'+(isFav(id)?'★ Đã lưu':'☆ Lưu')+'</button></div>';
 h+=(g.img?fig(g.img):'')+SAFE;
 var w=g.warn||[];if(typeof w==='string')w=[w];
 if(hw&&g.muc)h+='<div class="box muc"><b>🎯 Mục đích</b><p>'+cx(g.muc)+'</p></div>';
 if(w.length)h+='<div class="alert danger"><b>🛑 '+(hw?'An toàn':'Cảnh báo an toàn')+'</b>'+lst(w)+'</div>';
 if(g.sym&&g.sym.length)h+='<div class="box"><b>🔎 Triệu chứng</b>'+lst(g.sym)+'</div>';
 if(g.cause&&g.cause.length)h+='<div class="box"><b>📊 Nguyên nhân thường gặp</b> <small class="ref">xếp theo khả năng</small><ol>'+g.cause.map(function(t){return '<li>'+cx(t)+'</li>'}).join('')+'</ol></div>';
 if(g.tools&&g.tools.length)h+='<div class="box"><b>🧰 Cần chuẩn bị</b>'+lst(g.tools)+'</div>';
 if(g.steps.length)h+='<h2 class="sec">'+(g.pro?'Việc bạn có thể làm trước':'Các bước')+'</h2><ol class="steps">'+g.steps.map(function(s,i){return '<li>'+(s.svg?'<div class="sill'+(s.svg==='warn'?' w':'')+'">'+S(s.svg)+'</div>':'')+'<div><b>Bước '+(i+1)+'</b><p>'+cx(s.t)+'</p>'+(s.img?fig(s.img,'st'):'')+'</div></li>'}).join('')+'</ol>';
 if(g.verify&&g.verify.length)h+='<div class="box"><b>✅ '+(hw?'Kiểm tra kết quả':'Kiểm tra sau khi sửa')+'</b>'+lst(g.verify)+'</div>';
 if(g.loi&&g.loi.length)h+='<div class="box loi"><b>🧩 Lỗi hay gặp</b> <small class="ref">bấm để xem cách sửa</small><div class="list">'+g.loi.filter(function(l){return D.GM[l[1]]}).map(function(l){return '<a class="row" href="#/g/'+l[1]+'"><span>'+esc(l[0])+'<small>'+esc(D.GM[l[1]].title)+'</small></span><i>›</i></a>'}).join('')+'</div></div>';
 if(g.note)h+='<p class="note">💡 '+cx(g.note)+'</p>';
 if(g.esc)h+='<div class="alert pro"><b>⚖️ Tự làm hay ra tiệm</b><p>'+cx(g.esc)+'</p></div>';
 if(g.svc)h+='<div class="box"><b>Nếu nhờ tiệm</b><p>'+cx(g.svc)+'</p><small class="ref">giá tham khảo, có thể thay đổi</small></div>';
 h+='<div class="alert warn">Không chắc chắn ở bước nào → dừng lại, hỏi AI hoặc mang ra tiệm. Máy còn bảo hành nên mang đến trung tâm bảo hành của hãng.</div>';
 return h}
function tools(){return head('Phím tắt & công cụ','#/')+D.TOOLS.map(function(t){return '<details class="card acc" id="'+t.id+'"><summary>'+S(t.icon)+'<div><b>'+esc(t.name)+'</b><small>'+esc(t.desc)+'</small></div></summary><ol>'+t.how.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol>'+(t.warn?'<div class="alert warn">'+esc(t.warn)+'</div>':'')+'<p><span class="price">'+esc(t.price)+'</span> <small class="ref">giá tham khảo</small></p></details>'}).join('')}
function parts(){return head('Từ điển thuật ngữ','#/')+D.PARTS.map(function(p){return '<div class="card part" id="'+p.id+'"><b>'+esc(p.name)+'</b><p>'+esc(p.desc)+'</p><p class="note">💡 '+esc(p.tip)+'</p><span class="price">'+esc(p.price)+'</span>'+(p.price!==D.CALL?' <small class="ref">giá tham khảo</small>':'')+'</div>'}).join('')}
function maint(){return head('Bảo trì định kỳ','#/')+'<p class="muted">Lịch gợi ý để máy chạy bền, ít hỏng vặt.</p>'+D.MAINT.map(function(m){return '<div class="card part"><b>'+esc(m.name)+'</b><ul>'+m.items.map(function(i){return '<li>'+esc(i)+'</li>'}).join('')+'</ul></div>'}).join('')}
function credits(){var k=Object.keys(D.IMG||{}),re=k.filter(function(i){return D.IMG[i].kind==='re'}).length;return head('Nguồn hình ảnh','#/')+'<div class="card part"><p>Toàn bộ '+k.length+' hình trong ứng dụng là <b>hình minh hoạ tự vẽ</b> cho sổ tay này ('+re+' hình tái tạo giao diện Windows/macOS/phần mềm, '+(k.length-re)+' hình vẽ minh hoạ phần cứng). Không dùng ảnh chụp hay ảnh của bên thứ ba; không có logo thương hiệu.</p><p>Giấy phép: CC0 — tự do dùng lại. Tên Windows, macOS, Zalo… là nhãn hiệu của chủ sở hữu tương ứng, chỉ dùng để mô tả.</p></div><div class="list">'+k.map(function(i){return '<a class="row" href="img/'+i+'.webp"><span>'+esc(i)+' — '+(D.IMG[i].kind==='re'?'tái tạo giao diện':'vẽ minh hoạ')+'</span><i>›</i></a>'}).join('')+'</div>'}
function safety(){return head('An toàn & khi nào ra tiệm','#/')+SAFE+'<div class="card part"><b>🏪 Nên mang ra tiệm khi:</b><ul><li>Máy đổ nước, cà phê (tắt ngay, rút sạc)</li><li>Pin phồng, vỏ máy cong</li><li>Có mùi khét, khói, tia lửa, tiếng nổ</li><li>Ổ cứng kêu lạch cạch, cần cứu dữ liệu</li><li>Cần mở vỏ: thay màn hình, bàn phím, RAM, SSD, vệ sinh tra keo</li><li>Bộ nguồn máy bàn (có tụ điện áp cao — không tự mở)</li><li>Cài Windows mới bằng USB, chia ổ đĩa</li></ul></div><div class="card part"><b>🔐 An toàn thông tin</b><ul><li>Không đưa mã OTP, mã QR đăng nhập cho bất kỳ ai, kể cả người xưng là nhân viên ngân hàng/nhà mạng</li><li>Không cài phần mềm điều khiển từ xa (UltraViewer, TeamViewer, AnyDesk) theo yêu cầu người lạ</li><li>Không dùng phần mềm crack</li><li>Mang máy ra tiệm: đăng xuất ngân hàng, sao lưu, chỉ đưa mật khẩu Windows khi cần</li></ul></div><div class="card part"><b>Cháy, chập điện</b><ul><li>Rút điện/ngắt CB, không tạt nước vào thiết bị đang có điện. Gọi <b>114</b>. Người bị điện giật: ngắt điện, gọi <b>115</b>.</li></ul></div>'}
function favv(){var f=favs().filter(function(i){return D.GM[i]});return head('Yêu thích','#/')+(f.length?'<div class="list">'+f.map(function(i){return '<a class="row" href="#/g/'+i+'"><span>'+esc(D.GM[i].title)+'</span><i>›</i></a>'}).join('')+'</div>':'<p class="muted">Chưa có mục nào. Bấm ☆ Lưu ở trang hướng dẫn.</p>')}
var IDX=null;function buildIdx(){IDX=[];D.A.forEach(function(a){var hw=isHow(a.cat);IDX.push({t:a.name,s:hw?'Chủ đề · Hướng dẫn cài đặt':'Chủ đề',h:'#/a/'+a.id,k:norm(a.name),how:hw});a.syms.forEach(function(s){IDX.push({t:a.name+' — '+s.name,s:hw?'Việc cần làm · Hướng dẫn cài đặt':'Triệu chứng',how:hw,h:hw?'#/g/'+s.fb:'#/d/'+a.id+'/'+s.id,k:norm(a.name+' '+s.name+' '+s.qs.map(function(q){return q.q}).join(' '))})})});
 D.G.forEach(function(g){IDX.push({t:g.title,how:g.kind==='how',s:g.kind==='how'?'Hướng dẫn cài đặt':g.pro?'Sửa lỗi · '+D.CALL:'Sửa lỗi',h:'#/g/'+g.id,k:norm(g.title+' '+(g.muc||'')+' '+(g.verify||[]).join(' ')+' '+(g.loi||[]).map(function(l){return l[0]}).join(' ')+' '+(g.kind==='how'?'huong dan cai dat ket noi cach':'')+' '+(g.sym||[]).join(' ')+' '+(g.cause||[]).join(' ')+' '+g.tools.join(' ')+' '+(g.pro?'tiem':'tu lam')+' '+g.parts.map(function(p){return p.name}).join(' ')+' '+g.steps.map(function(s){return s.t}).join(' '))})});
 D.TOOLS.forEach(function(t){IDX.push({t:t.name,s:'Phím tắt',h:'#/tools',k:norm(t.name+' '+t.desc)})});D.PARTS.forEach(function(p){IDX.push({t:p.name,s:'Thuật ngữ',h:'#/parts',k:norm(p.name+' '+p.desc)})})}
function search(q){if(!IDX)buildIdx();var qn=norm(q).replace(/[^a-z0-9]+/g,' ').trim(),w=qn.split(' ').filter(Boolean);if(!w.length)return [];
 function toks(s){return s.replace(/[^a-z0-9]+/g,' ').trim().split(' ')}
 function hit(tk,t){for(var i=0;i<tk.length;i++){if(tk[i]===t||(t.length>=3&&tk[i].indexOf(t)===0))return true}return false}
 return IDX.map(function(x){if(!x.tk){x.nt=toks(norm(x.t)).join(' ');x.tt=x.nt.split(' ');x.tk=toks(x.k).concat(x.tt)}var sc=0,inT=0;
  for(var i=0;i<w.length;i++){var ht=hit(x.tt,w[i]);if(!ht&&!hit(x.tk,w[i]))return null;if(ht){sc+=3;inT++}else sc+=1}
  if(inT===w.length)sc+=10;if(w.length>1&&(' '+x.nt+' ').indexOf(' '+qn+' ')>=0)sc+=20;else if(w.length>1&&(' '+x.k.replace(/[^a-z0-9]+/g,' ')+' ').indexOf(' '+qn+' ')<0&&inT<w.length)return null;
  return {x:x,sc:sc}}).filter(Boolean).sort(function(a,b){return b.sc-a.sc}).map(function(o){return o.x})}
window.doSearch=search;
function searchv(q,k){k=k||'';var r=search(q).filter(function(x){return !k||(k==='hd'?!!x.how:!x.how)});return head('Tìm kiếm','#/')+'<form class="sbar" onsubmit="location.hash=\'#/search/\'+encodeURIComponent(this.q.value);return false"><input name="q" type="search" value="'+esc(q)+'" autofocus><button>Tìm</button></form>'+ltabs(k,function(x){return (x?'#/sk/'+x+'/':'#/search/')+encodeURIComponent(q)})+'<p class="muted" id="scount">'+r.length+' kết quả</p><div class="list">'+r.slice(0,60).map(function(x){return '<a class="row" href="'+x.h+'"><span>'+esc(x.t)+'<small>'+esc(x.s)+'</small></span><i>›</i></a>'}).join('')+'</div>'}
function nf(){return head('Không tìm thấy','#/')+'<p>Trang không tồn tại.</p>'}
function route(){var p=(location.hash.slice(2)||'').split('/').map(decodeURIComponent),h;
 switch(p[0]){case'a':h=appl(p[1]);break;case'd':h=diag(p[1],p[2],p[3]);break;case'g':h=guide(p[1]);break;case'tools':h=tools();break;case'parts':h=parts();break;case'maint':h=maint();break;case'fav':h=favv();break;case'search':h=searchv(p.slice(1).join('/'));break;case'sk':h=searchv(p.slice(2).join('/'),p[1]);break;case'loai':h=home(p[1]==='hd'||p[1]==='sua'?p[1]:'');break;case'safety':h=safety();break;case'credits':h=credits();break;case'ai':h=window.AIView?window.AIView():'';break;default:h=home()}
 V.innerHTML=h;window.scrollTo(0,0);document.querySelectorAll('.tabbar a').forEach(function(a){a.classList.toggle('on',(a.getAttribute('href')||'#/')==='#/'+(p[0]||''))});if(p[0]==='ai'&&window.AIInit)window.AIInit()}
window.addEventListener('hashchange',route);
// Giao diện sáng/tối
var TK='stsmt.theme';function applyTheme(t){document.documentElement.dataset.theme=t}
applyTheme(localStorage.getItem(TK)||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
$('#themeBtn').onclick=function(){var t=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(t);localStorage.setItem(TK,t)};
route();
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
