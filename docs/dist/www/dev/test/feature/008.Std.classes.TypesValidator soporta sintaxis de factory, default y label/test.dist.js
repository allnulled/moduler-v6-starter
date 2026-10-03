module.exports = async function ({ Tester }) {

  const {
    TypesCatalog,
    TypesValidator,
    TypesParser,
    Asserter: { new: asserter },
  } = Std.all;

  const list = [
    // Las que sí deberían funcionar:
    ["number", 1, "Simple"],
    ["!number", 1, "Negado"],
    ["number & integer", 1, "Conjuntivo de 2"],
    ["number & integer & !string", 1, "Conjuntivo de 3"],
    ["number | string", 1, "Disjuntivo de 2"],
    ["number | string | null", 1, "Disjuntivo de 3"],
    ["(number | string) & !empty", 1, "Paréntesis de 1"],
    ["((number & !empty) | (string & !empty)) & !object", 1, "Paréntesis de 2"],
    ["@name string", 1, "Etiqueta (1)"],
    ["function(string, {}) => undefined", 1, "Función síncrona (1)"],
    ["async function(@id string, @data {}) => undefined", 1, "Función asíncrona (1)"],
    ["[number,string]", 1, "Array (1)"],
    ["[@id number, @operation string, @parameters object]", 1, "Array (2)"],
    ["{name:string,password:string}", 1, "Object (1)"],
    ["{name?:string}", 1, "Propiedad opcional de object (1)"],
    ["@name string; @age number; [@name,@age]", 1, "Etiqueta reusada como tipo (1)"],
    ["@name string; @age number; {name:@name,age:@age}", 1, "Etiqueta reusada como propiedad (2)"],
    ["@name string; @age number; {@name,@age}", 1, "Etiqueta reusada como propiedad y nombre (3)"],
    ["[..[a,b],..[c,d],..[e,f]]", 1, "Spread array operator en arrays con array (1)"],
    [`@grupo1 [a,b]; @grupo2 [c,d]; @grupo3 [e,f]; [..@grupo1,..@grupo2,..@grupo3]`, 1, "Spread array operator en arrays con variables (2)"],
    ["function (..[a,b], ..[c,d]) => undefined", 1, "Spread array operator en parámetros de función con array (3)"],
    [`@grupo1 [a,b]; @grupo2 [c,d]; function (..@grupo1, ..@grupo2) => undefined`, 1, "Spread array operator en parámetros de función con variable (4)"],
    ["[..[a,b]?, c]", 1, "Spread array operator con multiplicador de 0 o 1 (?) con array (1)"],
    ["[..[a,b]+, c]", 1, "Spread array operator con multiplicador de 0 o más (*) con array (2)"],
    ["[..[a,b]*, c]", 1, "Spread array operator con multiplicador de 1 o más (+) con array (3)"],
    ["@grupo1 [a,b]; [..@grupo1?, c]", 1, "Spread array operator con multiplicador de 0 o 1 (?) con array (1)"],
    ["@grupo1 [a,b]; [..@grupo1+, c]", 1, "Spread array operator con multiplicador de 0 o más (*) con array (2)"],
    ["@grupo1 [a,b]; [..@grupo1*, c]", 1, "Spread array operator con multiplicador de 1 o más (+) con array (3)"],
    ["{name:string} & {password:string}", 1, "Spread object operator o por qué no existe"],
    ["@password string; {name:string} & @password;", 1, "Spread object operator o por qué no existe"],
    // Las que tienen que poder hacerse pero aún no:
  ];

  const errors = [];
  for(let index=0; index<list.length; index++) {
    const row = list[index];
    const [exprezzion, expectSuccess, concept] = row;
    const method = expectSuccess ? "assertDoesNotThrowAsync" : "assertThrowsAsync";
    const errorMessage = `Can${expectSuccess ? "" : "not"} on concept «${concept}» parse '${expectSuccess ? '' : 'in'}correct validation' at index ${index}: ${exprezzion}`;
    asserter[method](() => TypesParser.parse(exprezzion), errorMessage);
  }

  return;

  $moduler.assert(typeof $types === "object", "Can find global TypesCatalog instance (1)");
  $moduler.assert(typeof $types.boolean === "function", "Can find specific global type with $types.get(...) (3)");

  Global_equalities: {
    $moduler.assert(Std.all.BooleanUtil.areEqual(...[
      TypesCatalog.globalInstance.getType("boolean"),
      TypesCatalog.globalInstance.all.boolean,
      Std.types.boolean,
      $types.boolean
    ]), "Can find same specific global type in every global (4)");
  }

  Inline_tests: {

    const corrects = [];
    const incorrects = [];
    const runValidation = function (it, expectSuccess = true, index) {
      const [exprezzion, input] = it;
      const callback = () => {
        try {
          const ast = TypesParser.parse(exprezzion);
          return TypesValidator.validateData(ast, input);
        } catch (error) {
          console.log(`[!] Failed parsing or validating expression:\n  ${exprezzion}`);
          throw error;
        }
      };
      return asserter[expectSuccess ? "assertDoesNotThrowAsync" : "assertThrowsAsync"](callback, `Can${expectSuccess ? "" : "not"} parse '${expectSuccess ? '' : 'in'}correct validation' at index ${index}: ${exprezzion}`);
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
      ["@login async function(@name string, @password string) => @success response", function () { }],
      ["@sumar function(@sumandos array(number)) => @resultado number", function () { }],
      ["@sumar sync function(@sumandos array(number)) => @resultado number", function () { }],
      ["@sumar function() => undefined", function () { }],
      // 8. Defaults opcionales:
      [`@opcion string? = "por defecto"`, "text"],
      [`@age number = 0`, 200],
      [`{name: @username string = unnamed}`, { name: "any name" }],
      [`@Std.classes.Randomizer.getString function () => {}`, function () { }],
      [`@Std.classes.Duration.from function (string|date|object) => {year: number}`, () => { name: null }],
      [`{name: @username string = "ok"}`, { name: "user" }],
      // 9. Array:
      [`[]`, []],
      [`[string]`, ["ok"]],
      [`[string,boolean,number]`, ["ok", true, 100]],
      // 10. Repeatable array:
      [`[^string,number,boolean]`, ["text", 100, true, "text2", 200, false]],
      [`[number]`, [5]],
      // 13. Function errors:
      [`function() #> Error => void`, function () { }],
      [`@fn async function() #> @err1 UserNotFoundError #> @err2 IncorrectPasswordError => @login {session:string}`, function () { }],
      // 14. Spread object parameters:
      // [`{...{a:number,b:string}, ...{c:boolean}}`, {a:10,b:"ok",c:true}],
      // 15. Spread operator in array and function parameters:
      // [`[string?, [^string]?, function () => any]`, ["ok", [], function() {}]],
      // [`[string,? [^string],? function () => any,?]`, [function() {}]],
      // [`[...(string,? [^string],)? function () => any,?]`, [function() {}]],
      // 16. Multipliers and groupers in array and function parameters:
      // [`[]`, [function() {}]],
    ];
    const incorrectValidations = [
      ["{age?:number}", { age: null }],
      ["{age:number?}", { age: "text" }],
      ["{age:number?}", { age: false }],
      ["{age:null}", { age: 50 }],
      ["@imposible string&!string", "text"],
      ["@fallaria function() => undefined", undefined],
      [`{name: @username string = "ok"}`, { name: null }],
      [`[]`, [800]],
      [`[number,number]`, [800]],
      [`[string|boolean|number]`, ["ok", true, null]],
      [`[number]`, [5, 6, 7, "ocho"]],
      [`x #> Error`, function () { }],
    ];

    Corrects:
    for (let index = 0; index < correctValidations.length; index++) {
      const correctValidation = correctValidations[index];
      try {
        const validation = await runValidation(correctValidation, true, index);
        corrects.push(validation);
      } catch (error) {
        console.log(correctValidation, error);
        Error.normalize(error).adding(`Failed (correct) example of: ${correctValidation[0]}`).rethrow();
      }
    }

    Incorrects:
    for (let index = 0; index < incorrectValidations.length; index++) {
      const incorrectValidation = incorrectValidations[index];
      try {
        const validation = await runValidation(incorrectValidation, false, index);
        incorrects.push(validation);
      } catch (error) {
        console.log(incorrectValidation, error);
        Error.normalize(error).adding(`Failed (incorrect) example of: ${incorrectValidation[0]}`).rethrow();
      }
    }

    const outputs1 = await Promise.all([
      TypesValidator.validateData(TypesParser.parse("string"), "800"),
      TypesValidator.validateData(TypesParser.parse("{name:string}"), { name: "ok" }),
      TypesValidator.validateData(TypesParser.parse("{age:number}"), { age: 50 }),
    ]);

    $moduler.assert(outputs1[0]["*type"] === "string", "Can validate data from parsed expressions correctly (1)");
    $moduler.assert(outputs1[1].name["*type"] === "string", "Can validate data from parsed expressions correctly (2)");
    $moduler.assert(outputs1[2].age["*type"] === "number", "Can validate data from parsed expressions correctly (3)");

  }

};