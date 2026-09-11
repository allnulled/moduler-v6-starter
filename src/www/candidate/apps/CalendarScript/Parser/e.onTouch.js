const fixPegjsSource = code => {
  let out = code.trim().replace(/;$/g, "");
  return `
(function (mod) {
  if (typeof window !== 'undefined') window['CalendarScriptParser'] = mod;
  if (typeof global !== 'undefined') global['CalendarScriptParser'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(${out});
`;
};
module.exports = async function ({ devbin }) {
  const entryFile = devbin.moduler.normalizationOf("@/dist/www/candidate/apps/CalendarScript/Parser/CalendarScriptParser.peg.dist.js");
  require(`${__dirname}/pegjs.js`);
  const contents = await require("fs").promises.readFile(entryFile, "utf8");
  const source = PEG.buildParser(contents, {
    output: "source",
  });
  const distPegFile = devbin.moduler.normalizationOf("@/dist/www/candidate/apps/CalendarScript/Parser/CalendarScriptParser.peg.dist.js");
  const distFile = devbin.moduler.normalizationOf("@/dist/www/candidate/apps/CalendarScript/Parser/CalendarScriptParser.dist.js");
  await require("fs").promises.writeFile(distPegFile, contents, "utf8");
  await require("fs").promises.writeFile(distFile, fixPegjsSource(source), "utf8");
  const test = require(`${__dirname}/CalendarScriptParser.utest.js`);
  await test(...arguments);
}