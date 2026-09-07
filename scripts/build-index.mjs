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

const mythFiles = jsonFiles(path.join(root,"data/records"));
const generalFiles = jsonFiles(path.join(root,"data/objects"));
const sourceFiles = jsonFiles(path.join(root,"data/sources"));
const evidenceFiles = jsonFiles(path.join(root,"data/evidence"));
const candidateFiles = jsonFiles(path.join(root,"data/candidates"));

const records = [];

for (const file of mythFiles) {
  const data = read(file);
  records.push({
    id:data.id,
    title:data.identity?.canonical_name ?? data.id,
    family:"F01",
    record_type:data.identity?.record_type ?? "myth",
    region:data.geography?.origin?.region ?? data.geography?.origin?.country ?? null,
    status:data.quality?.record_status ?? "unknown",
    confidence:data.quality?.confidence ?? null
  });
}

for (const file of generalFiles) {
  const data = read(file);
  records.push({
    id:data.id,
    title:data.title,
    family:data.family,
    record_type:data.record_type,
    region:data.geography?.region ?? data.geography?.country ?? null,
    status:data.status,
    confidence:data.confidence ?? null
  });
}

const regions = new Set(records.map((record) => record.region).filter(Boolean));
const output = {
  schema_version:"corpus-index.v0.1",
  generated_at:new Date().toISOString(),
  counts:{
    canonical_records:records.length,
    candidates:candidateFiles.length,
    sources:sourceFiles.length,
    evidence:evidenceFiles.length,
    families:18,
    regions:regions.size
  },
  records:records.sort((a,b) => a.title.localeCompare(b.title))
};

const outDir = path.join(root,"apps/web/public/data");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"corpus-index.json"),JSON.stringify(output,null,2)+"\n");
console.log(`Generated corpus index with ${records.length} canonical record(s).`);
