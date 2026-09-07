import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const schema = JSON.parse(fs.readFileSync(path.join(root, "schemas/myth-record.schema.json"), "utf8"));
const ajv = new Ajv2020({allErrors:true, strict:false});
addFormats(ajv);
const validate = ajv.compile(schema);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(path.join(root, "data/records")).filter((f) => f.endsWith(".json"));
let failed = false;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!validate(data)) {
    failed = true;
    console.error("\nINVALID:", path.relative(root, file));
    console.error(validate.errors);
  } else {
    console.log("OK:", path.relative(root, file));
  }
}

if (failed) process.exit(1);
console.log(`Validated ${files.length} record(s).`);
