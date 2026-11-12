const $=s=>document.querySelector(s);
const WORDS="и в не на я быть он с что а по это она этот к но они мы как из у который то за свой весь год от так о для ты же все мочь человек такой его только или ещё бы себя один уже до время если сам когда вот наш мир где дело есть ваш даже другой жизнь первый день рука работа слово место лицо друг глаз вопрос дом сторона страна мой после новый должен город очень ничто под тот большой думать знать говорить идти делать стать видеть хотеть через ночь вода книга ветер огонь свет путь сила голос песня звезда море гора лес письмо окно дорога правда мысль сердце тишина скорость клавиша пальцы ритм точность".split(" ");
const scr={home:$('#home'),test:$('#test'),res:$('#res')};
const inner=$('#inner'),words=$('#words'),inp=$('#inp'),ov=$('#ov'),cn=$('#cn'),ring=$('#ring');
let dur=60,text='',chars=[],len=0,running=false,t0=0,iv=null,cd=null,keys=0,wrong=0,lh=40;
const store={get(k){try{return+localStorage.getItem(k)||0}catch(e){return 0}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function showScr(n){for(const k in scr)scr[k].classList.toggle('on',k===n);window.scrollTo(0,0)}

document.querySelectorAll('.split').forEach((r,ri)=>{const t=r.textContent;r.textContent='';[...t].forEach((c,i)=>{const s=document.createElement('span');s.className='l';s.textContent=c;s.style.setProperty('--i',i+ri*4);r.appendChild(s)})});
document.addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mx',e.clientX+'px');document.documentElement.style.setProperty('--my',e.clientY+'px')});
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),z=Math.max(r.width,r.height)*2,s=document.createElement('span');s.className='rp';s.style.cssText='width:'+z+'px;height:'+z+'px;left:'+(e.clientX-r.left-z/2)+'px;top:'+(e.clientY-r.top-z/2)+'px';b.appendChild(s);setTimeout(()=>s.remove(),700)});

function renderBest(){document.querySelectorAll('.mode').forEach(m=>{const b=store.get('jt'+m.dataset.t);m.querySelector('small').textContent=b?'рекорд: '+b:'рекорда нет'})}
renderBest();
document.querySelectorAll('.mode').forEach(m=>m.addEventListener('click',()=>{dur=+m.dataset.t;document.querySelectorAll('.mode').forEach(x=>{x.classList.remove('sel','pop')});m.classList.add('sel');void m.offsetWidth;m.classList.add('pop')}));

function addWords(n){let s='',last='';for(let i=0;i<n;i++){let w;do{w=WORDS[Math.random()*WORDS.length|0]}while(w===last);last=w;s+=((text||s)?' ':'')+w}for(const c of s){const sp=document.createElement('span');sp.textContent=c;inner.appendChild(sp);chars.push(sp)}text+=s}
function prepare(){inner.innerHTML='';chars=[];text='';len=0;keys=0;wrong=0;inp.value='';addWords(70);chars[0].classList.add('cur');inner.style.transform='none';$('#tm').textContent=dur;$('#tm').classList.remove('low');$('#bar').style.transform='scaleX(1)';$('#lw').textContent='0';$('#la').textContent='100%';$('#test').classList.remove('live');lh=parseFloat(getComputedStyle(words).lineHeight)||40}
function stats(sec){const v=inp.value;let ok=0;for(let i=0;i<v.length;i++)if(v[i]===text[i])ok++;return{ok,n:v.length,wpm:sec>0?Math.round(ok/5/(sec/60)):0,acc:keys?Math.round((keys-wrong)/keys*100):100}}
function update(){const v=inp.value,n=v.length;for(let i=len;i<n;i++){keys++;if(v[i]!==text[i])wrong++}
 const lo=Math.min(len,n),hi=Math.max(len,n);
 for(let i=lo;i<=hi&&i<chars.length;i++)chars[i].className=i<n?(v[i]===text[i]?'ok':'bad'):'';
 len=n;if(n>text.length-50)addWords(40);
 const c=chars[n];if(c){c.classList.add('cur');inner.style.transform='translateY('+(-Math.max(0,c.offsetTop-lh))+'px)'}}
inp.addEventListener('input',()=>{if(!running){inp.value='';return}update()});
inp.addEventListener('paste',e=>e.preventDefault());
words.addEventListener('click',()=>inp.focus());

function tick(){const el=(performance.now()-t0)/1000,left=Math.max(0,dur-el);$('#tm').textContent=Math.ceil(left);$('#tm').classList.toggle('low',left<=5);$('#bar').style.transform='scaleX('+left/dur+')';const s=stats(Math.max(el,2));$('#lw').textContent=el<2?0:s.wpm;$('#la').textContent=s.acc+'%';if(left<=0)finish()}
function begin(){running=true;t0=performance.now();$('#test').classList.add('live');iv=setInterval(tick,100);inp.focus()}
function count(el,to){const s=performance.now();(function f(t){const p=Math.min(1,(t-s)/1000);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s);requestAnimationFrame(function f(t){})}
function finish(){clearInterval(iv);running=false;inp.blur();const s=stats(dur),k='jt'+dur,old=store.get(k),isNew=s.wpm>old&&s.wpm>0;if(isNew)store.set(k,s.wpm);
 const rank=s.wpm<20?'Новичок':s.wpm<40?'Уверенный':s.wpm<60?'Быстрый':s.wpm<80?'Скоростной':'Легенда';
 $('#rk').textContent=rank+' · '+dur+' сек';$('#ra').textContent=s.acc+'%';$('#rc').textContent=s.n;$('#re').textContent=wrong;$('#rb').textContent=Math.max(old,s.wpm);
 $('#nr').classList.toggle('on',isNew);showScr('res');$('#rw').textContent='0';requestAnimationFrame(()=>{const st=performance.now(),to=s.wpm;(function f(t){const p=Math.min(1,(t-st)/1000);$('#rw').textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(st)});renderBest()}
function reset(){clearInterval(iv);clearInterval(cd);running=false;ov.classList.remove('on');inp.blur()}
function flash(n){cn.textContent=n;[cn,ring].forEach(e=>{e.classList.remove('a');void e.offsetWidth;e.classList.add('a')})}
function run(){reset();inp.focus();showScr('test');prepare();ov.classList.add('on');let n=3;flash(n);cd=setInterval(()=>{n--;if(n>0)flash(n);else{clearInterval(cd);ov.classList.remove('on');begin()}},850)}
function home(){reset();showScr('home')}
$('#start').addEventListener('click',run);
$('#again').addEventListener('click',run);
$('#change').addEventListener('click',home);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!scr.home.classList.contains('on'))home();else if(e.key==='Enter'&&scr.res.classList.contains('on'))run();else if(e.key==='Tab'&&scr.test.classList.contains('on'))e.preventDefault()});