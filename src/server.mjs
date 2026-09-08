import http from "node:http";
import {getBenchmark,getChallenge,getClaim,getDrift,getEvidence,getRecord,getSource,listClaims,listEvidence,listRecords,listSources,search} from "./runtime.mjs";
function json(res,status,body){res.writeHead(status,{"content-type":"application/json; charset=utf-8","access-control-allow-origin":"*","cache-control":"public, max-age=60"});res.end(JSON.stringify(body,null,2))}
export function createMftlServer(){
  return http.createServer((req,res)=>{
    try{
      const url=new URL(req.url??"/","http://localhost");
      if(req.method!=="GET")return json(res,405,{error:"method_not_allowed"});
      if(url.pathname==="/health")return json(res,200,{status:"ok",service:"rocksoul-mftl",version:"0.3.0",domain:"STORY"});
      if(url.pathname==="/api/v1/records")return json(res,200,{data:listRecords()});
      if(url.pathname.startsWith("/api/v1/records/")){const id=decodeURIComponent(url.pathname.split("/").pop());const x=getRecord(id);return x?json(res,200,{data:x}):json(res,404,{error:"record_not_found",id})}
      if(url.pathname==="/api/v1/claims")return json(res,200,{data:listClaims()});
      if(url.pathname.startsWith("/api/v1/claims/")&&url.pathname.endsWith("/challenge")){const p=url.pathname.split("/");const id=decodeURIComponent(p[p.length-2]);const x=getChallenge(id);return x?json(res,200,{data:x}):json(res,404,{error:"challenge_not_found",id})}
      if(url.pathname.startsWith("/api/v1/claims/")){const id=decodeURIComponent(url.pathname.split("/").pop());const x=getClaim(id);return x?json(res,200,{data:x}):json(res,404,{error:"claim_not_found",id})}
      if(url.pathname==="/api/v1/sources")return json(res,200,{data:listSources()});
      if(url.pathname.startsWith("/api/v1/sources/")){const id=decodeURIComponent(url.pathname.split("/").pop());const x=getSource(id);return x?json(res,200,{data:x}):json(res,404,{error:"source_not_found",id})}
      if(url.pathname==="/api/v1/evidence")return json(res,200,{data:listEvidence()});
      if(url.pathname.startsWith("/api/v1/evidence/")){const id=decodeURIComponent(url.pathname.split("/").pop());const x=getEvidence(id);return x?json(res,200,{data:x}):json(res,404,{error:"evidence_not_found",id})}
      if(url.pathname==="/api/v1/search")return json(res,200,{data:search(url.searchParams.get("q")??"")});
      if(url.pathname==="/api/v1/benchmark")return json(res,200,{data:getBenchmark()});
      if(url.pathname.startsWith("/api/v1/drift/")){const id=decodeURIComponent(url.pathname.split("/").pop());const x=getDrift(id);return x?json(res,200,{data:x}):json(res,404,{error:"drift_not_found",id})}
      return json(res,404,{error:"not_found"});
    }catch(error){return json(res,500,{error:"internal_error",message:error instanceof Error?error.message:String(error)})}
  });
}
if(import.meta.url===`file://${process.argv[1]}`){const port=Number(process.env.PORT??8786);createMftlServer().listen(port,"0.0.0.0",()=>console.log(`rocksoul-mftl listening on :${port}`))}
