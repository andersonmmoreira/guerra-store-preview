const encoder=new TextEncoder(),COOKIE='__Host-guerra_session';
const json=(data,status=200,extra={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff',...extra}});
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const base64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
const hex=b=>[...new Uint8Array(b)].map(n=>n.toString(16).padStart(2,'0')).join('');
const digest=async text=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(text)));
const equal=(a,b)=>{if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0};
function config(env){try{const c=JSON.parse(env.STUDIO_AUTH||'null');return c&&typeof c.email==='string'&&c.iterations===100000&&bytes(c.hash).length===32&&bytes(c.salt).length>=16&&bytes(c.pepper).length>=32&&env.STUDIO_DB?c:null}catch{return null}}
export async function passwordHash(password,c){const pepper=await crypto.subtle.importKey('raw',bytes(c.pepper),{name:'HMAC',hash:'SHA-256'},false,['sign']);const prehash=await crypto.subtle.sign('HMAC',pepper,encoder.encode(password));const key=await crypto.subtle.importKey('raw',prehash,'PBKDF2',false,['deriveBits']);return base64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytes(c.salt),iterations:c.iterations},key,256))}
function token(request){return(request.headers.get('Cookie')||'').match(/(?:^|;\s*)__Host-guerra_session=([a-f0-9]{64})(?:;|$)/)?.[1]||null}
export async function authorize(request,env){const c=config(env),t=token(request);if(!c||!t)return false;const row=await env.STUDIO_DB.prepare('SELECT email, expires_at FROM studio_sessions WHERE token_hash = ?').bind(await digest(t)).first();return !!(row&&row.email===c.email&&row.expires_at>Math.floor(Date.now()/1000))}
async function limit(env,bucket,seconds,max){const now=Math.floor(Date.now()/1000);const row=await env.STUDIO_DB.prepare('INSERT INTO studio_login_limits(bucket,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts = CASE WHEN reset_at <= ? THEN 1 ELSE attempts+1 END, reset_at = CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at END RETURNING attempts,reset_at').bind(bucket,now+seconds,now,now).first();return {allowed:row.attempts<=max,retry:Math.max(1,row.reset_at-now)}}
const sessionCookie=(value,age)=>`${COOKIE}=${value}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${age}`;
export async function onRequest({request,env}){
 const path=new URL(request.url).pathname,c=config(env);
 try{
  if(path==='/api/studio/session'&&request.method==='GET')return json({configured:!!c,authenticated:await authorize(request,env)});
  if(!['/api/studio/login','/api/studio/logout'].includes(path))return json({error:'Não encontrado'},404);
  if(request.method!=='POST')return json({error:'Método não permitido'},405);
  if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Solicitação não permitida'},403);
  if(!c)return json({error:'O acesso exclusivo ainda precisa ser ativado.'},503);
  if(path==='/api/studio/logout'){const t=token(request);if(t)await env.STUDIO_DB.prepare('DELETE FROM studio_sessions WHERE token_hash = ?').bind(await digest(t)).run();return json({authenticated:false},200,{'Set-Cookie':sessionCookie('',0)})}
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Formato inválido'},415);
  if(Number(request.headers.get('Content-Length')||0)>4096)return json({error:'Solicitação muito grande'},413);
  const global=await limit(env,'global',900,40);if(!global.allowed)return json({error:'Muitas tentativas. Aguarde para tentar novamente.'},429,{'Retry-After':String(global.retry)});
  const ip=await digest(c.pepper+'|'+(request.headers.get('CF-Connecting-IP')||'unknown'));const local=await limit(env,'ip:'+ip,300,8);if(!local.allowed)return json({error:'Muitas tentativas. Aguarde para tentar novamente.'},429,{'Retry-After':String(local.retry)});
  const raw=await request.text();if(raw.length>4096)return json({error:'Solicitação muito grande'},413);let body;try{body=JSON.parse(raw)}catch{return json({error:'Solicitação inválida'},400)}
  if(typeof body.email!=='string'||body.email.length>254||typeof body.password!=='string'||body.password.length<1||body.password.length>256)return json({error:'E-mail ou senha incorretos.'},401);
  const hash=await passwordHash(body.password,c);if(!equal(bytes(hash),bytes(c.hash))||body.email.trim().toLowerCase()!==c.email)return json({error:'E-mail ou senha incorretos.'},401);
  const t=hex(crypto.getRandomValues(new Uint8Array(32))),now=Math.floor(Date.now()/1000),age=28800;
  await env.STUDIO_DB.prepare('INSERT INTO studio_sessions(token_hash,email,expires_at) VALUES(?,?,?)').bind(await digest(t),c.email,now+age).run();
  await env.STUDIO_DB.prepare('DELETE FROM studio_sessions WHERE expires_at <= ?').bind(now).run();await env.STUDIO_DB.prepare('DELETE FROM studio_login_limits WHERE reset_at <= ?').bind(now).run();
  return json({authenticated:true},200,{'Set-Cookie':sessionCookie(t,age)});
 }catch{return json({error:'Não foi possível acessar agora. Tente novamente em instantes.'},503)}
}
