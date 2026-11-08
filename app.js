const C=window.GUERRA, $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ARROW='<span class="arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#070102" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
let SEMI=[], demo=false, tab="novos";

/* ---------- dados dos semi novos ---------- */
let OFERTAS=[], offDemo=false;
async function loadOfertas(){
  if(C.supabaseUrl && C.supabaseAnonKey){
    try{
      const r=await fetch(C.supabaseUrl+"/rest/v1/ofertas?ativo=eq.true&order=ordem.asc",{headers:{apikey:C.supabaseAnonKey,Authorization:"Bearer "+C.supabaseAnonKey}});
      if(!r.ok) throw new Error(r.status);
      const hoje=new Date().toISOString().slice(0,10);
      OFERTAS=(await r.json()).filter(o=>!o.validade||o.validade>=hoje); return;
    }catch(e){console.error("Ofertas:",e)}
  }
  offDemo=true;
  OFERTAS=[
    {id:"preview-duo",chamada:"Seu próximo Apple está aqui.",condicao:"Explore o catálogo e converse com a Guerra Store. Modelos ilustrativos, sujeitos à confirmação.",alvo_tipo:"novo",alvo_id:"duo",etiqueta:"GUERRA STORE",cta:"Explorar modelo"},
    {id:"preview-iphone",chamada:"Tecnologia que faz parte do seu mundo.",condicao:"Escolha modelo, cor e armazenamento. Consulte as opções disponíveis no Direct.",alvo_tipo:"novo",alvo_id:"18pro",etiqueta:"SELEÇÃO APPLE",cta:"Ver opções"}
  ];
}
const oTimers={};
function renderOfertas(sfx=""){
  let oIdx=0;
  const box=$("#offers"+sfx),tr=$("#otrack"+sfx),dt=$("#odots"+sfx); if(!box)return; tr.innerHTML="";dt.innerHTML="";
  const list=[];
  OFERTAS.forEach(o=>{
    let img="",bg="#17080c",open=null;
    if(okUrl(o.link)&&o.imagem_url){img=o.imagem_url;bg=o.bg||bg;open=()=>window.open(o.link,"_blank","noopener")}
    else if(o.alvo_tipo==="novo"){const p=NOVOS.find(x=>x.id===o.alvo_id);if(!p)return;img=p.img;bg=p.bg;open=()=>openNovo(p)}
    else{const p=SEMI.find(x=>String(x.id)===String(o.alvo_id));if(!p)return;const m=(p.midia||[]).find(x=>x.tipo!=="video");img=m?m.url:"";bg="#000";open=()=>openSemi(p)}
    list.push({o,img,bg,open});
  });
  if(!list.length){box.hidden=true;return}
  box.hidden=false;
  list.forEach((it,i)=>{
    const b=document.createElement("button");b.className="slide";b.setAttribute("aria-label",it.o.chamada);
    b.innerHTML=`<div class="tx"><span class="lb">${esc(it.o.etiqueta||("OFERTA"+(offDemo?" · EXEMPLO":"")))}</span><h2>${esc(it.o.chamada)}</h2>${it.o.condicao?`<p>${esc(it.o.condicao)}</p>`:""}<span class="go">${esc(it.o.cta||"Ver produto")} ${ARROW}</span></div>
    <div class="im" style="background:${it.bg}">${it.img?`<img src="${it.img}" alt="" ${i?'loading="lazy"':""}>`:""}${it.o.logo_url?`<img class="offer-logo" src="${esc(it.o.logo_url)}" alt="${esc(it.o.chamada)}">`:""}</div>`;
    b.onclick=it.open;tr.appendChild(b);
    const d=document.createElement("button");d.setAttribute("aria-label","Oferta "+(i+1));d.onclick=()=>goto(i);dt.appendChild(d);
  });
  const n=list.length; oIdx=0;
  const goto=i=>{oIdx=(i+n)%n;tr.scrollTo({left:tr.children[oIdx].offsetLeft,behavior:"smooth"})};
  const mark=()=>{const i=Math.round(tr.scrollLeft/(tr.children[0].offsetWidth+16));oIdx=Math.min(Math.max(i,0),n-1);[...dt.children].forEach((d,j)=>d.setAttribute("aria-current",j===oIdx))};
  tr.onscroll=mark; mark();
  clearInterval(oTimers[sfx]);
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(n>1&&!reduce){
    const start=()=>{clearInterval(oTimers[sfx]);oTimers[sfx]=setInterval(()=>goto(oIdx+1),5500)}, stop=()=>clearInterval(oTimers[sfx]);
    box.onmouseenter=stop;box.onmouseleave=start;box.addEventListener("touchstart",stop,{passive:true});box.addEventListener("touchend",()=>setTimeout(start,4000),{passive:true});box.onfocusin=stop;box.onfocusout=start;
    start();
  }
}
async function loadSemi(){
  if(C.supabaseUrl && C.supabaseAnonKey){
    try{
      const r=await fetch(C.supabaseUrl+"/rest/v1/semi_novos?ativo=eq.true&order=criado_em.desc",{headers:{apikey:C.supabaseAnonKey,Authorization:"Bearer "+C.supabaseAnonKey}});
      if(!r.ok) throw new Error(r.status); SEMI=await r.json(); return;
    }catch(e){console.error("Supabase:",e)}
  }
  if(C.preview){demo=true;SEMI=[];return}
  if(window.SEMI_LISTA&&SEMI_LISTA.length){SEMI=SEMI_LISTA;return}
  demo=true;
  SEMI=[
    {id:"demo0001",titulo:"iPhone 17 Pro Max",cor:"Laranja-cósmico",armazenamento:"256 GB",bateria:94,estado:"Excelente, sem marcas de uso",obs:"Exemplo de anúncio. Cadastre os reais pelo painel (admin.html).",midia:[{tipo:"image",url:"img/17pro.jpg"}]},
    {id:"demo0002",titulo:"iPhone 17 Pro",cor:"Azul-escuro",armazenamento:"512 GB",bateria:91,estado:"Muito bom",obs:"Acompanha caixa e cabo.",midia:[{tipo:"image",url:"img/17pro.jpg"}],vendido:false}
  ];
}

/* ---------- modal ---------- */
const ov=$("#ov"), sheet=$("#sheet");
let modalTrigger=null;
function openOv(html){modalTrigger=document.activeElement;sheet.innerHTML='<button class="close" aria-label="Fechar">×</button>'+html;ov.classList.add("on");document.body.style.overflow="hidden";sheet.querySelector(".close").onclick=closeOv;sheet.scrollTop=0;sheet.querySelector(".close").focus();if(location.hash!=="#produto")history.pushState({guerraModal:true},"","#produto")}
function closeOv(fromHistory=false){if(!ov.classList.contains("on"))return;ov.classList.remove("on");document.body.style.overflow="";sheet.innerHTML="";if(modalTrigger&&modalTrigger.isConnected)modalTrigger.focus();if(!fromHistory&&history.state?.guerraModal)history.back()}
addEventListener("popstate",()=>closeOv(true));
ov.addEventListener("keydown",e=>{if(e.key!=="Tab")return;const a=[...sheet.querySelectorAll("button:not([disabled]),a[href],input,select,textarea,[tabindex=\"0\"]")].filter(x=>x.offsetParent!==null);if(!a.length)return;const first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
ov.addEventListener("click",e=>{if(e.target===ov)closeOv()}); addEventListener("keydown",e=>{if(e.key==="Escape")closeOv()});
function chips(el,items,onpick,sel=0){
  el.innerHTML=""; items.forEach((it,i)=>{const b=document.createElement("button");b.type="button";b.className="chip";
    b.innerHTML=(it.c?`<i style="background:${it.c}"></i>`:"")+esc(it.t);b.setAttribute("aria-pressed",i===sel);
    b.onclick=()=>{el.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");onpick(i)};el.appendChild(b)});
  onpick(sel);
}
function openNovo(p){
  let mi=0,ci=0,ai=0;
  openOv(`<div class="media"><div class="main" style="background:${p.bg}">${p.img?`<img src="${p.img}" alt="${esc(p.nome)}">`:`<div class="noimg">${esc(p.nome)}</div>`}</div></div>
  <div class="info"><div><div class="eyebrow" style="font-size:11px">NOVO</div><h2 style="margin-top:8px">${esc(p.nome)}</h2></div>
  <p class="obs" id="o-ver" hidden></p>
  ${p.modelos.length>1?'<div class="opt"><label>Modelo</label><div class="chips" id="o-m"></div></div>':""}
  <div class="opt"><label>Cor</label><div class="chips" id="o-c"></div></div>
  <div class="opt"><label>Armazenamento</label><div class="chips" id="o-a"></div></div>
  <button class="buy" id="buy">Consultar no Instagram ${ARROW}</button>
  <div class="note">Modelo ilustrativo. Confirme disponibilidade, valor e entrega no Direct.</div></div>`);
  const showVer=()=>{const v=p.modelos[mi].versao,e=$("#o-ver");e.hidden=!v;e.textContent=v?(VER[v]||v):""};
  const drawA=()=>chips($("#o-a"),p.modelos[mi].armaz.map(t=>({t})),i=>ai=i,0);
  if(p.modelos.length>1) chips($("#o-m"),p.modelos.map(m=>({t:m.nome+(m.versao?" · "+m.versao:"")})),i=>{mi=i;drawA();showVer()},0);
  chips($("#o-c"),p.cores.map(c=>({t:c[0],c:c[1]})),i=>ci=i,0); drawA(); showVer();
  $("#buy").onclick=()=>buy(`${p.modelos[mi].nome} ${p.cores[ci][0]} ${p.modelos[mi].armaz[ai]}${p.modelos[mi].versao?", versão "+(p.modelos[mi].versao==="EUA"?"EUA (chip virtual)":"Brasil (Anatel, com chip)"):""} (novo)`,"");
}
function openSemi(p){
  const ms=p.midia||[];
  const sp=[["Cor",p.cor],["Armazenamento",p.armazenamento],["Bateria",p.bateria?p.bateria+"%":""],["Estado",p.estado]].filter(s=>s[1]);
  openOv(`<div class="media"><div class="main" id="main">${(ms.length?ms:[{tipo:"image",url:"img/consulte.webp"}]).map(m=>m.tipo==="video"?`<video src="${m.url}" controls playsinline preload="metadata"></video>`:`<img src="${m.url}" alt="">`).join("")}</div>
  ${ms.length>1?`<div class="thumbs" id="th">${ms.map((m,i)=>`<button data-i="${i}" class="${i?"":"on"}">${m.tipo==="video"?`<video src="${m.url}#t=0.1" muted preload="metadata"></video><span class="play">▶</span>`:`<img src="${m.url}" alt="">`}</button>`).join("")}</div>`:""}</div>
  <div class="info"><div><div class="eyebrow" style="font-size:11px">SEMI NOVO · REF ${esc(String(p.id).slice(0,6).toUpperCase())}</div><h2 style="margin-top:8px">${esc(p.titulo)}</h2></div>
  <div class="specs">${sp.map(s=>`<div class="spec"><b>${s[0]}</b>${esc(s[1])}</div>`).join("")}</div>
  ${p.obs?`<p class="obs">${esc(p.obs)}</p>`:""}
  <button class="buy" id="buy" ${p.vendido?"disabled":""}>${p.vendido?"Já vendido":"Tenho interesse"} ${p.vendido?"":ARROW}</button>
  <div class="note">Modelo ilustrativo. Confirme disponibilidade, valor e entrega no Direct.</div></div>`);
  const main=$("#main"), th=$("#th");
  if(th){th.onclick=e=>{const b=e.target.closest("button");if(!b)return;main.scrollTo({left:main.clientWidth*b.dataset.i,behavior:"smooth"})};
    main.onscroll=()=>{const i=Math.round(main.scrollLeft/main.clientWidth);th.querySelectorAll("button").forEach((b,j)=>b.classList.toggle("on",i===j));main.querySelectorAll("video").forEach((v,j)=>{})}}
  if(!p.vendido) $("#buy").onclick=()=>buy(`${p.titulo} ${[p.cor,p.armazenamento].filter(Boolean).join(" ")} (semi novo)`,String(p.id).slice(0,6).toUpperCase());
}

/* ---------- compra: mensagem pronta + abre o Direct ---------- */
function buy(item,ref){
  const msg=`Olá, Guerra Store! Gostaria de consultar o ${item}.${ref?` (Ref ${ref})`:""} Ainda está disponível?`;
  const url=`https://ig.me/m/${C.instagram}`;
  const done=ok=>{toast(ok?"Mensagem copiada! Cole no Direct e envie.":"Copie e envie esta mensagem no Direct:\n"+msg);setTimeout(()=>{ location.href=url},ok?1400:3200)};
  if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(msg).then(()=>done(true),()=>fallback(msg,done)); else fallback(msg,done);
}
function fallback(msg,done){const t=document.createElement("textarea");t.value=msg;t.style.cssText="position:fixed;opacity:0";document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand("copy")}catch(e){}t.remove();done(ok)}
function toast(t){const e=$("#toast");e.style.whiteSpace="pre-line";e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),3400)}

/* ---------- cartoes reutilizaveis (inicio e estoque) ---------- */
const VER={"Brasil":"Versão brasileira, homologada pela Anatel, com chip físico.","EUA":"Versão americana, somente chip virtual (eSIM)."};
function verTxt(p){const v=[...new Set(p.modelos.map(m=>m.versao).filter(Boolean))];return v.length?"versão "+v.join(" e "):"escolha o armazenamento"}
function cardNovo(p){
  const b=document.createElement("button"); b.className="card";
  b.innerHTML=`<div class="ph fit" style="background:${p.bg}">${p.img?`<img src="${p.img}" alt="${esc(p.nome)}" loading="lazy">`:`<div class="noimg">${esc(p.nome)}</div>`}<span class="badge">${C.preview?"MODELO ILUSTRATIVO":"Novo"}</span></div>
  <div class="bd"><h3>${esc(p.nome)}</h3><div class="sub">${p.cores.length} ${p.cores.length>1?"cores":"cor"} · ${verTxt(p)}</div>
  <div class="dots">${p.cores.map(c=>`<i style="background:${c[1]}" title="${esc(c[0])}"></i>`).join("")}</div>
  <div class="cta-row"><span>Ver opções</span>${ARROW}</div></div>`;
  b.onclick=()=>openNovo(p); return b;
}
function cardSemi(p){
  const m=(p.midia||[])[0], b=document.createElement("button"); b.className="card";
  const th=m?(m.tipo==="video"?`<video src="${m.url}#t=0.1" muted playsinline preload="metadata"></video>`:`<img src="${m.url}" alt="${esc(p.titulo)}" loading="lazy">`):`<img src="img/consulte.webp" alt="Consulte as imagens com o vendedor" loading="lazy">`;
  b.innerHTML=`<div class="ph${m?"":" fit"}" style="background:#17080c">${th}<span class="badge ${p.vendido?"vendido":""}">${p.vendido?"Vendido":"Semi novo"}</span></div>
  <div class="bd"><h3>${esc(p.titulo)}</h3><div class="sub">${[p.cor,p.armazenamento,p.bateria?("Bateria "+p.bateria+"%"):""].filter(Boolean).map(esc).join(" · ")}</div>
  <div class="cta-row"><span>${p.vendido?"Ver detalhes":"Ver fotos e vídeos"}</span>${ARROW}</div></div>`;
  b.onclick=()=>openSemi(p); return b;
}
const okUrl=u=>/^https?:\/\//i.test(u||"");
async function rest(tabela,qs){
  if(!(C.supabaseUrl&&C.supabaseAnonKey)) return null;
  try{const r=await fetch(C.supabaseUrl+"/rest/v1/"+tabela+"?"+qs,{headers:{apikey:C.supabaseAnonKey,Authorization:"Bearer "+C.supabaseAnonKey}});if(!r.ok)throw new Error(r.status);return await r.json()}
  catch(e){console.error(tabela,e);return null}
}
const vigente=r=>{const h=new Date().toISOString().slice(0,10);return !r.validade||r.validade>=h};

