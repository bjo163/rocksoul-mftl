import fs from "node:fs";
import path from "node:path";

const root=process.cwd(); const repo=process.env.GITHUB_REPOSITORY; const token=process.env.GITHUB_TOKEN;
const maxNew=Number(process.env.RESEARCH_INTAKE_MAX_NEW??4);
if(!repo||!token)throw new Error("GitHub context required");
function walk(d){if(!fs.existsSync(d))return[];return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
function clean(v=""){return String(v).replace(/\s+/g," ").trim()}
async function jfetch(url,options={}){const r=await fetch(url,{...options,headers:{"accept":"application/json","user-agent":"rocksoul-mftl-intake/0.1",...(options.headers??{})},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error(`HTTP ${r.status} ${url}`);return r.json()}
function loc(x){return x.doi?`https://doi.org/${x.doi}`:x.url}
function issueBody(f){const t=f.topic,x=f.item,con=t.candidate_type==="conspiracy_narrative";return [`## Auto research lead`,``,`**Lane:** ${t.id}  `,`**Suggested candidate type:** ${t.candidate_type}  `,`**Query:** ${f.query}  `,``,`## Scholarly metadata`,``,`- **Title:** ${clean(x.title)}`,`- **Year:** ${x.year??"unknown"}`,`- **Venue:** ${clean(x.venue??"unknown")}`,`- **Provider:** ${x.provider}`,`- **Locator:** ${loc(x)??"unknown"}`,`- **Citation signal:** ${x.citations??0}`,``,`## Steward boundary`,``,`Discovery metadata is not canonical truth. MFTL Steward will review duplication, source/locator strength and staging eligibility.`,con?`\n**Conspiracy guardrail:** research provenance, transmission, evidence claims, counterevidence and alternatives. Popularity is not proof that the alleged conspiracy occurred.`:"",``,`AUTO-RESEARCH-FP:${f.fingerprint}`,`AUTO-RESEARCH-LANE:${t.id}`,`AUTO-RESEARCH-SCORE:${Math.round(f.score)}`,`AUTO-RESEARCH-STATE:discovered`].join("\n")}
const files=walk(path.join(root,"research-out")).filter(f=>f.endsWith(".json"));
const pool=files.flatMap(f=>{try{return JSON.parse(fs.readFileSync(f,"utf8"))}catch{return[]}});
const [owner,name]=repo.split("/");
const issues=await jfetch(`https://api.github.com/repos/${owner}/${name}/issues?state=all&per_page=100`,{headers:{authorization:`Bearer ${token}`,"x-github-api-version":"2022-11-28"}});
const seen=new Set(); for(const i of issues){for(const m of String(i.body??"").matchAll(/AUTO-RESEARCH-FP:([a-f0-9]{16})/g))seen.add(m[1])}
const unique=new Map(); for(const f of pool.sort((a,b)=>b.score-a.score)){const k=(f.item.doi??clean(f.item.title)).toLowerCase();if(!unique.has(k))unique.set(k,f)}
let created=0;
for(const f of unique.values()){
  if(created>=maxNew)break; if(seen.has(f.fingerprint))continue;
  const payload={title:`[AUTO-RESEARCH] ${clean(f.item.title).slice(0,110)}`,body:issueBody(f)};
  await jfetch(`https://api.github.com/repos/${owner}/${name}/issues`,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json","x-github-api-version":"2022-11-28"},body:JSON.stringify(payload)});
  seen.add(f.fingerprint); created++;
}
console.log(`MFTL intake: artifacts=${files.length} pool=${pool.length} unique=${unique.size} created=${created}`);
