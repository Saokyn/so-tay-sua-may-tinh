/* Hỏi AI v3 — chỉ gọi API khi người dùng bấm gửi; key lưu trong localStorage của máy này */
(function(){
"use strict";
var SYS='Bạn là trợ lý sửa máy tính cho người mới tại Việt Nam. LUÔN trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, theo từng bước đánh số, tránh thuật ngữ khó (nếu dùng thì giải thích).\nPhạm vi: máy tính/laptop Windows (ưu tiên Windows 11, ghi chú nếu Windows 10 khác), máy in, máy chiếu/TV, Bluetooth, webcam, USB, điện thoại, Wi-Fi/router, Office, trình duyệt, Zalo, Zoom/Meet/Teams, sao lưu, cài lại Windows.\nQUY TẮC:\n- Luôn nhắc sao lưu dữ liệu trước các thao tác có thể mất dữ liệu (format, reset, chkdsk sửa lỗi).\n- Cuối câu trả lời ghi rõ: "Tự làm được" hoặc "Nên mang ra tiệm".\n- Nên mang ra tiệm: mở vỏ máy, bộ nguồn, bo mạch, đổ nước, pin phồng, ổ cứng kêu, cứu dữ liệu, cài Windows bằng USB.\n- Pin phồng, mùi khét, khói: bảo ngưng dùng, rút sạc ngay.\n- Không hướng dẫn crack, bẻ khoá bản quyền, vượt mật khẩu tài khoản người khác.\n- Cảnh báo lừa đảo: không đưa OTP, không cài phần mềm điều khiển từ xa theo yêu cầu người lạ.\n- Không bịa tên menu hay lệnh; nếu không chắc, nói rõ.';
var K='stsmt.ai',HK='stsmt.aichat';
/* "Grok có sẵn": bản Grok Build có route máy chủ /api/sotay-ai giữ key của nền tảng (XAI_API_KEY).
   Key không bao giờ tới trình duyệt. Bản offline/zip không có route này -> người dùng tự nhập key. */
var PROXY=new URL('/api/sotay-ai',location.href).href;
var BUILTIN=false; // bản tĩnh (GitHub Pages) không có máy chủ: luôn dùng key người dùng tự nhập // null = chưa dò, true/false = đã dò
function probe(){if(BUILTIN!==null)return Promise.resolve(BUILTIN);return fetch(PROXY,{method:'GET',cache:'no-store'}).then(function(r){return r.ok?r.json():{available:false}}).then(function(j){BUILTIN=!!(j&&j.available===true);return BUILTIN},function(){BUILTIN=false;return false})}
/* Danh sách model đã đối chiếu tài liệu chính thức 30/10/2026 */
var PRE={
 grok:{n:'Grok (xAI)',b:'https://api.x.ai/v1',m:['grok-4.7','grok-4.3','grok-4.20-0309-non-reasoning','grok-4.20-0309-reasoning','grok-build-0.1'],keyUrl:'https://console.x.ai'},
 gemini:{n:'Gemini (Google)',b:'https://generativelanguage.googleapis.com/v1beta/openai',m:['gemini-3.8-flash','gemini-4-argon','gemini-3.6-flash','gemini-3.5-flash-lite','gemini-2.5-flash'],keyUrl:'https://aistudio.google.com/apikey'},
 custom:{n:'Tùy chỉnh',b:'',m:[]}
};
var VEND={
 deepseek:{n:'DeepSeek',b:'https://api.deepseek.com',m:['deepseek-flash','deepseek-v4-pro']},
 openrouter:{n:'OpenRouter',b:'https://openrouter.ai/api/v1',m:['openrouter/auto','x-ai/grok-4.7','google/gemini-3.8-flash']},
 groq:{n:'Groq',b:'https://api.groq.com/openai/v1',m:['openai/gpt-oss-120b','llama-3.3-70b-versatile','llama-3.1-8b-instant']},
 mistral:{n:'Mistral',b:'https://api.mistral.ai/v1',m:['mistral-large-latest','mistral-medium-latest','mistral-small-latest']},
 together:{n:'Together AI',b:'https://api.together.xyz/v1',m:['meta-llama/Llama-3.3-70B-Instruct-Turbo','openai/gpt-oss-120b']},
 dashscope:{n:'Qwen (DashScope quốc tế)',b:'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',m:['qwen3.8-max','qwen3.7-plus','qwen3.8-flash']},
 other:{n:'Khác (tự nhập URL)',b:'',m:[]}
};
var SUG=['Máy tính chạy rất chậm','Màn hình xanh CRITICAL_PROCESS_DIED','Không chiếu được lên TV qua HDMI','Máy in báo lỗi, không in','Wi-Fi có nhưng không vào được web','Zoom không nghe được tiếng']; 

function load(){var c={};try{c=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(e){}
 if(!PRE[c.p])c.p='grok';
 if(c.p==='custom'&&!VEND[c.v])c.v='other';
 if(c.p!=='custom'){c.b=PRE[c.p].b;if(!c.m)c.m=PRE[c.p].m[0]}
 return c}
function save(c){localStorage.setItem(K,JSON.stringify(c))}

/* Chuẩn hóa base URL: bỏ "/" cuối, nhận cả khi dán nguyên endpoint */
function normBase(u){u=String(u||'').trim();if(!u)return '';
 if(!/^https?:\/\//i.test(u))u='https://'+u;
 u=u.replace(/[?#].*$/,'').replace(/\/+$/,'');
 u=u.replace(/\/(chat\/completions|completions|models|responses)$/i,'');
 u=u.replace(/\/+$/,'');
 // chỉ có tên miền -> thêm /v1 (trừ các hãng đặc thù đã có đường dẫn riêng)
 try{var x=new URL(u);if(x.pathname===''||x.pathname==='/'){if(!/api\.deepseek\.com$/i.test(x.hostname))u=x.origin+'/v1';else u=x.origin}}catch(e){}
 return u}
function endpoint(base,kind){return normBase(base)+(kind==='models'?'/models':'/chat/completions')}
function keyOf(c){var k=(c.k||'').trim();if(k)return {k:k,src:'user'};if(c.p==='grok'&&BUILTIN)return {k:'',src:'builtin'};return {k:'',src:'none'}}
function baseOf(c){if(c.p==='custom')return normBase(c.b||(VEND[c.v]||{}).b);return PRE[c.p].b}

function friendly(st,body,base){var d='';try{var j=JSON.parse(body);d=(j.error&&(j.error.message||j.error))||j.message||''}catch(e){d=String(body||'').slice(0,160)}
 if(typeof d!=='string')d=JSON.stringify(d);
 var m;
 if(st===400&&/model/i.test(d))m='Model không hợp lệ hoặc không có quyền dùng. Bấm "Tải danh sách model" để chọn model đúng.';
 else if(st===400)m='Yêu cầu không hợp lệ (400).';
 else if(st===401)m='Key API sai hoặc đã hết hạn (401). Kiểm tra lại key, chú ý không thừa dấu cách.';
 else if(st===403)m='Key không có quyền truy cập (403). Có thể tài khoản chưa bật thanh toán hoặc model bị giới hạn vùng.';
 else if(st===404)m='Không tìm thấy địa chỉ hoặc model (404). Kiểm tra Base URL ('+base+') và tên model; thử bấm "Tải danh sách model".';
 else if(st===429)m='Đã vượt giới hạn gọi hoặc hết hạn mức/tín dụng (429). Chờ một lúc rồi thử lại, hoặc kiểm tra số dư tài khoản.';
 else if(st>=500)m='Máy chủ AI đang lỗi ('+st+'). Thử lại sau ít phút.';
 else m='Lỗi '+st+'.';
 return m+(d?'\nChi tiết: '+d:'')}
function netErr(e){return 'Không kết nối được tới máy chủ AI. Kiểm tra mạng (Hỏi AI cần Internet), hoặc Base URL sai/không cho phép gọi từ trình duyệt (CORS).'+(e&&e.message?'\nChi tiết: '+e.message:'')}

function req(c,kind,body){var kk=keyOf(c),b=baseOf(c);
 if(kk.src==='builtin'){var pb=kind==='models'?{op:'models'}:{op:'chat',model:body.model,messages:body.messages};
  return fetch(PROXY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(pb)}).then(function(r){return r.text().then(function(t){if(r.status===503){BUILTIN=false;throw {msg:'Grok có sẵn hiện không dùng được trên máy chủ này. Mở "Cài đặt AI" và nhập key của bạn.',status:503}}if(!r.ok)throw {msg:friendly(r.status,t,'Grok có sẵn'),status:r.status};try{return JSON.parse(t)}catch(e){throw {msg:'Máy chủ trả về dữ liệu không đọc được.'}}})},function(e){throw {msg:netErr(e)}})}
 if(!b)return Promise.reject({msg:'Chưa có Base URL. Chọn hãng trong danh sách hoặc nhập URL.'});
 if(!kk.k)return Promise.reject({msg:'Chưa có key API. Mở "Cài đặt AI" để nhập key.'});
 var o={method:kind==='models'?'GET':'POST',headers:{'Authorization':'Bearer '+kk.k}};
 if(body){o.headers['Content-Type']='application/json';o.body=JSON.stringify(body)}
 return fetch(endpoint(b,kind),o).then(function(r){return r.text().then(function(t){if(!r.ok)throw {msg:friendly(r.status,t,b),status:r.status};try{return JSON.parse(t)}catch(e){throw {msg:'Máy chủ trả về dữ liệu không đọc được.'}}})},function(e){throw {msg:netErr(e)}})}
function listModels(c){return req(c,'models').then(function(j){var a=(j.data||j.models||[]).map(function(x){return typeof x==='string'?x:(x.id||x.name||'')}).filter(Boolean).map(function(x){return x.replace(/^models\//,'')});
 if(c.p==='gemini')a=a.filter(function(x){return /^gemini/.test(x)&&!/(embedding|tts|image|live|transcribe|aqa)/.test(x)});
 if(c.p==='grok')a=a.filter(function(x){return !/(imagine|image|video|voice|embed)/.test(x)});
 return a.sort()})}
function chat(c,msgs){return req(c,'chat',{model:c.m,temperature:0.3,messages:[{role:'system',content:SYS}].concat(msgs.slice(-12))}).then(function(j){var t=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;if(Array.isArray(t))t=t.map(function(x){return x.text||''}).join('');if(!t)throw {msg:'AI không trả lời nội dung nào. Thử lại hoặc đổi model.'};return t})}

/* Markdown an toàn: escape trước rồi mới định dạng, không cho HTML/URL javascript: */
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
function inl(s){return s.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g,'$1<i>$2</i>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')}
function md(src){var L=esc(src).split(/\r?\n/),o=[],lst=null,code=false,cb=[];
 function close(){if(lst){o.push('</'+lst+'>');lst=null}}
 L.forEach(function(l){
  if(/^```/.test(l)){if(code){o.push('<pre><code>'+cb.join('\n')+'</code></pre>');cb=[];code=false}else{close();code=true}return}
  if(code){cb.push(l);return}
  var m;
  if(m=l.match(/^\s*#{1,6}\s+(.*)/)){close();o.push('<h4>'+inl(m[1])+'</h4>');return}
  if(m=l.match(/^\s*(\d+)[.)]\s+(.*)/)){if(lst!=='ol'){close();o.push('<ol>');lst='ol'}o.push('<li>'+inl(m[2])+'</li>');return}
  if(m=l.match(/^\s*[-*•]\s+(.*)/)){if(lst!=='ul'){close();o.push('<ul>');lst='ul'}o.push('<li>'+inl(m[1])+'</li>');return}
  if(/^\s*$/.test(l)){close();return}
  close();o.push('<p>'+inl(l)+'</p>')});
 if(code)o.push('<pre><code>'+cb.join('\n')+'</code></pre>');close();return o.join('')}

function hist(){try{return JSON.parse(sessionStorage.getItem(HK)||'[]')}catch(e){return []}}
function setHist(h){sessionStorage.setItem(HK,JSON.stringify(h.slice(-40)))}

var BOT='<span class="av" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg></span>';
function bubble(r,t,i){if(r==='user')return '<div class="msg me"><div class="bub">'+esc(t).replace(/\n/g,'<br>')+'</div></div>';
 return '<div class="msg bot'+(r==='err'?' err':'')+'">'+BOT+'<div class="bub">'+(r==='err'?esc(t).replace(/\n/g,'<br>'):md(t))+(r==='assistant'?'<button class="cp" data-i="'+i+'" aria-label="Sao chép">📋 Sao chép</button>':'')+'</div></div>'}

function provName(c){return c.p==='custom'?(VEND[c.v]||VEND.other).n:PRE[c.p].n}
function models(c){return c.p==='custom'?(VEND[c.v]||{m:[]}).m:PRE[c.p].m}

window.AIView=function(){var c=load();return '<section class="aiw">'+
 '<div class="aihd">'+BOT+'<div class="aiti"><b>Trợ lý sửa máy tính</b><small id="aiSt"></small></div>'+
 '<button class="ib" id="aiClr" title="Xóa cuộc trò chuyện" aria-label="Xóa cuộc trò chuyện">🗑</button>'+
 '<button class="ib" id="aiSet" title="Cài đặt AI" aria-label="Cài đặt AI" aria-expanded="false">⚙</button></div>'+
 '<div class="aisafe">⚠️ AI có thể sai. Sao lưu trước khi làm; việc phải mở máy hãy mang ra tiệm. Cần Internet.</div>'+
 '<div id="chat" class="chat" aria-live="polite"></div>'+
 '<div id="aiSug" class="sug"></div>'+
 '<form id="aiF" class="aiin"><textarea id="aiQ" rows="1" placeholder="Mô tả máy và triệu chứng…" aria-label="Câu hỏi"></textarea><button class="send" aria-label="Gửi">➤</button></form>'+
 '</section>'+
 '<div class="shbg" id="aiBg" hidden></div><div class="sheet" id="aiSh" role="dialog" aria-label="Cài đặt AI" aria-hidden="true"><div class="grab"></div>'+
 '<h3>Cài đặt AI</h3>'+
 '<label>Nhà cung cấp</label><div class="seg" id="aiP">'+Object.keys(PRE).map(function(k){return '<button type="button" data-p="'+k+'">'+(k==='grok'?'Grok <small>có sẵn</small>':PRE[k].n)+'</button>'}).join('')+'</div>'+
 '<div id="aiCus"><label for="aiV">Hãng (tự điền URL &amp; model)</label><select id="aiV">'+Object.keys(VEND).map(function(k){return '<option value="'+k+'">'+VEND[k].n+'</option>'}).join('')+'</select>'+
 '<label for="aiB">Base URL</label><input id="aiB" inputmode="url" placeholder="https://…/v1" autocomplete="off"><small class="hint" id="aiBn"></small>'+
 '<small class="hint">Anthropic (Claude) không dùng chuẩn OpenAI nên không hỗ trợ trực tiếp; có thể dùng qua OpenRouter.</small></div>'+
 '<label>Model</label><div class="chips" id="aiMc"></div><input id="aiM" placeholder="hoặc gõ tên model" autocomplete="off">'+
 '<button type="button" class="btn2" id="aiLM">⟳ Tải danh sách model</button>'+
 '<label for="aiK">Key API</label><input id="aiK" type="password" autocomplete="off" placeholder="Dán key vào đây"><small class="hint" id="aiKn"></small>'+
 '<div class="row"><button type="button" class="btn" id="aiSave">Lưu</button><button type="button" class="btn2" id="aiTest">Kiểm tra kết nối</button><button type="button" class="btn2 dg" id="aiDel">Xóa key</button></div>'+
 '<div id="aiRes" class="hint"></div></div>'};

window.AIInit=function(){var $=function(s){return document.querySelector(s)};var c=load(),H=hist(),busy=false,fetched=null;
 var chatEl=$('#chat');
 function status(){var kk=keyOf(c);$('#aiSt').textContent=provName(c)+' · '+(c.m||'chưa chọn model')+(kk.src==='none'?' · chưa có key':kk.src==='builtin'?' · có sẵn, không cần key':'')}
 function render(){chatEl.innerHTML=H.length?H.map(function(m,i){return bubble(m.role,m.content,i)}).join(''):'<div class="hello">'+BOT+'<p>Xin chào! Hãy mô tả <b>tên máy</b>, <b>triệu chứng</b> và những gì bạn đã thử. Mình sẽ hướng dẫn từng bước an toàn.</p></div>';
  $('#aiSug').innerHTML=H.length?'':SUG.map(function(s){return '<button type="button" class="chip">'+esc(s)+'</button>'}).join('');
  chatEl.scrollTop=chatEl.scrollHeight;window.scrollTo(0,document.body.scrollHeight)}
 function fillSheet(){document.querySelectorAll('#aiP button').forEach(function(b){b.classList.toggle('on',b.dataset.p===c.p)});
  $('#aiCus').style.display=c.p==='custom'?'':'none';$('#aiV').value=c.v||'other';
  $('#aiB').value=c.p==='custom'?(c.b||(VEND[c.v]||{}).b||''):'';nb();
  $('#aiM').value=c.m||'';chips();
  $('#aiK').value=c.k||'';
  $('#aiKn').textContent=c.p==='grok'?(BUILTIN?'✅ Grok có sẵn: không cần key (dùng key của nền tảng, giữ ở máy chủ). Nhập key riêng nếu muốn dùng tài khoản của bạn.':'Bản này không có Grok dựng sẵn — nhập key từ console.x.ai.'):c.p==='gemini'?'Lấy key miễn phí tại aistudio.google.com/apikey':'';
  $('#aiRes').textContent=''}
 function nb(){var v=$('#aiB').value;$('#aiBn').textContent=v?'Sẽ gọi: '+endpoint(v,'chat'):''}
 function chips(){var list=fetched||models(c);$('#aiMc').innerHTML=list.map(function(m){return '<button type="button" class="chip'+(m===c.m?' on':'')+'" data-m="'+esc(m)+'">'+esc(m)+'</button>'}).join('')||'<small class="hint">Nhập tên model hoặc bấm Tải danh sách.</small>'}
 function readSheet(){if(c.p==='custom'){c.v=$('#aiV').value;c.b=normBase($('#aiB').value)}else c.b=PRE[c.p].b;c.m=$('#aiM').value.trim();c.k=$('#aiK').value.trim()}
 function open(o){$('#aiSh').classList.toggle('open',o);$('#aiSh').setAttribute('aria-hidden',!o);$('#aiBg').hidden=!o;$('#aiSet').setAttribute('aria-expanded',o);if(o)fillSheet()}
 $('#aiSet').onclick=function(){open(!$('#aiSh').classList.contains('open'))};$('#aiBg').onclick=function(){open(false)};
 $('#aiP').onclick=function(e){var b=e.target.closest('button');if(!b)return;readSheet();c.p=b.dataset.p;fetched=null;if(c.p!=='custom'){c.b=PRE[c.p].b;c.m=PRE[c.p].m[0]}else{c.v=c.v||'deepseek';var V=VEND[c.v];c.b=V.b;c.m=V.m[0]||''}c.k='';try{var old=JSON.parse(localStorage.getItem(K)||'{}');if(old.p===c.p)c.k=old.k||''}catch(_){}fillSheet()};
 $('#aiV').onchange=function(){var V=VEND[this.value];c.v=this.value;fetched=null;c.b=V.b;c.m=V.m[0]||'';$('#aiB').value=V.b;nb();$('#aiM').value=c.m;chips()};
 $('#aiB').oninput=nb;
 $('#aiMc').onclick=function(e){var b=e.target.closest('[data-m]');if(!b)return;c.m=b.dataset.m;$('#aiM').value=c.m;chips()};
 $('#aiSave').onclick=function(){readSheet();if(!c.m){$('#aiRes').textContent='Hãy chọn một model.';return}save(c);status();open(false);toastx('Đã lưu cài đặt AI')};
 $('#aiDel').onclick=function(){c.k='';$('#aiK').value='';var s=load();s.k='';save(s);status();toastx('Đã xóa key khỏi máy này')};
 $('#aiLM').onclick=function(){readSheet();var r=$('#aiRes');r.textContent='Đang tải danh sách model…';listModels(c).then(function(a){fetched=a.length?a:null;chips();r.textContent='Tìm thấy '+a.length+' model.'},function(e){r.textContent=e.msg})};
 $('#aiTest').onclick=function(){readSheet();var r=$('#aiRes');r.textContent='Đang kiểm tra…';listModels(c).then(function(a){var ok=!c.m||a.indexOf(c.m)>=0||!a.length;r.textContent=ok?'✅ Kết nối tốt'+(c.m?' · model "'+c.m+'" sẵn sàng':''):'⚠️ Key đúng nhưng không thấy model "'+c.m+'". Chọn model trong danh sách.';if(!ok){fetched=a;chips()}},function(e){if(e.status===404||e.status===405){chat(c,[{role:'user',content:'ping'}]).then(function(){r.textContent='✅ Kết nối tốt'},function(e2){r.textContent='❌ '+e2.msg})}else r.textContent='❌ '+e.msg})};
 $('#aiClr').onclick=function(){if(!H.length)return;if(!confirm('Xóa toàn bộ cuộc trò chuyện?'))return;H=[];setHist(H);render()};
 chatEl.onclick=function(e){var b=e.target.closest('.cp');if(!b)return;var t=(H[+b.dataset.i]||{}).content||'';var done=function(){b.textContent='✓ Đã chép';setTimeout(function(){b.textContent='📋 Sao chép'},1500)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,function(){fb(t);done()});else{fb(t);done()}};
 function fb(t){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
 $('#aiSug').onclick=function(e){var b=e.target.closest('.chip');if(!b)return;$('#aiQ').value=b.textContent;send()};
 var q=$('#aiQ');q.oninput=function(){q.style.height='auto';q.style.height=Math.min(q.scrollHeight,140)+'px'};
 q.onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send()}};
 $('#aiF').onsubmit=function(e){e.preventDefault();send()};
 function send(){var t=q.value.trim();if(!t||busy)return;
  if(BUILTIN===null&&c.p==='grok'&&!(c.k||'').trim()){probe().then(function(){status();send()});return}
  if(keyOf(c).src==='none'){open(true);$('#aiRes').textContent=c.p==='grok'?'Bản này không có Grok dựng sẵn. Nhập key API (console.x.ai) hoặc chọn nhà cung cấp khác.':'Nhập key API để bắt đầu.';return}
  H.push({role:'user',content:t});setHist(H);q.value='';q.oninput();render();busy=true;
  chatEl.insertAdjacentHTML('beforeend','<div class="msg bot typing" id="aiTy">'+BOT+'<div class="bub"><i></i><i></i><i></i></div></div>');chatEl.scrollTop=chatEl.scrollHeight;window.scrollTo(0,document.body.scrollHeight);
  chat(c,H.filter(function(m){return m.role!=='err'}).map(function(m){return {role:m.role,content:m.content}})).then(function(a){H.push({role:'assistant',content:a})},function(e){H.push({role:'err',content:e.msg||'Lỗi không xác định'})}).then(function(){busy=false;setHist(H);render()})}
 function toastx(m){if(window.toast)window.toast(m)}
 status();render();probe().then(function(){status();if($('#aiSh').classList.contains('open'))fillSheet()})};

window.AI_SYS=SYS;
window.AI_TEST={probe:probe,PROXY:function(){return PROXY},normBase:normBase,endpoint:endpoint,friendly:friendly,md:md,PRE:PRE,VEND:VEND,keyOf:keyOf,load:load,listModels:listModels,chat:chat};
})();
