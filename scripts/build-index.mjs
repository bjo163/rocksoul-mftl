import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function walk(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const f=path.join(dir,e.name);return e.isDirectory()?walk(f):[f]})}
function jsonFiles(dir){return walk(dir).filter(file=>file.endsWith(".json")&&!file.split(path.sep).some(part=>part.startsWith("_")))}
function read(file){return JSON.parse(fs.readFileSync(file,"utf8"))}
function safeRead(file,fallback){try{return read(file)}catch{return fallback}}
function copyJson(source,target){if(!fs.existsSync(source))return;fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target)}

const mythFiles=jsonFiles(path.join(root,"data/records"));
const generalFiles=jsonFiles(path.join(root,"data/objects"));
const entityFiles=jsonFiles(path.join(root,"data/entities"));
const claimFiles=jsonFiles(path.join(root,"data/claims"));
const sourceFiles=jsonFiles(path.join(root,"data/sources"));
const evidenceFiles=jsonFiles(path.join(root,"data/evidence"));
const candidateFiles=jsonFiles(path.join(root,"data/candidates"));
const mythRecords=mythFiles.map(read);
const claimRegistry=new Map(claimFiles.map(file=>{const x=read(file);return[x.id,x]}));
const sourceRegistry=new Map(sourceFiles.map(file=>{const x=read(file);return[x.id,x]}));
const evidenceRecords=evidenceFiles.map(read);
const candidates=candidateFiles.map(read);
const activeCandidates=candidates.filter(c=>c.status!=="merged"&&c.status!=="rejected");
const mergedCandidates=candidates.filter(c=>c.status==="merged");
const coverageIndex=safeRead(path.join(root,"data/indexes/coverage.json"),{regions:{},canonical_regions:{}});
const benchmark=safeRead(path.join(root,"data/benchmarks/epistemic-v0.1.json"),{slots:[],target_slots:25});
const scoutConfig=safeRead(path.join(root,"data/research-scout/topics.json"),{topics:[]});
const driftRecords=jsonFiles(path.join(root,"data/drift")).map(read);

const records=[];
for(const file of mythFiles){
  const data=read(file);
  const claims=(data.claims??[]).map(raw=>{
    const canonical=claimRegistry.get(raw.id)??{};
    return {
      id:raw.id,subject:raw.subject??canonical.subject??null,predicate:raw.predicate??canonical.predicate??null,
      object:raw.object??canonical.object??null,claim_type:raw.claim_type??canonical.claim_type??null,
      source_basis:raw.source_basis??canonical.source_basis??[],evidence_ids:canonical.evidence_ids??[],
      epistemic_status:canonical.epistemic_status??null,confidence:raw.confidence??canonical.confidence??null,
      notes:canonical.notes??null
    };
  });
  const ids=new Set(claims.map(c=>c.id));
  const evidence=evidenceRecords.filter(e=>ids.has(e.target_id)).map(e=>({
    id:e.id,target_id:e.target_id,source_id:e.source_id,stance:e.stance,evidence_type:e.evidence_type,
    locator:e.locator??null,summary:e.summary??null,analysis:e.analysis??null,confidence:e.confidence??null,status:e.status??null
  }));
  const sources=(data.sources??[]).map(raw=>{
    const canonical=sourceRegistry.get(raw.id)??{};
    return {
      id:raw.id,title:raw.title??canonical.title??raw.id,source_type:raw.source_type??canonical.source_type??null,
      primary_source:Boolean(raw.primary_source??canonical.authority==="primary"),locator:raw.locator??canonical.locators?.find(x=>x.type==="url")?.value??null,
      author:raw.author??canonical.creator??null,date:raw.date??canonical.date??null,authority:canonical.authority??null,
      reliability:canonical.reliability??null,locators:canonical.locators??[]
    };
  });
  records.push({
    id:data.id,qualified_ref:`mftl:${data.id}`,title:data.identity?.canonical_name??data.id,family:"F01",
    record_type:data.identity?.record_type??"myth",region:data.geography?.origin?.region??data.geography?.origin?.country??null,
    status:data.quality?.record_status??"unknown",confidence:data.quality?.confidence??null,
    detail:{summary:data.narrative?.summary??null,long_description:data.narrative?.long_description??null,
      tradition:data.classification?.tradition??null,earliest_attestation:data.time?.earliest_attestation?.value??null,
      entities:(data.entities??[]).map(e=>({id:e.entity_id??e.id,name:e.name,entity_type:e.entity_type??null,roles:e.roles??[]})),
      claims,sources,evidence}
  });
}
for(const file of generalFiles){
  const data=read(file);
  records.push({id:data.id,qualified_ref:`mftl:${data.id}`,title:data.title??data.name??data.id,family:data.family??"F00",
    record_type:data.record_type??"record",region:data.geography?.region??data.geography?.country??null,status:data.status??"unknown",
    confidence:data.confidence??null,detail:{summary:data.summary??data.description??null,long_description:data.long_description??null,
      tradition:data.tradition??null,earliest_attestation:null,entities:[],claims:[],sources:[],evidence:[]}})
}
const regions=new Set(records.map(r=>r.region).filter(Boolean));
function countBy(items,keyFn){
  const out={};
  for(const item of items){const key=keyFn(item)??"unknown";out[key]=(out[key]??0)+1}
  return out;
}
const claimRecords=[...claimRegistry.values()];
const sourceRecords=[...sourceRegistry.values()];
const avgReliability=sourceRecords.map(s=>s.reliability?.score).filter(v=>typeof v==="number");
const evidenceLinkedClaims=claimRecords.filter(c=>(c.evidence_ids??[]).length>0).length;
const sourceLocated=sourceRecords.filter(s=>(s.locators??[]).length>0).length;
const benchmarkStatus=countBy(benchmark.slots??[],slot=>slot.status);
const driftRisks=countBy(driftRecords.flatMap(d=>d.drift_observations??[]),x=>x.risk);
const analytics={
  candidate_pipeline:countBy(candidates,c=>c.status),
  candidate_types:countBy(activeCandidates,c=>c.candidate_type??"unknown"),
  claim_epistemic:countBy(claimRecords,c=>c.epistemic_status??"unknown"),
  claim_types:countBy(claimRecords,c=>c.claim_type??"unknown"),
  claim_confidence:{
    high:claimRecords.filter(c=>(c.confidence??0)>=0.85).length,
    medium:claimRecords.filter(c=>(c.confidence??0)>=0.6&&(c.confidence??0)<0.85).length,
    low:claimRecords.filter(c=>(c.confidence??0)<0.6).length
  },
  evidence_stance:countBy(evidenceRecords,e=>e.stance??"unknown"),
  evidence_types:countBy(evidenceRecords,e=>e.evidence_type??"unknown"),
  source_authority:countBy(sourceRecords,s=>s.authority??"unknown"),
  source_types:countBy(sourceRecords,s=>s.source_type??"unknown"),
  source_reliability_average:avgReliability.length?avgReliability.reduce((a,b)=>a+b,0)/avgReliability.length:null,
  provenance_completeness:{
    claims_with_evidence:evidenceLinkedClaims,
    claims_total:claimRecords.length,
    sources_with_locators:sourceLocated,
    sources_total:sourceRecords.length,
    canonical_records_with_claims:records.filter(r=>(r.detail?.claims??[]).length>0).length,
    canonical_records_total:records.length
  },
  benchmark:{
    target:benchmark.target_slots??25,
    status:benchmarkStatus,
    canonical:benchmarkStatus.canonical??0,
    candidate:benchmarkStatus.candidate??0,
    research_issue:benchmarkStatus.research_issue??0
  },
  drift:{
    records:driftRecords.length,
    risks:driftRisks
  },
  automation:{
    steward:"MFTL Steward",
    schedule:"daily 09:17 Asia/Jakarta",
    parallel_lanes:(scoutConfig.topics??[]).map(t=>({id:t.id,candidate_type:t.candidate_type}))
  }
};


const regionCentroids=[
  ["Polynesia / Hawai",20.8,-156.3],["Polynesia / Aotearoa",-41.0,174.0],["Southeast Asia / Bali",-8.4,115.2],
  ["Africa / West and Central Africa",5.0,10.0],["East Asia / Japan",36.0,138.0],["Mesoamerica / Maya highlands",15.2,-91.0],
  ["Middle East / Mesopotamia",32.5,44.0],["Mesopotamia / Sumer",32.5,44.0],["East Asia / China",35.0,103.0],
  ["South Asia / India",22.0,79.0],["Oceania / Australia",-25.0,134.0],["Arctic / Inuit regions",67.0,-100.0],
  ["Europe / Ireland",53.0,-8.0],["Europe / Finland and Karelia",63.0,30.0],["Central Asia / Kyrgyzstan",41.0,75.0],
  ["North Asia / Sakha",66.0,129.0],["Southeast Asia / Philippines",16.8,121.0],["South America / Colombia",4.7,-74.1],
  ["Jerusalem / Roman Judaea",31.78,35.23]
];
function centroidFor(region){
  const hit=regionCentroids.find(([label])=>String(region??"").includes(label));
  return hit?{lat:hit[1],lon:hit[2]}:null;
}
const coveragePoints=[
  ...mythRecords.map(data=>{
    const origin=data.geography?.origin??{};
    const fallback=centroidFor(origin.region??origin.country);
    return {id:data.id,label:data.identity?.canonical_name??data.id,kind:"canonical",region:origin.region??origin.country??"unknown",
      lat:origin.lat??fallback?.lat??0,lon:origin.lon??fallback?.lon??0,estimated:origin.lat==null||origin.lon==null};
  }),
  ...activeCandidates.map(c=>{
    const fallback=centroidFor(c.region);
    return {id:c.candidate_id,label:c.name,kind:"candidate",region:c.region,lat:fallback?.lat??0,lon:fallback?.lon??0,estimated:true,status:c.status};
  }).filter(p=>p.lat!==0||p.lon!==0)
];

const qualifiedRefPattern=/\b(mftl|legend|superhero|rgbl|aws):[A-Za-z0-9][A-Za-z0-9:._\/-]*/g;
const crossRefMap=new Map();
for(const data of mythRecords){
  for(const match of JSON.stringify(data).matchAll(qualifiedRefPattern)){
    const ref=match[0];
    if(!crossRefMap.has(ref))crossRefMap.set(ref,{ref,domain:ref.split(":")[0],source_record_id:data.id});
  }
}
const crossRepoRefs=[...crossRefMap.values()].sort((a,b)=>a.domain.localeCompare(b.domain)||a.ref.localeCompare(b.ref));

const freshnessEvents=[];
function addFreshness(type,id,label,date){
  if(!date||Number.isNaN(Date.parse(date)))return;
  freshnessEvents.push({type,id,label,date});
}
for(const data of mythRecords){
  addFreshness("canonical_record",data.id,data.identity?.canonical_name??data.id,data.metadata?.updated_at);
  addFreshness("research_run",data.id,data.identity?.canonical_name??data.id,data.metadata?.last_research_run);
}
for(const c of candidates)addFreshness("candidate",c.candidate_id,c.name,c.discovery?.discovered_at);
for(const s of sourceRecords)addFreshness("source",s.id,s.title,s.metadata?.updated_at);
for(const c of claimRecords)addFreshness("claim",c.id,c.predicate,c.metadata?.updated_at);
for(const e of evidenceRecords)addFreshness("evidence",e.id,e.summary,e.metadata?.updated_at);
freshnessEvents.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
const now=Date.now();
for(const item of freshnessEvents)item.age_days=Math.max(0,Math.floor((now-Date.parse(item.date))/86400000));

const velocityByDate={};
for(const item of freshnessEvents){
  const date=item.date.slice(0,10);
  const row=velocityByDate[date]??={date,total:0,types:{}};
  row.total+=1;
  row.types[item.type]=(row.types[item.type]??0)+1;
  velocityByDate[date]=row;
}
const researchVelocity=Object.values(velocityByDate).sort((a,b)=>a.date.localeCompare(b.date));
const benchmarkSlots=(benchmark.slots??[]).map(slot=>({id:slot.id,status:slot.status,ref:slot.ref,failure_mode:slot.failure_mode}));
const researchQueue=activeCandidates.map(c=>({
  id:c.candidate_id,name:c.name,status:c.status,region:c.region,candidate_type:c.candidate_type??"unknown",
  source_count:(c.sources??[]).length,authorities:[...new Set((c.sources??[]).map(s=>s.authority??"unknown"))],
  discovered_at:c.discovery?.discovered_at??null
})).sort((a,b)=>String(b.discovered_at??"").localeCompare(String(a.discovered_at??"")));
const conspiracyLane=(scoutConfig.topics??[]).find(t=>t.id==="conspiracy-narrative")??null;
const conspiracyCandidates=candidates.filter(c=>/conspir/i.test(String(c.candidate_type??""))||/conspir/i.test(String(c.tradition??"")));
const confidenceDistribution={
  "0–59":claimRecords.filter(c=>(c.confidence??0)<0.6).length,
  "60–84":claimRecords.filter(c=>(c.confidence??0)>=0.6&&(c.confidence??0)<0.85).length,
  "85–94":claimRecords.filter(c=>(c.confidence??0)>=0.85&&(c.confidence??0)<0.95).length,
  "95–100":claimRecords.filter(c=>(c.confidence??0)>=0.95).length
};
analytics.observatory={
  benchmark_slots:benchmarkSlots,
  drift_records:driftRecords,
  research_queue:researchQueue,
  coverage_points:coveragePoints,
  freshness_events:freshnessEvents.slice(0,60),
  research_velocity:researchVelocity,
  cross_repo_refs:crossRepoRefs,
  conspiracy:{
    integrity_code:"E17",
    lane_active:Boolean(conspiracyLane),
    lane:conspiracyLane,
    staged_candidates:conspiracyCandidates.map(c=>({id:c.candidate_id,name:c.name,status:c.status,region:c.region}))
  },
  confidence_distribution:confidenceDistribution
};

const output={schema_version:"corpus-index.v0.5",generated_at:new Date().toISOString(),
  counts:{canonical_records:records.length,candidates:activeCandidates.length,merged_candidates:mergedCandidates.length,
    entities:entityFiles.length,claims:claimFiles.length,sources:sourceFiles.length,evidence:evidenceFiles.length,families:18,regions:regions.size},
  coverage:{regions:coverageIndex.regions??{},canonical_regions:coverageIndex.canonical_regions??{}},
  analytics,
  records:records.sort((a,b)=>a.title.localeCompare(b.title))
};
const outDir=path.join(root,"apps/web/public/data");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"corpus-index.json"),JSON.stringify(output,null,2)+"\n");
copyJson(path.join(root,"data/drift/JERUSALEM-MARK13-DRIFT-001.json"),path.join(outDir,"narrative-drift.json"));
copyJson(path.join(root,"data/benchmarks/epistemic-v0.1.json"),path.join(outDir,"epistemic-benchmark.json"));
console.log(`Generated corpus index v0.5: ${records.length} canonical, ${activeCandidates.length} active candidates, ${claimFiles.length} claims, ${evidenceFiles.length} evidence edges.`);
