import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const workflowDir = path.join(root, ".github/workflows");
const workflowFiles = fs.readdirSync(workflowDir).filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"));
const validateWorkflow = fs.readFileSync(path.join(workflowDir, "validate.yml"), "utf8");
const branching = fs.readFileSync(path.join(root, "docs/BRANCHING.md"), "utf8");
const automation = fs.readFileSync(path.join(root, "docs/AUTOMATION.md"), "utf8");

test("repository keeps one simple GitHub Actions workflow", () => {
  assert.deepEqual(workflowFiles.sort(), ["validate.yml"]);
  assert.match(validateWorkflow, /branches:\s*\[main\]/);
  assert.match(validateWorkflow, /npm run ci/);
});

test("main-only and issue-first research contracts stay explicit", () => {
  assert.match(branching, /main.*single canonical remote working branch/i);
  assert.match(automation, /issue-first/i);
  assert.match(automation, /does not directly write or canonicalize corpus data/i);
  assert.match(automation, /\.github\/workflows\/validate\.yml.*single repository workflow/i);
});

test("legacy research helper scripts remain syntactically valid utilities", () => {
  for (const file of ["scripts/research-scout.mjs", "scripts/research-intake.mjs", "scripts/research-steward.mjs"]) {
    execFileSync(process.execPath, ["--check", path.join(root, file)], { stdio: "pipe" });
  }
});
