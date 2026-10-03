module.exports = async function ({ Tester }) {
  Official_readme_examples_test: {

    return;

    const readmePath = $moduler.normalizationOf("@/src/candidate/Std/apis/types/TypesParser/README.md");
    const readmeContent = await require("fs").promises.readFile(readmePath, "utf8");
    const readmeExamples = Std.functions.extractSubstrings(readmeContent, "```tyla\n", "```");

    const { TypesParser } = Std.classes;

    for(let index=0; index<readmeExamples.length; index++) {
      const exampleSource = readmeExamples[index];
      try {
        const ast = TypesParser.parse(exampleSource);
        // console.log(ast);
      } catch (error) {
        console.log(error);
        console.log(`[!] This error comes from the following example source in official TypesParser readme file:`);
        console.log(exampleSource);
        throw error;
      }
    }

  }
};