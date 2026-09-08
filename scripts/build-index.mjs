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
const claimRegistry=new Map(claimFiles.map(file=>{const x=read(file);return[x.id,x]}));
const sourceRegistry=new Map(sourceFiles.map(file=>{const x=read(file);return[x.id,x]}));
const evidenceRecords=evidenceFiles.map(read);
const candidates=candidateFiles.map(read);
const activeCandidates=candidates.filter(c=>c.status!=="merged"&&c.status!=="rejected");
const mergedCandidates=candidates.filter(c=>c.status==="merged");
const coverageIndex=safeRead(path.join(root,"data/indexes/coverage.json"),{regions:{},canonical_regions:{}});

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
const output={schema_version:"corpus-index.v0.4",generated_at:new Date().toISOString(),
  counts:{canonical_records:records.length,candidates:activeCandidates.length,merged_candidates:mergedCandidates.length,
    entities:entityFiles.length,claims:claimFiles.length,sources:sourceFiles.length,evidence:evidenceFiles.length,families:18,regions:regions.size},
  coverage:{regions:coverageIndex.regions??{},canonical_regions:coverageIndex.canonical_regions??{}},
  records:records.sort((a,b)=>a.title.localeCompare(b.title))
};
const outDir=path.join(root,"apps/web/public/data");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"corpus-index.json"),JSON.stringify(output,null,2)+"\n");
copyJson(path.join(root,"data/drift/JERUSALEM-MARK13-DRIFT-001.json"),path.join(outDir,"narrative-drift.json"));
copyJson(path.join(root,"data/benchmarks/epistemic-v0.1.json"),path.join(outDir,"epistemic-benchmark.json"));
console.log(`Generated corpus index v0.4: ${records.length} canonical, ${activeCandidates.length} active candidates, ${claimFiles.length} claims, ${evidenceFiles.length} evidence edges.`);
