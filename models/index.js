const fs = require("fs");
const path = require("path");

const modelsDir = path.join(__dirname);
let models = {};
fs.readdirSync(modelsDir).forEach((file) => {
  if (file.endsWith(".js") && file !== "index.js") {
    let modelName = file.replace(".js", "");
    const modelPath = path.join(modelsDir, file);
    models[modelName] = require(modelPath);
  }
});

module.exports = models;
