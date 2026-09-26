module.exports = async function ({ Tester }) {
  const {
    TypesCatalog,
    TypesValidator,
    TypesParser,
    Asserter: { new: asserter },
  } = Std.all;

  $moduler.assert(
    typeof $types === "object",
    "Can find global TypesCatalog instance (1)",
  );
  $moduler.assert(
    typeof $types.boolean === "function",
    "Can find specific global type with $types.get(...) (3)",
  );

  Global_equalities: {
    $moduler.assert(
      Std.all.BooleanUtil.areEqual(
        ...[
          TypesCatalog.globalInstance.getType("boolean"),
          TypesCatalog.globalInstance.all.boolean,
          Std.types.boolean,
          $types.boolean,
        ],
      ),
      "Can find same specific global type in every global (4)",
    );
  }

  const corrects = [];
  const incorrects = [];
  const runValidation = function (
    [exprezzion, input],
    expectSuccess = true,
    index,
  ) {
    const callback = () => {
      try {
        const ast = TypesParser.parse(exprezzion);
        return TypesValidator.validateData(ast, input);
      } catch (error) {
        console.log(`[!] Failed parsing expression:\n  ${exprezzion}`);
        throw error;
      }
    };
    return asserter[
      expectSuccess ? "assertDoesNotThrowAsync" : "assertThrowsAsync"
    ](
      callback,
      `Can${expectSuccess ? "" : "not"} parse '${expectSuccess ? "" : "in"}correct validation' at index ${index}: ${exprezzion}`,
    );
  };

  const correctValidations = [
    // 1. Lo básico:
    ["string", "800"],
    ["{name:string}", { name: "ok" }],
    ["{age:number}", { age: 50 }],
    // 2. Propiedades opcionales:
    ["{age?:number}", {}],
    ["{age?:number}", { age: undefined }],
    ["{age:number?}", { age: undefined }],
    ["{age:null}", { age: null }],
    // 3. Disyunción:
    ["{age:number|null}", { age: null }],
    ["{age:number|string|null}", { age: null }],
    ["{age:number|string|null}", { age: 50 }],
    ["{age:number|string|null}", { age: "ok" }],
    // 4. Negación:
    ["@name !null", "text"],
    // 5. Conjunción
    ["@name string & !null & !number", "text"],
    // 6. Labels de cualquier tipo:
    ["@name string", "text"],
    ["@age number", 100],
    ["@active boolean", true],
    ["{city: @city string}", { city: "ok" }],
    // 7. Factories como tipo sintáctico:
    [
      "@login async function(@name string, @password string) => @success response",
      function () {},
    ],
    [
      "@sumar function(@sumandos array(number)) => @resultado number",
      function () {},
    ],
    [
      "@sumar sync function(@sumandos array(number)) => @resultado number",
      function () {},
    ],
    ["@sumar function() => undefined", function () {}],
    // 8. Defaults opcionales:
    [`@opcion string? = "por defecto"`, "text"],
    [`@age number = 0`, 200],
    [`{name: @username string = unnamed}`, { name: "any name" }],
    [`@Std.classes.Randomizer.new function () => {}`, function () {}],
  ];
  const incorrectValidations = [
    ["{age?:number}", { age: null }],
    ["{age:number?}", { age: "text" }],
    ["{age:number?}", { age: false }],
    ["{age:null}", { age: 50 }],
    ["@imposible string&!string", "text"],
    ["@fallaria function() => undefined", undefined],
    [`{name: @username string = unnamed}`, { name: null }],
  ];

  Corrects: for (let index = 0; index < correctValidations.length; index++) {
    const correctValidation = correctValidations[index];
    try {
      const validation = await runValidation(correctValidation, true, index);
      corrects.push(validation);
    } catch (error) {
      console.log(correctValidation, error);
      Error.normalize(error)
        .adding(`Failed (correct) example of: ${correctValidation[0]}`)
        .rethrow();
    }
  }

  Incorrects: for (
    let index = 0;
    index < incorrectValidations.length;
    index++
  ) {
    const incorrectValidation = incorrectValidations[index];
    try {
      const validation = await runValidation(incorrectValidation, false, index);
      incorrects.push(validation);
    } catch (error) {
      console.log(incorrectValidation, error);
      Error.normalize(error)
        .adding(`Failed (incorrect) example of: ${incorrectValidation[0]}`)
        .rethrow();
    }
  }

  const outputs1 = await Promise.all([
    TypesValidator.validateData(TypesParser.parse("string"), "800"),
    TypesValidator.validateData(TypesParser.parse("{name:string}"), {
      name: "ok",
    }),
    TypesValidator.validateData(TypesParser.parse("{age:number}"), { age: 50 }),
  ]);

  $moduler.assert(
    outputs1[0]["*type"] === "string",
    "Can validate data from parsed expressions correctly (1)",
  );
  $moduler.assert(
    outputs1[1].name["*type"] === "string",
    "Can validate data from parsed expressions correctly (2)",
  );
  $moduler.assert(
    outputs1[2].age["*type"] === "number",
    "Can validate data from parsed expressions correctly (3)",
  );
};
