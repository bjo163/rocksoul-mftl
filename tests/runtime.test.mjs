import assert from "node:assert/strict";
import test from "node:test";
import {createMftlServer} from "../src/server.mjs";
import {getBenchmark,getChallenge,getDrift,getRecord,search} from "../src/runtime.mjs";

test("public API resolves canonical STORY records",()=>{
  const item=getRecord("MYTH-JERUSALEM-TEMPLE-DESTRUCTION-PROPHECY-000001");
  assert.ok(item);
  assert.equal(item.qualified_ref,"mftl:MYTH-JERUSALEM-TEMPLE-DESTRUCTION-PROPHECY-000001");
  assert.ok(item.detail.claims.length>=3);
});
test("claim challenge makes falsification criteria inspectable",()=>{
  const item=getChallenge("CLAIM-JERUSALEM-MARK13-003");
  assert.ok(item);
  assert.ok(item.what_would_change_this.length>=2);
  assert.equal(item.guardrail.includes("not a verdict"),true);
});
test("narrative drift and epistemic benchmark are machine-readable",()=>{
  const drift=getDrift("DRIFT-JERUSALEM-MARK13-001");
  assert.equal(drift.stages.length,4);
  const benchmark=getBenchmark();
  assert.equal(benchmark.target_slots,25);
  assert.equal(benchmark.slots.length,25);
});
test("search spans record claim and source projections",()=>{
  const results=search("Mark 13");
  assert.ok(results.some(x=>x.type==="record"));
  assert.ok(results.some(x=>x.type==="source"));
});
test("HTTP runtime preserves read-only boundary",async()=>{
  const server=createMftlServer();
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const {port}=server.address();
  try{
    let r=await fetch(`http://127.0.0.1:${port}/api/v1/records/MYTH-MES-INANA-DESCENT-000001`);
    assert.equal(r.status,200);
    r=await fetch(`http://127.0.0.1:${port}/api/v1/claims/CLAIM-JERUSALEM-MARK13-003/challenge`);
    assert.equal(r.status,200);
    r=await fetch(`http://127.0.0.1:${port}/api/v1/records`,{method:"POST"});
    assert.equal(r.status,405);
  }finally{await new Promise(resolve=>server.close(resolve))}
});
