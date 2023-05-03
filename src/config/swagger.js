const fs = require("fs");
const path = require("path");
const YAML = require('yaml');

const filename = path.dirname(new URL(process.argv[1], 'file:').pathname);
const file = fs.readFileSync(path.resolve(filename, "config", "swagger.yaml"), "utf8");

module.exports = YAML.parse(file);