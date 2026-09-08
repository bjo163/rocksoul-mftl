import fs from "node:fs";
import path from "node:path";
const root=path.resolve(process.cwd(),"apps/web/public/api/v1");
function read(rel){return JSON.parse(fs.readFileSync(path.join(root,rel),"utf8")).data}
function maybe(rel){try{return read(rel)}catch{return null}}
export const listRecords=()=>read("records/index.json");
export const getRecord=id=>maybe(`records/${id}.json`);
export const listClaims=()=>read("claims/index.json");
export const getClaim=id=>maybe(`claims/${id}.json`);
export const listSources=()=>read("sources/index.json");
export const getSource=id=>maybe(`sources/${id}.json`);
export const listEvidence=()=>read("evidence/index.json");
export const getEvidence=id=>maybe(`evidence/${id}.json`);
export const getChallenge=id=>maybe(`challenges/${id}.json`);
export const getDrift=id=>maybe(`drift/${id}.json`);
export const getBenchmark=()=>read("benchmark.json");
export function search(q=""){
  const needle=String(q).trim().toLowerCase();
  const items=read("search/index.json");
  return needle?items.filter(x=>`${x.id} ${x.title} ${x.text}`.toLowerCase().includes(needle)):items;
}
