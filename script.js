const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const video=$("#introVideo"), music=$("#bgMusic");
video.src="media/intro.mp4"; music.src="media/music.mp3";
let musicOn=false, selected=0, history=JSON.parse(localStorage.getItem("badakHistory")||"[]");
let profile=JSON.parse(localStorage.getItem("badakProfile")||'{"name":"BADAK USER","photo":""}');
const intro=$("#intro"), app=$("#app");

function enterApp(){intro.style.display="none";app.classList.remove("hidden");renderHistory();updateStats()}
let start=performance.now(), duration=15000;
function introTick(now){let p=Math.min((now-start)/duration,1);$("#introProgress").style.width=(p*100)+"%";if(p>=1) enterApp();else requestAnimationFrame(introTick)}
requestAnimationFrame(introTick);
$("#skipBtn").onclick=()=>enterApp();
$("#musicBtn").onclick=async()=>{musicOn=!musicOn;$("#musicBtn").textContent=musicOn?"🔊":"🔇";if(musicOn){try{await music.play()}catch(e){toast("Tekan tombol musik lagi jika browser memblokir autoplay.")}}else music.pause()};

function nav(page){$$(".page").forEach(p=>p.classList.toggle("active",p.id===page));$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));$("#sideMenu").classList.remove("open");$("#backdrop").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-page]").forEach(b=>b.onclick=()=>nav(b.dataset.page));
$("#menuBtn").onclick=()=>{$("#sideMenu").classList.add("open");$("#backdrop").classList.add("open")};
$("#closeMenu").onclick=$("#backdrop").onclick=()=>{$("#sideMenu").classList.remove("open");$("#backdrop").classList.remove("open")};
$("#profileQuick").onclick=()=>nav("profile");

function clock(){let d=new Date();$("#clock").textContent=d.toLocaleTimeString("id-ID");$("#date").textContent=d.toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}setInterval(clock,1000);clock();

$$(".badakGrid button").forEach(b=>b.onclick=()=>{$$(".badakGrid button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=+b.dataset.count});
$("#confirmBtn").onclick=()=>{
 const number=$("#numberInput").value.replace(/\D/g,"");
 if(number.length<8)return toast("Masukkan nomor yang valid terlebih dahulu.");
 if(!selected)return toast("Silahkan pilih salah satu jumlah Badak.");
 $("#successBox").classList.add("hidden");$("#processBox").classList.remove("hidden");$("#confirmBtn").disabled=true;
 let p=0;$("#processProgress").style.width="0%";$("#percent").textContent="0%";
 const timer=setInterval(()=>{p+=2;$("#processProgress").style.width=p+"%";$("#percent").textContent=p+"%";if(p>=100){clearInterval(timer);finishProcess(number,true)}},55);
};
function finishProcess(number,success){$("#processBox").classList.add("hidden");$("#successBox").classList.remove("hidden");$("#confirmBtn").disabled=false;
 history.unshift({number,count:selected,status:success?"SUKSES":"GAGAL",time:new Date().toLocaleString("id-ID")});history=history.slice(0,50);localStorage.setItem("badakHistory",JSON.stringify(history));renderHistory();updateStats();toast("BADAK SUKSES ✅")}

function updateStats(){let s=history.filter(x=>x.status==="SUKSES").length,f=history.filter(x=>x.status==="GAGAL").length;$("#successCount").textContent=s;$("#failCount").textContent=f;$("#totalCount").textContent=history.length;$("#hSuccess").textContent=s;$("#hFail").textContent=f;$("#hTotal").textContent=history.length}
function renderHistory(){let box=$("#historyList");if(!history.length){box.innerHTML='<div class="empty">Belum ada riwayat Badak.</div>';updateStats();return}box.innerHTML=history.map(x=>`<div class="historyItem"><b>${x.status==="SUKSES"?"✅":"❌"} ${x.count} BADAK — ${x.status}</b><div>Nomor: ${x.number}</div><small>${x.time}</small></div>`).join("");updateStats()}
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}

function saveProfile(){localStorage.setItem("badakProfile",JSON.stringify(profile));$("#profileName").textContent=profile.name;let b=$("#photoBtn");b.innerHTML=profile.photo?`<img src="${profile.photo}">`:"👤";b.appendChild($("#photoInput"))}
$("#changeName").onclick=()=>{let n=prompt("Masukkan nama baru:",profile.name);if(n&&n.trim()){profile.name=n.trim();saveProfile();toast("Nama berhasil diubah.")}};
$("#changePhoto").onclick=()=>$("#photoInput").click();
$("#photoBtn").onclick=(e)=>{if(e.target!==$("#photoInput"))$("#photoInput").click()};
$("#photoInput").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{profile.photo=r.result;saveProfile();toast("Foto profil berhasil diubah.")};r.readAsDataURL(f)};
$("#loginDetailBtn").onclick=()=>alert("DETAIL LOGIN\n\nAkun: "+profile.name+"\nStatus: Aktif\nVersi: BADAK APPS V3");
function logout(){if(confirm("Yakin ingin logout?")){toast("Logout demo berhasil.");setTimeout(()=>location.reload(),700)}}$("#logoutBtn").onclick=logout;$("#logoutProfile").onclick=logout;saveProfile();

$$(".gameTab").forEach(b=>b.onclick=()=>{$$(".gameTab").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#ludoGame").classList.toggle("hidden",b.dataset.game!=="ludo");$("#chessGame").classList.toggle("hidden",b.dataset.game!=="chess")});

// Ludo local demo
const lb=$("#ludoBoard");for(let i=0;i<81;i++){let d=document.createElement("div");if([0,8,72,80].includes(i)){d.textContent="🏠";d.className="home"}if(i%10===0)d.classList.add("safe");lb.appendChild(d)}
let turn=1;$("#diceBtn").onclick=()=>{let n=Math.floor(Math.random()*6)+1;$("#diceVal").textContent=n;turn=turn%4+1;$("#ludoStatus").textContent="Giliran Pemain "+turn};$("#resetLudo").onclick=()=>{turn=1;$("#diceVal").textContent="-";$("#ludoStatus").textContent="Giliran Pemain 1"};

// Chess local 2-player
const pieces={0:"♜",1:"♞",2:"♝",3:"♛",4:"♚",5:"♝",6:"♞",7:"♜",8:"♟",9:"♟",10:"♟",11:"♟",12:"♟",13:"♟",14:"♟",15:"♟",48:"♙",49:"♙",50:"♙",51:"♙",52:"♙",53:"♙",54:"♙",55:"♙",56:"♖",57:"♘",58:"♗",59:"♕",60:"♔",61:"♗",62:"♘",63:"♖"};
let board=Array(64).fill("");Object.entries(pieces).forEach(([i,p])=>board[+i]=p);let selectedSq=-1,chessTurn="white";
function drawChess(){let b=$("#chessBoard");b.innerHTML="";board.forEach((p,i)=>{let s=document.createElement("div");s.className="chessSquare "+((Math.floor(i/8)+i)%2?"dark":"light");s.textContent=p;s.onclick=()=>chessClick(i);if(i===selectedSq)s.classList.add("sel");b.appendChild(s)})}
function chessClick(i){if(selectedSq<0){if(board[i]){selectedSq=i;drawChess()}}else{if(i!==selectedSq){board[i]=board[selectedSq];board[selectedSq]="";chessTurn=chessTurn==="white"?"black":"white";toast("Giliran "+(chessTurn==="white"?"Putih":"Hitam"))}selectedSq=-1;drawChess()}}
$("#resetChess").onclick=()=>{board=Array(64).fill("");Object.entries(pieces).forEach(([i,p])=>board[+i]=p);selectedSq=-1;chessTurn="white";drawChess()};drawChess();
