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
    {id:"bf-duo",chamada:"iPhone Duo · Black Friday",condicao:"256 GB: de R$ 18.999 por R$ 17.999 · 512 GB: de R$ 21.499 por R$ 18.999. Para 1 TB e 2 TB, consulte disponibilidade.",preco_de:18999,preco_por:17999,alvo_tipo:"novo",alvo_id:"duo",modelo_indice:0,imagem_url:"img/offer-duo-cutout.png",imagem_classe:"offer-art-cutout",etiqueta:"BLACK FRIDAY",cta:"Ver oferta"},
    {id:"bf-18pro",chamada:"iPhone 18 Pro · 256 GB",condicao:"512 GB: de R$ 10.999 por R$ 9.999. Para 1 TB e 2 TB, consulte disponibilidade.",preco_de:9499,preco_por:8499,alvo_tipo:"novo",alvo_id:"18pro",modelo_indice:0,imagem_url:"img/offer-18pro-cutout.png",imagem_classe:"offer-art-cutout",etiqueta:"BLACK FRIDAY",cta:"Ver oferta"},
    {id:"bf-18promax",chamada:"iPhone 18 Pro Max · 256 GB",condicao:"512 GB: de R$ 12.499 por R$ 11.499. Para 1 TB e 2 TB, consulte disponibilidade.",preco_de:10499,preco_por:9499,alvo_tipo:"novo",alvo_id:"18pro",modelo_indice:1,imagem_url:"img/offer-18pro-cutout.png",imagem_classe:"offer-art-cutout",etiqueta:"BLACK FRIDAY",cta:"Ver oferta"},
    {id:"bf-17pro",chamada:"iPhone 17 Pro · 256 GB",condicao:"512 GB: de R$ 9.999 por R$ 8.999. Para 1 TB e 2 TB, consulte disponibilidade.",preco_de:7999,preco_por:7499,alvo_tipo:"novo",alvo_id:"17pro",modelo_indice:0,imagem_url:"img/offer-17pro-cutout.png",imagem_classe:"offer-art-cutout",etiqueta:"BLACK FRIDAY",cta:"Ver oferta"},
    {id:"bf-17promax",chamada:"iPhone 17 Pro Max · 256 GB",condicao:"512 GB: de R$ 10.499 por R$ 9.499. Para 1 TB e 2 TB, consulte disponibilidade.",preco_de:8999,preco_por:7999,alvo_tipo:"novo",alvo_id:"17pro",modelo_indice:1,imagem_url:"img/offer-17pro-cutout.png",imagem_classe:"offer-art-cutout",etiqueta:"BLACK FRIDAY",cta:"Ver oferta"}
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
    else if(o.alvo_tipo==="novo"){const p=NOVOS.find(x=>x.id===o.alvo_id);if(!p)return;img=o.imagem_url||p.img;bg=o.bg||p.bg;open=()=>openNovo(p,o.modelo_indice||0)}
    else{const p=SEMI.find(x=>String(x.id)===String(o.alvo_id));if(!p)return;const m=(p.midia||[]).find(x=>x.tipo!=="video");img=m?m.url:"";bg="#000";open=()=>openSemi(p)}
    list.push({o,img,bg,open});
  });
  if(!list.length){box.hidden=true;return}
  box.hidden=false;
  list.forEach((it,i)=>{
    const b=document.createElement("button");b.className="slide";b.setAttribute("aria-label",it.o.chamada);
    b.innerHTML=`<div class="tx"><span class="lb">${esc(it.o.etiqueta||"OFERTA")}</span><h2>${esc(it.o.chamada)}</h2>${it.o.preco_por!=null?`<div class="offer-price"><s>${brl(it.o.preco_de)}</s><strong>${brl(it.o.preco_por)}</strong></div>`:""}${it.o.condicao?`<p>${esc(it.o.condicao)}</p>`:""}<span class="go">${esc(it.o.cta||"Ver produto")} ${ARROW}</span></div>
    <div class="im" style="background:${it.bg}">${it.img?`<img class="${esc(it.o.imagem_classe||"offer-art-feather")}" src="${it.img}" alt="" ${i?'loading="lazy"':""}>`:""}${it.o.logo_url?`<img class="offer-logo" src="${esc(it.o.logo_url)}" alt="${esc(it.o.chamada)}">`:""}</div>`;
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
function openNovo(p,modeloInicial=0){
  let mi=Math.min(Math.max(modeloInicial,0),p.modelos.length-1),ci=0,ai=0;
  openOv(`<div class="media"><div class="main" style="background:${p.bg}">${p.img?`<img src="${p.img}" alt="${esc(p.nome)}">`:`<div class="noimg">${esc(p.nome)}</div>`}</div></div>
  <div class="info"><div><div class="eyebrow" style="font-size:11px">NOVO</div><h2 style="margin-top:8px">${esc(p.nome)}</h2></div>
  <p class="obs" id="o-ver" hidden></p><div class="product-price" id="o-price"></div>
  ${p.modelos.length>1?'<div class="opt"><label>Modelo</label><div class="chips" id="o-m"></div></div>':""}
  <div class="opt"><label>Cor</label><div class="chips" id="o-c"></div></div>
  <div class="opt"><label>Armazenamento</label><div class="chips" id="o-a"></div></div>
  <button class="buy" id="buy">Consultar no WhatsApp ${ARROW}</button>
  <div class="note">${p.preview?"Modelo ilustrativo. ":""}Confirme disponibilidade e condições de pagamento pelo WhatsApp.</div></div>`);
  const showVer=()=>{const v=p.modelos[mi].versao,e=$("#o-ver");e.hidden=!v;e.textContent=v?(VER[v]||v):""};
  const storage=()=>p.modelos[mi].armaz[ai], storageTxt=()=>typeof storage()==="string"?storage():storage().nome;
  const availableColors=()=>typeof storage()==="object"&&storage().cores?.length?storage().cores:p.cores;
  const currentPrice=()=>{const a=storage(),cor=availableColors()[ci]?.[0];if(typeof a==="string")return null;return a.precosCor?.[cor]??a.preco??null};
  const showPrice=()=>{const a=storage(),v=currentPrice(),e=$("#o-price");e.innerHTML=v!=null?`${a.precoAnterior?`<s>${brl(a.precoAnterior)}</s>`:""}<strong>${a.aPartir?"A partir de ":""}${brl(v)}</strong>`:"Consulte disponibilidade"};
  const drawC=()=>{ci=0;chips($("#o-c"),availableColors().map(c=>({t:c[0],c:c[1]})),i=>{ci=i;showPrice()},0)};
  const drawA=()=>{ai=0;chips($("#o-a"),p.modelos[mi].armaz.map(a=>({t:typeof a==="string"?a:a.nome})),i=>{ai=i;drawC()},0)};
  if(p.modelos.length>1) chips($("#o-m"),p.modelos.map(m=>({t:m.nome+(m.versao?" · "+m.versao:"")})),i=>{mi=i;drawA();showVer()},mi); else drawA();
  showVer();
  $("#buy").onclick=()=>{const cor=availableColors()[ci][0],valor=currentPrice();buy(`${p.modelos[mi].nome} ${cor} ${storageTxt()}${valor!=null?" por "+brl(valor):""}${p.modelos[mi].versao?", versão "+(p.modelos[mi].versao==="EUA"?"EUA (chip virtual)":"Brasil (Anatel, com chip)"):""} (novo)`,"")};
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

/* ---------- compra: mensagem pronta + abre o WhatsApp ---------- */
function buy(item,ref){
  const msg=`Olá, Guerra Store! Gostaria de consultar o ${item}.${ref?` (Ref ${ref})`:""} Ainda está disponível?`;
  window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
}
function fallback(msg,done){const t=document.createElement("textarea");t.value=msg;t.style.cssText="position:fixed;opacity:0";document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand("copy")}catch(e){}t.remove();done(ok)}
function toast(t){const e=$("#toast");e.style.whiteSpace="pre-line";e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),3400)}

/* ---------- contato flutuante ---------- */
function mountWhatsApp(){
  if(!C.whatsapp||document.querySelector(".whatsapp-float"))return;
  const msg=encodeURIComponent("Olá, Guerra Store! Vim pelo site e gostaria de mais informações.");
  const a=document.createElement("a");
  a.className="whatsapp-float";a.href=`https://wa.me/${C.whatsapp}?text=${msg}`;a.target="_blank";a.rel="noopener";a.setAttribute("aria-label","Falar com a Guerra Store pelo WhatsApp");
  a.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3A12.93 12.93 0 0 0 5.1 22.82L3 30l7.36-1.93A12.97 12.97 0 1 0 16.04 3Zm0 23.58c-1.91 0-3.79-.51-5.42-1.48l-.39-.23-4.37 1.15 1.17-4.26-.25-.4a10.61 10.61 0 1 1 9.26 5.22Zm5.82-7.94c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.58a9.59 9.59 0 0 1-1.77-2.2c-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37Z"/></svg><span>WhatsApp</span>';
  document.body.appendChild(a);
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mountWhatsApp):mountWhatsApp();

/* ---------- cartoes reutilizaveis (inicio e estoque) ---------- */
const VER={"Brasil":"Versão brasileira, homologada pela Anatel, com chip físico.","EUA":"Versão americana, somente chip virtual (eSIM)."};
const brl=v=>Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:2});
function menorPreco(p){const vs=[];p.modelos.forEach(m=>m.armaz.forEach(a=>{if(typeof a!=="object")return;if(a.preco!=null)vs.push({valor:a.preco,aPartir:a.aPartir,anterior:a.precoAnterior});if(a.precosCor)Object.values(a.precosCor).forEach(v=>vs.push({valor:v,aPartir:false}))}));if(!vs.length)return null;const min=Math.min(...vs.map(x=>x.valor)),item=vs.find(x=>x.valor===min);return {valor:min,aPartir:item.aPartir||vs.some(x=>x.valor>min),anterior:item.anterior}}
function verTxt(p){const v=[...new Set(p.modelos.map(m=>m.versao).filter(Boolean))];return v.length?"versão "+v.join(" e "):"escolha o armazenamento"}
function cardNovo(p){
  const b=document.createElement("button"); b.className="card";
  const mp=menorPreco(p);
  b.innerHTML=`<div class="ph fit" style="background:${p.bg}">${p.img?`<img src="${p.img}" alt="${esc(p.nome)}" loading="lazy">`:`<div class="noimg">${esc(p.nome)}</div>`}<span class="badge">${p.preview?"MODELO ILUSTRATIVO":"Novo"}</span></div>
  <div class="bd"><h3>${esc(p.nome)}</h3><div class="sub">${p.cores.length} ${p.cores.length>1?"cores":"cor"} · ${verTxt(p)}</div>
  <div class="card-price">${mp?`${mp.anterior?`<s>${brl(mp.anterior)}</s>`:""}<strong>${mp.aPartir?"A partir de ":""}${brl(mp.valor)}</strong>`:"Consulte disponibilidade"}</div>
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

