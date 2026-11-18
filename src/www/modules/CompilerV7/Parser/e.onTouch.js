module.exports = async function({ devbin, file }) {
  const inputFile = devbin.moduler.normalizationOf(`@/src/www/modules/CompilerV7/Parser/CompilerV7Parser.parser.pegjs`);
  if(file !== inputFile) return;
  const content = await require("fs").promises.readFile(file, "utf8");
  const outputFile = devbin.moduler.normalizationOf(`@/src/www/modules/CompilerV7/Parser/CompilerV7Parser.object.js`);
  let output = require("peggy").generate(content, {
    format: "globals",
    exportVar: "CompilerV7Parser",
    output: "source",
    allowedStartRules: [
      "cv7_main_language",
      "cv7_templates_language",
      "cv7_forms_language",
    ]
  });
  output = output.replace("root.CompilerV7Parser = {", "return root.CompilerV7Parser = {");
  output = output.replace("})(this);\n", "})(globalThis)");
  require("fs").promises.writeFile(outputFile, output, "utf8");
}