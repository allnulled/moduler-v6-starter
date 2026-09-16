module.exports = async function ({ devbin, Std }) {
  
  const {
    Asserter,
    TypesParser,
    TypesValidator,
  } = Std.all;

  const parameters = { Asserter, TypesParser, TypesValidator, Std, devbin };

  const asserter = Asserter.new;

  const ensureFuncFile = async function(file, fileOut) {
    const exists = await require("fs").promises.access(file).then(() => true).catch(() => false);
    if(!exists) {
      const path = require("path");
      const muter = await devbin.utils.addTouchMutedirTo(path.dirname(file));
      await require("fs").promises.writeFile(file, "" +
`module.exports = async function({ Asserter, TypesParser, TypesValidator, Std, devbin }) {
  const fs = require("fs");
  const path = require("path");
  const file = path.resolve(__dirname, ${JSON.stringify("./" + path.relative(path.dirname(file), fileOut))});
  const content = JSON.parse(await fs.promises.readFile(file, "utf8"));
  console.log(content);
    
}`);
      await muter.cancel();
    }
  };

  Test_de_Types_parser: {
    const allFiles = await require("fs").promises.readdir(`${__dirname}/examples.in`);
    let lastPromise = undefined;
    Iterating_examples_in:
    for(let index=0; index<allFiles.length; index++) {
      const file = allFiles[index];
      if(!file.endsWith(".tyla")) continue Iterating_examples_in;
      const content = await require("fs").promises.readFile(`${__dirname}/examples.in/${file}`, "utf8");
      asserter.assertDoesNotThrowSync(() => {
        const ast = TypesParser.parse(content);
        lastPromise = require("fs").promises.writeFile(`${__dirname}/examples.out/${file.replace(/\.tyla$/g, ".json")}`, JSON.stringify(ast, null, 2), "utf8");
      }, `Can parse example: ${file} (${index+1}/${allFiles.length})`);
      await ensureFuncFile(`${__dirname}/examples.func/${file.replace(/\.tyla$/g, ".js")}`, `${__dirname}/examples.out/${file.replace(/\.tyla$/g, ".json")}`);
    }
    await lastPromise;
    const allFuncs = await require("fs").promises.readdir(`${__dirname}/examples.func`);
    Iterating_examples_funcs:
    for(let index=0; index<allFuncs.length; index++) {
      const file = allFuncs[index];
      if(!file.endsWith(".js")) continue Iterating_examples_funcs;
      if(file.startsWith("e.")) continue Iterating_examples_funcs;
      const callback = await require(`${__dirname}/examples.func/${file}`);
      if(typeof callback !== "function") continue Iterating_examples_funcs;
      await callback({
        ...parameters,
        readOutput: function(id) {
          return require("fs").promises.readFile(`${__dirname}/examples.out/${id}`);
        },
      });
    }

  }


}