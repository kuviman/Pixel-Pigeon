const { existsSync } = require("fs");
const { join } = require("path");

const getNodeModulesPath = () => {
  if (existsSync(join(__dirname, "..", "node_modules"))) {
    return join(__dirname, "..", "node_modules");
  }
  if (existsSync(join(__dirname, "..", "..", "..", "node_modules"))) {
    return join(__dirname, "..", "..", "..", "node_modules");
  }
  throw new Error("Could not get node_modules path.");
}

module.exports = nodeModulesPath = getNodeModulesPath();