module.exports = async function({ Asserter, TypesParser, TypesValidator, Std, devbin }) {
  const fs = require("fs");
  const path = require("path");
  const file = path.resolve(__dirname, "./../examples.out/Example-004.Propiedades opcionales.json");
  const content = JSON.parse(await fs.promises.readFile(file, "utf8"));
  console.log(content);
    
}