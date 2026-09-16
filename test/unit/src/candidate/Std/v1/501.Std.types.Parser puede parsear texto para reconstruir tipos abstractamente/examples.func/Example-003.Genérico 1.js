module.exports = async function({ Asserter, TypesParser, TypesValidator, Std, devbin }) {
  const fs = require("fs");
  const path = require("path");
  const file = path.resolve(__dirname, "./../examples.out/Example-003.Genérico 1.json");
  const content = JSON.parse(await fs.promises.readFile(file, "utf8"));
  const validation = await TypesValidator.validateData(content, {});
  Asserter.prototype.assertThrowsAsync(async function() {
  }, "Can validate data of example 003", {
    name: "ValidationError"
  });
}