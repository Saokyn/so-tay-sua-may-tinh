/* Minh hoạ SVG inline (dùng currentColor) — cùng cách làm với Sổ tay sửa đồ điện */
(function(){
var W=function(b){return '<svg viewBox="0 0 120 80" class="ill" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+b+'</svg>'};
var LAP='<rect x="26" y="12" width="68" height="44" rx="4"/><path d="M14 66h92l-6-10H20z"/>';
var I={
laptop:LAP,
power:'<path d="M60 14v26" class="ac"/><path d="M42 24a24 24 0 1 0 36 0"/>',
bsod:'<rect x="20" y="10" width="80" height="50" rx="4" class="ac"/><path d="M34 26h4M34 30c4-6 8-6 12 0M34 44h50M34 50h36"/><path d="M50 70h20M60 60v10"/>',
slow:'<path d="M20 64a40 40 0 0 1 80 0"/><path d="M60 64L38 40" class="ac"/><circle cx="60" cy="64" r="4"/>',
temp:'<path d="M52 12a8 8 0 0 1 16 0v38a14 14 0 1 1-16 0z"/><path d="M60 30v30" class="warnc"/><path d="M82 20h12M82 32h12M82 44h12"/>',
disk:'<rect x="24" y="12" width="72" height="56" rx="6"/><circle cx="60" cy="38" r="16" class="ac"/><circle cx="60" cy="38" r="3"/><path d="M84 58l-10-10"/>',
update:'<path d="M88 36a28 28 0 1 0-6 22"/><path d="M90 18v18H72" class="ac"/>',
virus:'<circle cx="60" cy="40" r="18" class="warnc"/><path d="M60 10v12M60 58v12M30 40h12M78 40h12M39 19l8 8M73 53l8 8M81 19l-8 8M47 53l-8 8"/>',
sound:'<path d="M20 30h14l18-14v48L34 50H20z" class="ac"/><path d="M66 28a16 16 0 0 1 0 24M76 20a28 28 0 0 1 0 40"/>',
wifi:'<path d="M20 32a56 56 0 0 1 80 0M32 44a38 38 0 0 1 56 0M44 56a20 20 0 0 1 32 0"/><circle cx="60" cy="66" r="4" class="ac"/>',
keyboard:'<rect x="10" y="18" width="100" height="44" rx="6"/><path d="M22 30h4M34 30h4M46 30h4M58 30h4M70 30h4M82 30h4M94 30h4M22 40h4M34 40h4M46 40h4M58 40h4M70 40h4M82 40h4M36 52h48" class="ac"/>',
battery:'<rect x="16" y="22" width="80" height="36" rx="6"/><path d="M96 34h8v12h-8"/><rect x="24" y="30" width="30" height="20" rx="2" class="ac"/>',
printer:'<rect x="34" y="8" width="52" height="22"/><rect x="14" y="30" width="92" height="30" rx="6"/><rect x="34" y="50" width="52" height="24" class="ac"/><circle cx="94" cy="40" r="3"/>',
hdmi:'<rect x="6" y="14" width="56" height="38" rx="3"/><path d="M62 33h20" class="ac"/><path d="M82 26h14l-3 14H85z"/><rect x="88" y="20" width="28" height="22" rx="2"/><path d="M26 64h16M34 52v12"/>',
monitor:'<rect x="6" y="14" width="50" height="34" rx="3"/><rect x="64" y="14" width="50" height="34" rx="3" class="ac"/><path d="M24 62h14M31 48v14M82 62h14M89 48v14"/>',
bt:'<path d="M46 26l28 26-14 12V16l14 12-28 26" class="ac"/>',
webcam:'<circle cx="60" cy="34" r="22"/><circle cx="60" cy="34" r="9" class="ac"/><path d="M44 70h32M60 56v14"/>',
usb:'<rect x="44" y="6" width="32" height="18"/><rect x="38" y="24" width="44" height="48" rx="6" class="ac"/><path d="M52 12h4M64 12h4"/>',
phone:'<rect x="40" y="6" width="40" height="68" rx="8"/><path d="M54 64h12"/><path d="M90 30c8 6 8 14 0 20M98 24c12 10 12 22 0 32" class="ac"/>',
router:'<rect x="14" y="44" width="92" height="24" rx="6"/><path d="M30 44V20M90 44V20" /><circle cx="30" cy="56" r="3" class="ac"/><circle cx="44" cy="56" r="3" class="ac"/><circle cx="58" cy="56" r="3" class="ac"/>',
dns:'<circle cx="60" cy="40" r="28"/><path d="M32 40h56M60 12c-14 16-14 40 0 56M60 12c14 16 14 40 0 56" class="ac"/>',
share:'<rect x="8" y="20" width="36" height="28" rx="3"/><rect x="76" y="20" width="36" height="28" rx="3"/><path d="M48 34h24M64 26l8 8-8 8" class="ac"/><path d="M18 60h16M86 60h16"/>',
office:'<rect x="30" y="8" width="60" height="64" rx="4"/><path d="M42 24h36M42 36h36M42 48h24" class="ac"/>',
browser:'<rect x="10" y="12" width="100" height="56" rx="6"/><path d="M10 26h100"/><circle cx="20" cy="19" r="2"/><circle cx="28" cy="19" r="2"/><rect x="40" y="16" width="60" height="6" rx="3" class="ac"/>',
chat:'<path d="M14 16h62a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H38l-14 12V56h-10a8 8 0 0 1-8-8V24a8 8 0 0 1 8-8z"/><path d="M24 32h44M24 42h28" class="ac"/>',
meet:'<rect x="10" y="20" width="68" height="44" rx="6"/><path d="M78 34l28-14v44L78 50" class="ac"/><circle cx="44" cy="38" r="8"/><path d="M30 58c4-8 24-8 28 0"/>',
backup:'<path d="M30 56a18 18 0 0 1 2-36 24 24 0 0 1 46 4 16 16 0 0 1 10 32"/><path d="M60 70V36M48 48l12-12 12 12" class="ac"/>',
warn:'<path d="M60 8l50 64H10z" class="warnc"/><path d="M60 30v18M60 58v2"/>',
shield:'<path d="M60 6l40 14v20c0 18-16 32-40 36-24-4-40-18-40-36V20z" class="ac"/><path d="M44 40l12 12 22-22"/>',
book:'<path d="M60 18c-12-8-30-8-44-4v52c14-4 32-4 44 4 12-8 30-8 44-4V14c-14-4-32-4-44 4z"/><path d="M60 18v52" class="ac"/>',
tools:'<path d="M20 64l36-36"/><path d="M56 28a14 14 0 1 1 18 18" class="ac"/><path d="M70 50l24 24"/>',
unplug:'<rect x="8" y="22" width="34" height="36" rx="6"/><circle cx="20" cy="40" r="3"/><circle cx="30" cy="40" r="3"/><path d="M62 40h20M70 28v8M70 44v8" class="ac"/><rect x="82" y="30" width="18" height="20" rx="4"/><path d="M100 40h14"/><path d="M48 30l8 20" class="warnc"/>',
click:'<path d="M44 14l40 30-18 4 12 22-8 4-12-22-14 12z" class="ac"/>',
settings:'<circle cx="60" cy="40" r="12" class="ac"/><path d="M60 8v10M60 62v10M28 40h10M82 40h10M37 17l7 7M76 56l7 7M83 17l-7 7M44 56l-7 7"/>',
clean:'<path d="M30 70l20-40h20l20 40z"/><path d="M60 30V8" class="ac"/><path d="M40 52h40"/>',
clock:'<circle cx="60" cy="40" r="30"/><path d="M60 22v18l12 8" class="ac"/>',
check:'<circle cx="60" cy="40" r="28" class="ac"/><path d="M46 40l10 10 18-18"/>',
store:'<path d="M14 30l8-18h76l8 18z" class="ac"/><path d="M20 30v38h80V30M48 68V46h24v22"/>'
};
window.SVG=function(k){return I[k]?W(I[k]):''};window.SVGKEYS=Object.keys(I);
})();
