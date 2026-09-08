import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const workflowDir=path.join(root,".github/workflows");
const workflowFiles=fs.readdirSync(workflowDir).filter(name=>/\.ya?ml$/.test(name)).sort();
const validateWorkflow=fs.readFileSync(path.join(workflowDir,"validate.yml"),"utf8");
const branching=fs.readFileSync(path.join(root,"docs/BRANCHING.md"),"utf8");
const automation=fs.readFileSync(path.join(root,"docs/AUTOMATION.md"),"utf8");

test("main is the single working branch",()=>{
  assert.match(validateWorkflow,/branches:\s*\[main\]/);
  assert.doesNotMatch(validateWorkflow,/\bdev\b/);
  assert.match(branching,/single working branch/i);
  assert.doesNotMatch(branching,/dev.*integration/i);
});

test("research is issue-first and does not auto-canonicalize",()=>{
  assert.match(automation,/CREATE \/ UPDATE \[RESEARCH\] ISSUE/);
  assert.match(automation,/does \*\*not\*\* directly add, stage, or canonicalize corpus research data/i);
  assert.match(automation,/authoritative primary, academic, museum, library, archive, or institutional sources/i);
});

test("workflow surface is validation only",()=>{
  assert.deepEqual(workflowFiles,["validate.yml"]);
});


test("generic research issue lifecycle maps deterministic Steward decisions",()=>{
  const steward=fs.readFileSync(path.join(process.cwd(),"scripts/research-steward.mjs"),"utf8");
  assert.match(steward,/stage_candidate[^\n]+needs_sources/);
  assert.match(steward,/hold[^\n]+triaged/);
  assert.match(steward,/ROCKSOUL-RESEARCH-STATE/);
  assert.match(steward,/state_reason[^\n]+not_planned/);
});
