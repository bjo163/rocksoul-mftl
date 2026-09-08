import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root=process.cwd();
const source=fs.readFileSync(path.join(root,"apps/web/src/main.tsx"),"utf8");
const css=fs.readFileSync(path.join(root,"apps/web/src/style.css"),"utf8");

test("MFTL production visuals are served through Rocksoul assets",()=>{
  assert.match(source,/raw\.githubusercontent\.com\/bjo163\/rocksoul-assets\/7d924d5915364b222e1d1287e493f4b742e283a3\/moonwitness/);
  for(const pack of ["cinematic-hero","editorial","dashboard","data-viz","texture-material","correlation-semantics"]){
    assert.match(source,new RegExp(`pack=["']${pack}["']`),`missing Rocksoul asset pack ${pack}`);
  }
  assert.doesNotMatch(source,/<img\b/i,"use MoonWitnessAssetImage instead of raw img elements");
  assert.doesNotMatch(css,/url\(\s*["']?https?:\/\//i,"CSS must not load external visual assets");
});

test("observatory hero and research widgets use canonical Rocksoul files",()=>{
  for(const asset of [
    "svg/observatory-night.svg",
    "svg/data-matrix.svg",
    "svg/archive-dossier.svg",
    "widgets/world-map.svg",
    "widgets/evidence-timeline.svg",
    "charts/evidence-matrix.svg",
    "widgets/provenance-chain.svg",
    "widgets/correlation-insight.svg",
    "charts/node-link-correlation.svg",
  ]) assert.ok(source.includes(asset),`missing canonical asset ${asset}`);
});

test("primary research navigation has live targets",()=>{
  for(const id of ["explorer","observatory","benchmark","map","conspiracy","method"]){
    assert.ok(source.includes(`id="${id}"`),`missing navigation target #${id}`);
  }
});
