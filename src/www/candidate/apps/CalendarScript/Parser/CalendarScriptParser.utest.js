module.exports = async function({ devbin }) {
  console.log("[**] Test de CalendarSriptParser");
  const CalendarScriptParserFile = devbin.moduler.normalizationOf("@/dist/www/candidate/apps/CalendarScript/Parser/CalendarScriptParser.dist.js");
  require(CalendarScriptParserFile);
  const allTests = await require("fs").promises.readdir(`${__dirname}/tests`);
  for(let index=0; index<allTests.length; index++) {
    const testId = allTests[index];
    const testFile = `${__dirname}/tests/${testId}`;
    const contents = await require("fs").promises.readFile(testFile, "utf8");
    try {
      const output = CalendarScriptParser.parse(contents);
      console.log(output);
      console.log(`[*] Test ${index+1}/${allTests.length} ok: ${testId}`);
    } catch (error) {
      console.log(`[!] Test ${index+1}/${allTests.length} failed: ${testId}`, error);
    }
  }
};