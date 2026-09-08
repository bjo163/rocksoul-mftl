import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root=process.cwd(); const repo=process.env.GITHUB_REPOSITORY; const token=process.env.GITHUB_TOKEN;
const topicConfig=JSON.parse(fs.readFileSync(path.join(root,"data/research-scout/topics.json"),"utf8"));
const topicById=new Map((topicConfig.topics??[]).map(t=>[t.id,t]));
if(!repo||!token)throw new Error("GITHUB_REPOSITORY and GITHUB_TOKEN are required");
function clean(v=""){return String(v).replace(/\s+/g," ").trim()}
function slug(v){return clean(v).toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)}
function short(v){return crypto.createHash("sha256").update(v).digest("hex").slice(0,6).toUpperCase()}
async function jfetch(url,options={}){const r=await fetch(url,{...options,headers:{"accept":"application/json","user-agent":"rocksoul-mftl-steward/0.1",...(options.headers??{})},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error(`HTTP ${r.status} ${url}`);return r.json()}
function walk(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const existing=walk(path.join(root,"data")).filter(f=>f.endsWith(".json")).map(f=>{try{const x=JSON.parse(fs.readFileSync(f,"utf8"));return clean(x.name??x.identity?.canonical_name??x.title??"").toLowerCase()}catch{return""}}).filter(Boolean);
function meta(body,key){const matches=[...String(body).matchAll(new RegExp(`${key}:([^\\n]+)`,"g"))];return matches.at(-1)?.[1]?.trim()??null}
function valueLine(body,label){return body.match(new RegExp(`\\*\\*${label}:\\*\\* ([^\\n]+)`))?.[1]?.trim()??null}
function duplicate(title){const n=clean(title).toLowerCase();return existing.some(x=>x===n||x.includes(n)||n.includes(x))}
function decision(issue){
  const body=String(issue.body??""); const base=Number(meta(body,"AUTO-RESEARCH-SCORE")??0); const title=valueLine(body,"Title")??issue.title.replace(/^\[AUTO-RESEARCH\](?:\s+STORY\s+·)?\s*/,""); const locator=valueLine(body,"Locator");
  const dup=duplicate(title); let score=base+(locator&&locator!=="unknown"?10:0)-(dup?50:0); score=Math.max(0,Math.min(100,score));
  const action=dup?"duplicate":score>=65?"stage_candidate":score>=45?"needs_sources":"hold";
  return {title,locator,lane:meta(body,"AUTO-RESEARCH-LANE")??"unknown",score,duplicate:dup,action};
}
function candidate(issue,d){
  const id=`CAND-AUTO-${slug(d.lane)}-${short(d.title)}`; const now=new Date().toISOString(); const topic=topicById.get(d.lane)??{};
  return {schema_version:"candidate.v0.1",candidate_id:id,name:d.title,aliases:[],region:topic.region_hint==="global"?"Global / auto-discovery":topic.region_hint??"Global / auto-discovery",country:null,tradition:topic.tradition_hint??`Auto research lane: ${d.lane}`,candidate_type:topic.candidate_type??"research_lead",discovery:{summary:`Automatically discovered scholarly lead: ${d.title}`,why_relevant:`MFTL Steward score ${d.score}/100. This candidate remains a staging object until source content and claim-level evidence are inspected.`,discovered_at:now,search_terms:[d.lane,d.title]},sources:[{title:d.title,locator:d.locator??issue.html_url,source_type:"academic_metadata",authority:"discovery_only",notes:`Auto-staged from GitHub issue #${issue.number}; metadata discovery is not claim verification.`}],duplicate_check:{checked:true,possible_matches:[]},status:"needs_sources",notes:d.lane==="conspiracy-narrative"?"Conspiracy narrative guardrail: document provenance, evidence claims, counterevidence and transmission; do not treat popularity as proof.":"Auto-staged by MFTL Steward; canonical promotion requires stronger structured evidence."};
}
async function patchIssue(issue,d){
  const marker="## MFTL Steward review"; let body=String(issue.body??"").split(marker)[0].trim();
  const issueState=d.action==="stage_candidate"?"needs_sources":d.action==="hold"?"triaged":d.action;
  body+=`\n\n${marker}\n\n- **Steward score:** ${d.score}/100\n- **Duplicate:** ${d.duplicate}\n- **Decision:** ${d.action}\n- **Reviewed at:** ${new Date().toISOString()}\n\nROCKSOUL-RESEARCH-STATE:${issueState}\nAUTO-RESEARCH-STATE:${d.action}`;
  const [owner,name]=repo.split("/");
  await jfetch(`https://api.github.com/repos/${owner}/${name}/issues/${issue.number}`,{method:"PATCH",headers:{authorization:`Bearer ${token}`,"content-type":"application/json","x-github-api-version":"2022-11-28"},body:JSON.stringify({body,...(d.action==="duplicate"?{state:"closed",state_reason:"not_planned"}:{})})});
}
const [owner,name]=repo.split("/");
const issues=await jfetch(`https://api.github.com/repos/${owner}/${name}/issues?state=open&per_page=100`,{headers:{authorization:`Bearer ${token}`,"x-github-api-version":"2022-11-28"}});
let staged=0,reviewed=0;
for(const issue of issues.filter(i=>!i.pull_request&&i.title.startsWith("[AUTO-RESEARCH]"))){
  const currentState=meta(issue.body,"ROCKSOUL-RESEARCH-STATE")??meta(issue.body,"AUTO-RESEARCH-STATE");
  if(currentState&&currentState!=="discovered") continue;
  const d=decision(issue); await patchIssue(issue,d); reviewed++;
  if(d.action==="stage_candidate"){
    const c=candidate(issue,d); const file=path.join(root,"data/candidates",`${c.candidate_id}.json`);
    if(!fs.existsSync(file)){fs.writeFileSync(file,JSON.stringify(c,null,2)+"\n");staged++}
  }
}
console.log(`MFTL steward: reviewed=${reviewed} staged=${staged}`);