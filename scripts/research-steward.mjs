import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { countLifecycle, rankResearchIssues, wipPressure } from "./research-policy.mjs";

const root=process.cwd(); const repo=process.env.GITHUB_REPOSITORY; const token=process.env.GITHUB_TOKEN;
const topicConfig=JSON.parse(fs.readFileSync(path.join(root,"data/research-scout/topics.json"),"utf8"));
const topicById=new Map((topicConfig.topics??[]).map(t=>[t.id,t]));
if(!repo||!token)throw new Error("GITHUB_REPOSITORY and GITHUB_TOKEN are required");
const runTimestamp=new Date().toISOString(); const runId=`MFTL-STEW-${runTimestamp.replace(/[^0-9]/g,"").slice(0,14)}`;
function clean(v=""){return String(v).replace(/\s+/g," ").trim()}
function slug(v){return clean(v).toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)}
function short(v){return crypto.createHash("sha256").update(v).digest("hex").slice(0,6).toUpperCase()}
async function jfetch(url,options={}){const r=await fetch(url,{...options,headers:{"accept":"application/json","user-agent":"rocksoul-mftl-steward/0.2",...(options.headers??{})},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error(`HTTP ${r.status} ${url}`);return r.json()}
function walk(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const existing=walk(path.join(root,"data")).filter(f=>f.endsWith(".json")).map(f=>{try{const x=JSON.parse(fs.readFileSync(f,"utf8"));return clean(x.name??x.identity?.canonical_name??x.title??"").toLowerCase()}catch{return""}}).filter(Boolean);
function meta(body,key){const matches=[...String(body).matchAll(new RegExp(`${key}:([^\\n]+)`,"g"))];return matches.at(-1)?.[1]?.trim()??null}
function valueLine(body,label){return String(body).match(new RegExp(`\\*\\*${label}:\\*\\* ([^\\n]+)`))?.[1]?.trim()??null}
function duplicate(title){const n=clean(title).toLowerCase();return existing.some(x=>x===n||x.includes(n)||n.includes(x))}
function decision(issue){
  const body=String(issue.body??""); const base=Number(meta(body,"AUTO-RESEARCH-SCORE")??0); const title=valueLine(body,"Title")??issue.title.replace(/^\[AUTO-RESEARCH\](?:\s+STORY\s+·)?\s*/,""); const locator=valueLine(body,"Locator");
  const dup=duplicate(title); let score=base+(locator&&locator!=="unknown"?10:0)-(dup?50:0); score=Math.max(0,Math.min(100,score));
  const action=dup?"duplicate":score>=65?"stage_candidate":score>=45?"needs_sources":"hold";
  const state=meta(body,"ROCKSOUL-RESEARCH-STATE")??meta(body,"AUTO-RESEARCH-STATE")??"discovered";
  return {title,locator,lane:meta(body,"AUTO-RESEARCH-LANE")??"unknown",score,duplicate:dup,action,state};
}
function candidate(issue,d){
  const id=`CAND-AUTO-${slug(d.lane)}-${short(d.title)}`; const now=new Date().toISOString(); const topic=topicById.get(d.lane)??{};
  return {schema_version:"candidate.v0.1",candidate_id:id,name:d.title,aliases:[],region:topic.region_hint==="global"?"Global / auto-discovery":topic.region_hint??"Global / auto-discovery",country:null,tradition:topic.tradition_hint??`Auto research lane: ${d.lane}`,candidate_type:topic.candidate_type??"research_lead",discovery:{summary:`Automatically discovered scholarly lead: ${d.title}`,why_relevant:`MFTL Steward score ${d.score}/100. This candidate remains a staging object until source content and claim-level evidence are inspected.`,discovered_at:now,search_terms:[d.lane,d.title]},sources:[{title:d.title,locator:d.locator??issue.html_url,source_type:"academic_metadata",authority:"discovery_only",notes:`Auto-staged from GitHub issue #${issue.number}; metadata discovery is not claim verification.`}],duplicate_check:{checked:true,possible_matches:[]},status:"needs_sources",notes:d.lane==="conspiracy-narrative"?"Conspiracy narrative guardrail: document provenance, evidence claims, counterevidence and transmission; do not treat popularity as proof.":"Auto-staged by MFTL Steward; canonical promotion requires stronger structured evidence."};
}
async function patchIssue(issue,{state,decisionLabel,score,duplicate:falseDup=false,close=false}){
  const marker="## MFTL Steward review"; let body=String(issue.body??"").split(marker)[0].trim();
  body+=`\n\n${marker}\n\n- **Steward score:** ${score}/100\n- **Duplicate:** ${falseDup}\n- **Decision:** ${decisionLabel}\n- **Reviewed at:** ${new Date().toISOString()}\n\nROCKSOUL-RESEARCH-STATE:${state}\nAUTO-RESEARCH-STATE:${decisionLabel}`;
  const [owner,name]=repo.split("/");
  await jfetch(`https://api.github.com/repos/${owner}/${name}/issues/${issue.number}`,{method:"PATCH",headers:{authorization:`Bearer ${token}`,"content-type":"application/json","x-github-api-version":"2022-11-28"},body:JSON.stringify({body,...(close?{state:"closed",state_reason:"not_planned"}:{})})});
}
function signal(issue,action,before,after,headline,nextGate,evidence=[]){return {run_id:runId,timestamp:new Date().toISOString(),slot:"story-history-bootstrap:STORY",action,domain:"STORY",repository:"rocksoul-mftl",headline,why_it_matters:"Advance existing STORY evidence before adding another discovery envelope; STORY remains narrative truth, not EVENT truth.",evidence_gain:action==="ADVANCED"||action==="STAGED"?10:0,cross_domain_value:0,novelty:action==="STAGED"?5:0,lifecycle_before:before,lifecycle_after:after,related_domains:[],relationship_handoff:null,next_gate:nextGate,evidence:[`issue:#${issue.number}`,...evidence]}}
const [owner,name]=repo.split("/");
const issues=await jfetch(`https://api.github.com/repos/${owner}/${name}/issues?state=open&per_page=100`,{headers:{authorization:`Bearer ${token}`,"x-github-api-version":"2022-11-28"}});
const researchIssues=issues.filter(i=>!i.pull_request&&i.title.startsWith("[AUTO-RESEARCH]"));
const evaluated=researchIssues.map(issue=>({issue,d:decision(issue)}));
const counts=countLifecycle(evaluated.map(({d})=>d.state));
const candidateCount=walk(path.join(root,"data/candidates")).filter(f=>f.endsWith(".json")).length;
const pressure=wipPressure({counts,candidateCount});
const ranked=rankResearchIssues(evaluated.map(({issue,d})=>({id:issue.number,state:d.state,evidenceGain:d.locator?10:0,noveltyValue:d.duplicate?0:8,issue,d})),{pressure});
let staged=0,reviewed=0,advanced=0; const signals=[];
for(const item of ranked){
  const {issue,d}=item; const currentState=d.state;
  if(currentState==="source_inspected"&&d.locator&&d.locator!=="unknown"&&!d.duplicate){
    await patchIssue(issue,{state:"ready_for_observation",decisionLabel:"advance_ready_for_observation",score:item.rps,duplicate:false}); reviewed++; advanced++;
    signals.push(signal(issue,"ADVANCED",currentState,"ready_for_observation",d.title,"SOURCE_SCOPED_STORY_OBSERVATION",[d.locator])); continue;
  }
  if(currentState!=="discovered"){
    reviewed++; const nextGate=currentState==="ready_for_observation"?"SOURCE_SCOPED_STORY_OBSERVATION":currentState==="needs_sources"?"SOURCE_INSPECTION":"EVIDENCE_GATE_REVIEW";
    signals.push(signal(issue,"BLOCKED",currentState,currentState,d.title,nextGate,d.locator?[d.locator]:[])); continue;
  }
  if(pressure.suppressDiscovery){signals.push(signal(issue,"NO_UPDATE",currentState,currentState,d.title,"PROGRESS_EXISTING_WIP",[`actionable:${pressure.actionable}`,`candidates:${pressure.candidateCount}`,`candidate_lag:${pressure.candidateLag}`]));continue}
  const issueState=d.action==="stage_candidate"?"needs_sources":d.action==="hold"?"triaged":d.action;
  await patchIssue(issue,{state:issueState,decisionLabel:d.action,score:item.rps,duplicate:d.duplicate,close:d.action==="duplicate"}); reviewed++;
  if(d.action==="stage_candidate"){
    const c=candidate(issue,d); const file=path.join(root,"data/candidates",`${c.candidate_id}.json`);
    if(!fs.existsSync(file)){fs.writeFileSync(file,JSON.stringify(c,null,2)+"\n");staged++;existing.push(clean(c.name).toLowerCase())}
    signals.push(signal(issue,"STAGED",currentState,"needs_sources",d.title,"SOURCE_INSPECTION",d.locator?[d.locator]:[]));
  }else signals.push(signal(issue,d.action==="duplicate"?"NO_UPDATE":"BLOCKED",currentState,issueState,d.title,issueState==="triaged"?"TRIAGE_REVIEW":"SOURCE_INSPECTION",d.locator?[d.locator]:[]));
}
console.log(JSON.stringify({schema_version:"rocksoul.research-signal-batch.v1",run_id:runId,signals},null,2));
console.log(`MFTL steward: reviewed=${reviewed} advanced=${advanced} staged=${staged} actionable=${pressure.actionable} discovery_suppressed=${pressure.suppressDiscovery}`);