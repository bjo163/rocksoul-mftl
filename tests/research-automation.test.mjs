import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const topics=JSON.parse(fs.readFileSync(path.join(root,"data/research-scout/topics.json"),"utf8"));
const integrity=JSON.parse(fs.readFileSync(path.join(root,"taxonomy/narrative-integrity.json"),"utf8"));
const workflow=fs.readFileSync(path.join(root,".github/workflows/research-scout.yml"),"utf8");
const scout=fs.readFileSync(path.join(root,"scripts/research-scout.mjs"),"utf8");
const steward=fs.readFileSync(path.join(root,"scripts/research-steward.mjs"),"utf8");

test("seven research lanes run in parallel and conspiracy is first-class",()=>{
  assert.equal(topics.topics.length,7);
  assert.ok(topics.topics.some(x=>x.candidate_type==="conspiracy_narrative"));
  assert.ok(integrity.distortions.some(x=>x.key==="conspiracy_narrative"));
  assert.match(workflow,/matrix:/); assert.match(workflow,/conspiracy-narrative/);
});
test("scout is discovery-first and steward stages non-canonical candidates",()=>{
  assert.match(scout,/\[AUTO-RESEARCH\]/);
  assert.match(steward,/status:"needs_sources"/);
  assert.doesNotMatch(steward,/data\/records/);
  assert.match(steward,/canonical promotion requires stronger structured evidence/i);
});
test("automation can write issues and vetted candidate staging only",()=>{
  assert.match(workflow,/issues: write/); assert.match(workflow,/contents: write/);
  assert.match(workflow,/npm run ci/);
});

test("automation scripts are syntactically valid",()=>{\n  for(const file of ["scripts/research-scout.mjs","scripts/research-intake.mjs","scripts/research-steward.mjs"]){\n    execFileSync(process.execPath,["--check",path.join(root,file)],{stdio:"pipe"});\n  }\n});\n