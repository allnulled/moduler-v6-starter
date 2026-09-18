module.exports = async function({ Asserter, TypesParser, TypesValidator, Std, devbin }) {
  const fs = require("fs");
  const path = require("path");
  const file = path.resolve(__dirname, "./../examples.out/Example-002.Objeto con propiedades.json");
  const content = JSON.parse(await fs.promises.readFile(file, "utf8"));
  
    
}