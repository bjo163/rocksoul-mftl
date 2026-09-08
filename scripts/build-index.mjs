import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry) => {
    const full = path.join(dir,entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function jsonFiles(dir) {
  return walk(dir).filter((file) => file.endsWith(".json") && !file.split(path.sep).some((part) => part.startsWith("_")));
}

function read(file) {
  return JSON.parse(fs.readFileSync(file,"utf8"));
}

function safeRead(file, fallback) {
  try { return read(file); } catch { return fallback; }
}

const mythFiles = jsonFiles(path.join(root,"data/records"));
const generalFiles = jsonFiles(path.join(root,"data/objects"));
const entityFiles = jsonFiles(path.join(root,"data/entities"));
const claimFiles = jsonFiles(path.join(root,"data/claims"));
const sourceFiles = jsonFiles(path.join(root,"data/sources"));
const evidenceFiles = jsonFiles(path.join(root,"data/evidence"));
const candidateFiles = jsonFiles(path.join(root,"data/candidates"));
const evidenceRecords = evidenceFiles.map(read);
const candidates = candidateFiles.map(read);
const activeCandidates = candidates.filter((candidate) => candidate.status !== "merged" && candidate.status !== "rejected");
const mergedCandidates = candidates.filter((candidate) => candidate.status === "merged");
const coverageIndex = safeRead(path.join(root,"data/indexes/coverage.json"), { regions:{}, canonical_regions:{} });

const records = [];

for (const file of mythFiles) {
  const data = read(file);
  const claims = (data.claims ?? []).map((claim) => ({
    id:claim.id,
    subject:claim.subject ?? null,
    predicate:claim.predicate ?? null,
    object:claim.object ?? null,
    claim_type:claim.claim_type ?? null,
    source_basis:claim.source_basis ?? [],
    confidence:claim.confidence ?? null
  }));
  const claimIds = new Set(claims.map((claim) => claim.id));
  const evidence = evidenceRecords
    .filter((edge) => claimIds.has(edge.target_id))
    .map((edge) => ({
      id:edge.id,
      target_id:edge.target_id,
      source_id:edge.source_id,
      stance:edge.stance,
      evidence_type:edge.evidence_type,
      locator:edge.locator ?? null,
      summary:edge.summary ?? null,
      confidence:edge.confidence ?? null,
      status:edge.status ?? null
    }));
  records.push({
    id:data.id,
    title:data.identity?.canonical_name ?? data.id,
    family:"F01",
    record_type:data.identity?.record_type ?? "myth",
    region:data.geography?.origin?.region ?? data.geography?.origin?.country ?? null,
    status:data.quality?.record_status ?? "unknown",
    confidence:data.quality?.confidence ?? null,
    detail:{
      summary:data.narrative?.summary ?? null,
      long_description:data.narrative?.long_description ?? null,
      tradition:data.classification?.tradition ?? null,
      earliest_attestation:data.time?.earliest_attestation?.value ?? null,
      entities:(data.entities ?? []).map((entity) => ({
        id:entity.entity_id ?? entity.id,
        name:entity.name,
        entity_type:entity.entity_type ?? null,
        roles:entity.roles ?? []
      })),
      claims,
      sources:(data.sources ?? []).map((source) => ({
        id:source.id,
        title:source.title,
        source_type:source.source_type ?? null,
        primary_source:Boolean(source.primary_source),
        locator:source.locator ?? null,
        author:source.author ?? null,
        date:source.date ?? null
      })),
      evidence
    }
  });
}

for (const file of generalFiles) {
  const data = read(file);
  records.push({
    id:data.id,
    title:data.title ?? data.name ?? data.id,
    family:data.family ?? "F00",
    record_type:data.record_type ?? "record",
    region:data.geography?.region ?? data.geography?.country ?? null,
    status:data.status ?? "unknown",
    confidence:data.confidence ?? null,
    detail:{
      summary:data.summary ?? data.description ?? null,
      long_description:data.long_description ?? null,
      tradition:data.tradition ?? null,
      earliest_attestation:null,
      entities:[],
      claims:[],
      sources:[],
      evidence:[]
    }
  });
}

const regions = new Set(records.map((record) => record.region).filter(Boolean));
const output = {
  schema_version:"corpus-index.v0.3",
  generated_at:new Date().toISOString(),
  counts:{
    canonical_records:records.length,
    candidates:activeCandidates.length,
    merged_candidates:mergedCandidates.length,
    entities:entityFiles.length,
    claims:claimFiles.length,
    sources:sourceFiles.length,
    evidence:evidenceFiles.length,
    families:18,
    regions:regions.size
  },
  coverage:{
    regions:coverageIndex.regions ?? {},
    canonical_regions:coverageIndex.canonical_regions ?? {}
  },
  records:records.sort((a,b) => a.title.localeCompare(b.title))
};

const outDir = path.join(root,"apps/web/public/data");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"corpus-index.json"),JSON.stringify(output,null,2)+"\n");
console.log(`Generated corpus index v0.3: ${records.length} canonical, ${activeCandidates.length} active candidates, ${claimFiles.length} claims, ${evidenceFiles.length} evidence edges.`);
