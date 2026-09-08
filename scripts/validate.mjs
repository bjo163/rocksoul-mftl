import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const ajv = new Ajv2020({allErrors:true,strict:false});
addFormats(ajv);

function loadSchema(name) {
  return JSON.parse(fs.readFileSync(path.join(root,"schemas",name),"utf8"));
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry) => {
    const full = path.join(dir,entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const contracts = [
  {dir:"data/records",schema:"myth-record.schema.json",label:"myth records"},
  {dir:"data/candidates",schema:"discovery-candidate.schema.json",label:"discovery candidates"},
  {dir:"data/objects",schema:"mftl-record.schema.json",label:"general MFTL objects"},
  {dir:"data/entities",schema:"entity-record.schema.json",label:"entity records"},
  {dir:"data/claims",schema:"claim-record.schema.json",label:"claim records"},
  {dir:"data/sources",schema:"source-record.schema.json",label:"source records"},
  {dir:"data/evidence",schema:"evidence-record.schema.json",label:"evidence records"},\n  {dir:"data/drift",schema:"narrative-drift.schema.json",label:"narrative drift records"},\n  {dir:"data/benchmarks",schema:"epistemic-benchmark.schema.json",label:"epistemic benchmark records"}
];

let failed = false;
let total = 0;

for (const contract of contracts) {
  const validate = ajv.compile(loadSchema(contract.schema));
  const files = walk(path.join(root,contract.dir)).filter((file) => file.endsWith(".json"));
  let validCount = 0;

  for (const file of files) {
    total += 1;
    const relative = path.relative(root,file);
    let data;

    try {
      data = JSON.parse(fs.readFileSync(file,"utf8"));
    } catch (error) {
      failed = true;
      console.error("\nINVALID JSON:",relative);
      console.error(error);
      continue;
    }

    if (!validate(data)) {
      failed = true;
      console.error("\nINVALID:",relative);
      console.error(validate.errors);
    } else {
      validCount += 1;
      console.log("OK:",relative);
    }
  }

  console.log(`Validated ${validCount}/${files.length} ${contract.label}.`);
}

if (failed) process.exit(1);
console.log(`All ${total} JSON data object(s) passed schema validation.`);
