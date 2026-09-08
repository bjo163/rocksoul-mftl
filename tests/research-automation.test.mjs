import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const workflowDir=path.join(root,".github/workflows");
const workflowFiles=fs.readdirSync(workflowDir).filter(name=>/\.ya?ml$/.test(name)).sort();
const validateWorkflow=fs.readFileSync(path.join(workflowDir,"validate.yml"),"utf8");
const researchWorkflow=fs.readFileSync(path.join(workflowDir,"research-scout.yml"),"utf8");
const branching=fs.readFileSync(path.join(root,"docs/BRANCHING.md"),"utf8");
const automation=fs.readFileSync(path.join(root,"docs/AUTOMATION.md"),"utf8");

test("dev integrates and main remains stable release source",()=>{
  assert.match(validateWorkflow,/branches:\s*\[main, dev\]/);
  assert.match(branching,/dev.*integration/i);
  assert.match(branching,/main.*stable/i);
});
test("autonomous research is parallel and Steward promotes only after CI",()=>{
  assert.match(researchWorkflow,/matrix:/);
  assert.match(researchWorkflow,/conspiracy-narrative/);
  assert.match(researchWorkflow,/Automatic Steward review/);
  assert.match(researchWorkflow,/npm run ci/);
  assert.match(researchWorkflow,/git push origin HEAD:main/);
  assert.match(automation,/needs_sources/);
});
test("research helper scripts remain syntactically valid",()=>{
  for(const file of ["scripts/research-scout.mjs","scripts/research-intake.mjs","scripts/research-steward.mjs"]){
    execFileSync(process.execPath,["--check",path.join(root,file)],{stdio:"pipe"});
  }
});
test("workflow surface includes validation and autonomous research",()=>{
  assert.deepEqual(workflowFiles,["research-scout.yml","validate.yml"]);
});
