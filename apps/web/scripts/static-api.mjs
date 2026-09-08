import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const publicRoot=path.join(root,"public");
const corpus=JSON.parse(fs.readFileSync(path.join(publicRoot,"data","corpus-index.json"),"utf8"));
const drift=readOptional(path.join(publicRoot,"data","narrative-drift.json"),null);
const benchmark=readOptional(path.join(publicRoot,"data","epistemic-benchmark.json"),null);
const apiRoot=path.join(publicRoot,"api","v1");

fs.rmSync(apiRoot,{recursive:true,force:true});
fs.mkdirSync(apiRoot,{recursive:true});

function readOptional(file,fallback){try{return JSON.parse(fs.readFileSync(file,"utf8"));}catch{return fallback}}
function write(rel,data){
  const file=path.join(apiRoot,rel);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify(data,null,2)+"\n");
}
function qref(id){return `mftl:${id}`}
function uniqueById(items){return [...new Map(items.filter(Boolean).map(item=>[item.id,item])).values()]}

const records=(corpus.records??[]).map(record=>({...record,qualified_ref:qref(record.id)}));
const claims=uniqueById(records.flatMap(record=>(record.detail?.claims??[]).map(claim=>({...claim,record_id:record.id,qualified_ref:qref(claim.id)}))));
const sources=uniqueById(records.flatMap(record=>(record.detail?.sources??[]).map(source=>({...source,record_id:record.id,qualified_ref:qref(source.id)}))));
const evidence=uniqueById(records.flatMap(record=>(record.detail?.evidence??[]).map(edge=>({...edge,record_id:record.id,qualified_ref:qref(edge.id)}))));

function changeConditions(claim){
  const type=String(claim.claim_type??"").toLowerCase();
  if(type.includes("chronology")) return [
    "A securely dated manuscript or source that materially shifts the proposed composition window.",
    "Stronger redaction or provenance evidence that changes the text-to-event chronology."
  ];
  if(type.includes("historical_comparison")) return [
    "Independent evidence showing that the compared event is materially different from the event described by the narrative.",
    "Chronology or provenance evidence that makes the proposed correspondence substantially weaker."
  ];
  if(type.includes("supernatural")) return [
    "Independent evidence capable of testing the empirical proposition; textual attestation alone cannot establish occurrence.",
    "Evidence that the cited wording or narrative reconstruction is materially mistranslated, interpolated, or misattributed."
  ];
  if(type.includes("textual")) return [
    "A stronger textual witness that materially changes the wording, attribution, or passage identity.",
    "Provenance evidence showing the cited text does not support the extracted proposition."
  ];
  return [
    "Direct counterevidence from a source of equal or higher authority.",
    "A provenance correction that changes the source basis, subject identity, or meaning of the claim."
  ];
}

function alternativesFor(claim){
  const type=String(claim.claim_type??"").toLowerCase();
  if(type.includes("historical_comparison")) return ["correspondence without causation","post-event framing or redaction","shared historical context"];
  if(type.includes("chronology")) return ["earlier composition","later composition","multi-stage redaction/transmission"];
  if(type.includes("supernatural")) return ["literary or ritual narrative","symbolic interpretation","not empirically testable from textual attestation alone"];
  return [];
}

const challenges=claims.map(claim=>{
  const related=evidence.filter(edge=>edge.target_id===claim.id);
  const support=related.filter(edge=>["supports","contextualizes"].includes(edge.stance));
  const counter=related.filter(edge=>["contradicts","weakens","counterevidence"].includes(edge.stance));
  return {
    schema_version:"claim-challenge.v0.1",
    claim_id:claim.id,
    qualified_ref:qref(claim.id),
    record_id:claim.record_id,
    current_epistemic_status:claim.epistemic_status??null,
    support,
    counterevidence:counter,
    strongest_counterevidence:counter.sort((a,b)=>(b.confidence??0)-(a.confidence??0))[0]??null,
    alternative_explanations:alternativesFor(claim),
    what_would_change_this:changeConditions(claim),
    guardrail:"Absence of counterevidence is not proof of truth; challenge output is a review aid, not a verdict."
  };
});

const search=[
  ...records.map(x=>({type:"record",id:x.id,qualified_ref:x.qualified_ref,title:x.title,text:[x.title,x.record_type,x.region,x.detail?.tradition,x.detail?.summary].filter(Boolean).join(" ")})),
  ...claims.map(x=>({type:"claim",id:x.id,qualified_ref:x.qualified_ref,title:x.predicate??x.id,text:[x.subject,x.predicate,x.object,x.claim_type,x.epistemic_status].filter(Boolean).join(" ")})),
  ...sources.map(x=>({type:"source",id:x.id,qualified_ref:x.qualified_ref,title:x.title??x.id,text:[x.title,x.source_type,x.author,x.creator].filter(Boolean).join(" ")}))
];

write("manifest.json",{
  api_version:"v1",
  service:"rocksoul-mftl",
  domain:"STORY",
  generated_at:new Date().toISOString(),
  ownership:"MFTL exposes canonical STORY-domain records. Cross-domain relationships belong to rocksoul-correlation.",
  endpoints:["records","claims","sources","evidence","search","challenges","drift","benchmark"]
});
write("records/index.json",{data:records});
records.forEach(item=>write(`records/${item.id}.json`,{data:item}));
write("claims/index.json",{data:claims});
claims.forEach(item=>write(`claims/${item.id}.json`,{data:item}));
write("sources/index.json",{data:sources});
sources.forEach(item=>write(`sources/${item.id}.json`,{data:item}));
write("evidence/index.json",{data:evidence});
evidence.forEach(item=>write(`evidence/${item.id}.json`,{data:item}));
write("search/index.json",{data:search});
write("challenges/index.json",{data:challenges});
challenges.forEach(item=>write(`challenges/${item.claim_id}.json`,{data:item}));
write("drift/index.json",{data:drift?[drift]:[]});
if(drift) write(`drift/${drift.id}.json`,{data:drift});
write("benchmark.json",{data:benchmark});

console.log(`Generated MFTL public API: ${records.length} records, ${claims.length} claims, ${sources.length} sources, ${evidence.length} evidence edges.`);
