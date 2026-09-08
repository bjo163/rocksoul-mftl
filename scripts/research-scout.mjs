import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root=process.cwd();
const cfg=JSON.parse(fs.readFileSync(path.join(root,"data/research-scout/topics.json"),"utf8"));
const repo=process.env.GITHUB_REPOSITORY;
const token=process.env.GITHUB_TOKEN;
const laneFilter=process.env.RESEARCH_SCOUT_LANE??"";
const maxNew=Number(process.env.RESEARCH_SCOUT_MAX_NEW??2);
const dryRun=process.env.RESEARCH_SCOUT_DRY_RUN==="1"||!repo||!token;
const minYear=Number(cfg.minimum_publication_year??2018);

function clean(v=""){return String(v).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}
function hash(v){return crypto.createHash("sha256").update(v).digest("hex").slice(0,16)}
async function jfetch(url,options={}){
  const r=await fetch(url,{...options,headers:{"accept":"application/json","user-agent":"rocksoul-mftl-steward/0.1",...(options.headers??{})},signal:AbortSignal.timeout(15000)});
  if(!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.json();
}
function locator(x){return x.doi?`https://doi.org/${x.doi}`:x.url}
function fingerprint(x){return hash([x.doi??"",clean(x.title).toLowerCase(),x.year??"",locator(x)??""].join("|"))}

async function openAlex(query){
  const u=new URL("https://api.openalex.org/works");
  u.searchParams.set("search",query); u.searchParams.set("per-page","8"); u.searchParams.set("sort","cited_by_count:desc");
  const d=await jfetch(u);
  return (d.results??[]).map(w=>({provider:"OpenAlex",title:w.display_name,year:w.publication_year??null,doi:w.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//i,"")??null,url:w.primary_location?.landing_page_url??w.id,venue:w.primary_location?.source?.display_name??null,citations:Number(w.cited_by_count??0),source_type:w.type??"academic_work"}));
}
async function crossref(query){
  const u=new URL("https://api.crossref.org/works");
  u.searchParams.set("query.bibliographic",query); u.searchParams.set("rows","8"); u.searchParams.set("sort","is-referenced-by-count"); u.searchParams.set("order","desc");
  const d=await jfetch(u);
  return (d.message?.items??[]).map(w=>({provider:"Crossref",title:Array.isArray(w.title)?w.title[0]:w.title,year:w.published?.["date-parts"]?.[0]?.[0]??null,doi:w.DOI??null,url:w.URL??null,venue:Array.isArray(w["container-title"])?w["container-title"][0]:null,citations:Number(w["is-referenced-by-count"]??0),source_type:w.type??"journal-article"}));
}
async function seenFingerprints(){
  const seen=new Set(); if(dryRun)return seen;
  const [owner,name]=repo.split("/");
  for(let page=1;page<=5;page++){
    const items=await jfetch(`https://api.github.com/repos/${owner}/${name}/issues?state=all&per_page=100&page=${page}`,{headers:{authorization:`Bearer ${token}`,"x-github-api-version":"2022-11-28"}});
    for(const i of items){for(const m of String(i.body??"").matchAll(/AUTO-RESEARCH-FP:([a-f0-9]{16})/g))seen.add(m[1])}
    if(items.length<100)break;
  }
  return seen;
}
function score(x){return (x.doi?20:0)+Math.min(25,Math.log10(1+x.citations)*10)+(x.year&&x.year>=minYear?10:0)+(x.venue?5:0)}
function body(topic,query,x,fp){
  const conspiracy=topic.candidate_type==="conspiracy_narrative";
  return [`## Auto research lead`,``,`**Lane:** ${topic.id}  `,`**Suggested candidate type:** ${topic.candidate_type}  `,`**Query:** ${query}  `,``,`## Scholarly metadata`,``,`- **Title:** ${clean(x.title)}`,`- **Year:** ${x.year??"unknown"}`,`- **Venue:** ${clean(x.venue??"unknown")}`,`- **Provider:** ${x.provider}`,`- **Locator:** ${locator(x)??"unknown"}`,`- **Citation signal:** ${x.citations}`,``,`## Steward boundary`,``,`This is a discovery lead, not canonical truth. The Steward must still check duplication, source authority, counterevidence, alternative explanations, and whether the paper actually supports the inferred research topic.`,conspiracy?`\n**Conspiracy guardrail:** research the narrative, provenance, evidence claims, counterevidence, and transmission. Popularity is not evidence that the alleged conspiracy occurred.`:"",``,`AUTO-RESEARCH-FP:${fp}`,`AUTO-RESEARCH-LANE:${topic.id}`,`AUTO-RESEARCH-SCORE:${Math.round(score(x))}`,`AUTO-RESEARCH-STATE:discovered`].join("\n");
}
async function createIssue(topic,query,x,fp){
  const payload={title:`[AUTO-RESEARCH] ${clean(x.title).slice(0,110)}`,body:body(topic,query,x,fp)};
  if(dryRun){console.log(JSON.stringify(payload,null,2));return}
  const [owner,name]=repo.split("/");
  await jfetch(`https://api.github.com/repos/${owner}/${name}/issues`,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json","x-github-api-version":"2022-11-28"},body:JSON.stringify(payload)});
}

const seen=await seenFingerprints();
const day=Math.floor(Date.now()/86400000);
const topics=cfg.topics.filter(t=>!laneFilter||t.id===laneFilter);
let created=0;
for(const topic of topics){
  if(created>=maxNew)break;
  const query=topic.queries[(day+topic.id.length)%topic.queries.length];
  const settled=await Promise.allSettled([openAlex(query),crossref(query)]);
  const pool=settled.flatMap(r=>r.status==="fulfilled"?r.value:[]).filter(x=>x.title&&(!x.year||x.year>=minYear)).sort((a,b)=>score(b)-score(a));
  const unique=new Map(); for(const x of pool){const k=(x.doi??clean(x.title)).toLowerCase();if(!unique.has(k))unique.set(k,x)}
  for(const x of unique.values()){
    const fp=fingerprint(x); if(seen.has(fp))continue;
    await createIssue(topic,query,x,fp); seen.add(fp); created++; if(created>=maxNew)break;
  }
}
console.log(`MFTL scout: lane=${laneFilter||"all"} created=${created} dry_run=${dryRun}`);
