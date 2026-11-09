const decode = s => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const json = (data,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function authorize(request,env){
 if(!env.STUDIO_TEAM_DOMAIN||!env.STUDIO_AUDIENCE||!env.STUDIO_EMAIL)return false;
 const team=env.STUDIO_TEAM_DOMAIN.replace(/^https:\/\//,'').replace(/\/$/,'');
 if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team))return false;
 const cookie=request.headers.get('Cookie')||'';
 const token=request.headers.get('Cf-Access-Jwt-Assertion')||cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
 if(!token||token.length>16000)return false;
 try{
  const parts=token.split('.');if(parts.length!==3)return false;
  const header=JSON.parse(new TextDecoder().decode(decode(parts[0]))),body=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const now=Math.floor(Date.now()/1000);
  if(header.alg!=='RS256'||typeof header.kid!=='string'||body.iss!==`https://${team}`||typeof body.exp!=='number'||body.exp<=now||typeof body.iat!=='number'||body.iat>now+30||body.nbf&&body.nbf>now||!Array.isArray(body.aud)||!body.aud.includes(env.STUDIO_AUDIENCE)||typeof body.email!=='string'||body.email.toLowerCase()!==env.STUDIO_EMAIL.trim().toLowerCase())return false;
  const response=await fetch(`https://${team}/cdn-cgi/access/certs`,{cf:{cacheTtl:300,cacheEverything:true}});if(!response.ok)return false;
  const jwk=(await response.json()).keys?.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)return false;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
 }catch{return false}
}
export async function onRequest({request,env}){
 const path=new URL(request.url).pathname;
 if(request.method!=='GET')return json({error:'Método não permitido'},405);
 const configured=!!(env.STUDIO_TEAM_DOMAIN&&env.STUDIO_AUDIENCE&&env.STUDIO_EMAIL);
 if(path==='/api/studio/session')return json({configured,authenticated:await authorize(request,env)});
 if(path==='/api/studio/login'){
  if(!configured)return json({error:'O acesso exclusivo ainda precisa ser ativado.'},503);
  if(!await authorize(request,env))return json({error:'Acesso não autorizado'},401);
  return new Response(null,{status:302,headers:{Location:'/admin','Cache-Control':'no-store'}});
 }
 return json({error:'Não encontrado'},404);
}
