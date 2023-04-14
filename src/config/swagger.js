import fs from "fs";
import path from "path";
import YAML from "yaml";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const file = fs.readFileSync(path.resolve(__dirname, "swagger.yaml"), "utf8");

export default YAML.parse(file);
