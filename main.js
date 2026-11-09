const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,hover=matchMedia('(hover:hover)').matches;
const MAIL='Panafricanvisionfoundation@gmail.com';

/* toast */
const tEl=document.createElement('div');tEl.className='toast';document.body.append(tEl);let tT;
const toast=m=>{tEl.textContent=m;tEl.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>tEl.classList.remove('show'),2600)};

/* nav, progress, parallax, timeline */
const nav=$('#nav'),menu=$('#menu'),burger=$('#burger'),topBtn=$('#toTop'),bar=$('#progress');
const solidAlways=document.body.dataset.solid==='1';let lastY=0;
function onScroll(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('solid',solidAlways||y>60);
  nav.classList.toggle('hide',y>420&&y>lastY+4&&!menu.classList.contains('open'));
  lastY=y;bar.style.transform=`scaleX(${h>0?y/h:0})`;topBtn.classList.toggle('show',y>700);
  const hb=$('.hero-bg');if(hb&&!reduce&&y<innerHeight*1.3)hb.style.transform=`translate3d(0,${y*.22}px,0)`;
  const tl=$('.timeline');if(tl){const r=tl.getBoundingClientRect();tl.style.setProperty('--p',Math.min(1,Math.max(0,(innerHeight*.65-r.top)/r.height)))}
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.classList.toggle('open',o);document.body.classList.toggle('noscroll',o)});
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.classList.remove('open');document.body.classList.remove('noscroll')}));
topBtn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
$$('.js-year').forEach(e=>e.textContent=new Date().getFullYear());

/* headline word reveal */
function split(el){let i=0;(function walk(n){[...n.childNodes].forEach(c=>{
  if(c.nodeType===3){const f=document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}
      const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.textContent=t;s.style.transitionDelay=(i++*80)+'ms';w.append(s);f.append(w)});
    c.replaceWith(f)}
  else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})})(el)}
$$('.hero h1,.page-hero h1').forEach(h=>{split(h);setTimeout(()=>h.classList.add('go'),200)});

/* rotating tagline */
const rot=$('.rotator');
if(rot){const items=rot.dataset.items.split('|'),sp=document.createElement('span');rot.append(sp);let k=0;
  const next=()=>{sp.classList.remove('in');setTimeout(()=>{sp.textContent=items[k++%items.length];sp.classList.add('in')},380)};next();setInterval(next,3000)}

/* marquee */
$$('.track').forEach(t=>t.innerHTML+=t.innerHTML);

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.14});
$$('.reveal').forEach((el,i)=>{if(!el.matches('.feature,.t-item'))el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)});

/* counters */
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'';let n=0;
  const step=Math.max(1,Math.ceil(end/70)),t=setInterval(()=>{n=Math.min(end,n+step);el.textContent=n.toLocaleString()+(n===end?suf:'');if(n===end)clearInterval(t)},24);
  co.unobserve(el)}),{threshold:.6});
$$('[data-count]').forEach(el=>co.observe(el));

/* tilt cards + magnetic buttons */
if(hover&&!reduce){
  $$('.card,.way,.mini').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transition='transform .15s';el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-6px)`});
    el.addEventListener('mouseleave',()=>{el.style.transition='';el.style.transform=''})});
  $$('.btn').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.2}px)`});
    b.addEventListener('mouseleave',()=>b.style.transform='')})}

/* filters (projects + gallery) */
$$('.filters').forEach(f=>{const scope=f.parentElement;
  f.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    $$('button',f).forEach(x=>x.classList.toggle('on',x===b));
    $$('[data-cat]',scope).forEach(g=>{const ok=b.dataset.f==='all'||g.dataset.cat===b.dataset.f;g.style.display=ok?'':'none';if(ok)g.classList.add('show')})})});

/* gallery lightbox */
const lb=$('#lightbox');
if(lb){let list=[],i=0;const img=$('img',lb),cap=$('p',lb),cnt=$('.count',lb);
  const ok=g=>{const m=g.querySelector('img');return m&&m.complete&&m.naturalWidth>0&&g.style.display!=='none'};
  const render=()=>{const g=list[i];img.src=g.href;cap.textContent=g.dataset.cap;cnt.textContent=`${i+1} / ${list.length}`};
  const close=()=>{lb.classList.remove('open');document.body.classList.remove('noscroll')},step=d=>{i=(i+d+list.length)%list.length;render()};
  $$('.g-item').forEach(g=>g.addEventListener('click',e=>{e.preventDefault();list=$$('.g-item').filter(ok);i=list.indexOf(g);
    if(i<0){toast('This photo will appear once it is added to the images folder.');return}
    render();lb.classList.add('open');document.body.classList.add('noscroll')}));
  $('.close',lb).onclick=close;$('.prev',lb).onclick=e=>{e.stopPropagation();step(-1)};$('.next',lb).onclick=e=>{e.stopPropagation();step(1)};
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
  let x0=0;lb.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)step(d<0?1:-1)})}

/* get involved: choosing a card fills the form */
$$('.way[data-way]').forEach(w=>{
  const go=()=>{const s=$('select[name=Interest]');if(!s)return;s.value=w.dataset.way;
    $$('.way').forEach(x=>x.classList.toggle('picked',x===w));
    $('.form').scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>s.focus({preventScroll:true}),700)};
  w.addEventListener('click',go);w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});

/* copy phone / email */
$$('.contact-list a[href^="tel:"],.contact-list a[href^="mailto:"]').forEach(a=>{
  const b=document.createElement('button');b.type='button';b.className='copy';b.setAttribute('aria-label','Copy');
  b.innerHTML='<svg class="ic"><use href="#i-copy"/></svg>';
  b.onclick=()=>navigator.clipboard.writeText(a.textContent.trim()).then(()=>toast('Copied: '+a.textContent.trim()));a.after(b)});

/* forms: open the visitor's email app (swap for Formspree later) */
$$('form[data-mail]').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();const lines=[...new FormData(form).entries()].map(([k,v])=>`${k}: ${v}`).join('\n');
  toast('Opening your email app…');
  setTimeout(()=>location.href=`mailto:${MAIL}?subject=${encodeURIComponent(form.dataset.mail)}&body=${encodeURIComponent(lines)}`,700)}));

/* page transitions */
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');
  if(!a||a.target||e.metaKey||e.ctrlKey||e.shiftKey)return;const u=new URL(a.href,location);
  if(u.origin!==location.origin||!/\.html$/.test(u.pathname)||(u.pathname===location.pathname&&u.hash))return;
  e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>location.href=a.href,280)});
addEventListener('pageshow',()=>document.body.classList.remove('leaving'));