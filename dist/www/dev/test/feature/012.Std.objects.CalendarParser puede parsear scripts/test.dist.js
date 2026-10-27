module.exports = async function ({ Tester }) {
  const {
    Environmenter,
    CalendarParser,
    NodejsFilesystem,
    IdbFilesystem,
  } = Std.all;
  const allExamples = [
    ["001.Simple example.cale"],
  ].map(it => [
    `@/dist/www/dev/test/feature/012.Std.objects.CalendarParser puede parsear scripts/examples/${it[0]}`,
    it[1] ? `@/dist/www/dev/test/feature/012.Std.objects.CalendarParser puede parsear scripts/tests/${it[1]}` : false,
  ]);
  return;
  for(let indexExample=0; indexExample<allExamples.length; indexExample++) {
    const [exampleFile, exampleTest = false] = allExamples[indexExample];
    console.log(exampleFile);
    const exampleContent = await $moduler._readPath(exampleFile);
    console.log(exampleContent);
    const exampleAst = CalendarParser.parse(exampleContent);
    if(exampleTest) {
      await $moduler.importCallback(exampleTest, {
        ast: exampleAst,
        source: exampleContent,
      });
    }
  }


};