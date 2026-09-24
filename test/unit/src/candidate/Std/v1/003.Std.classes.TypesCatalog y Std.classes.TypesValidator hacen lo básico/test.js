module.exports = async function ({ devbin, Std }) {
  
  const { TypesCatalog, TypesValidator, TypesParser } = Std.all;

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

  const corrects = [];
  const incorrects = [];
  const runValidation = function([exprezzion, input], expectSuccess = true, index) {
    const callback = () => TypesValidator.validateData(TypesParser.parse(exprezzion), input);
    return devbin.tester[expectSuccess ? "assertDoesNotThrow" : "assertThrows"](callback, `Can${expectSuccess ? "" : "not"} parse '${expectSuccess ? '' : 'in'}correct validation' at index ${index}: ${exprezzion}`);
  };

  const correctValidations = [
    ["string", "800"],
    ["{name:string}", {name:"ok"}],
    ["{age:number}", {age:50}],
    ["{age?:number}", {}],
    ["{age?:number}", {age:undefined}],
    ["{age:number?}", {age:undefined}],
    ["{age:null}", {age:null}],
    // @CONTINUE aquí:
    ["{age:number|null}", {age:null}],
    ["{age:number|string|null}", {age:null}],
    ["{age:number|string|null}", {age:50}],
    ["{age:number|string|null}", {age:"ok"}],
  ];
  const incorrectValidations = [
    ["{age?:number}", {age:null}],
    ["{age:number?}", {age:"text"}],
    ["{age:number?}", {age:false}],
    ["{age:null}", {age:50}],
  ];
  
  Corrects:
  for(let index=0; index<correctValidations.length; index++) {
    const correctValidation = correctValidations[index];
    const validation = await runValidation(correctValidation, true, index);
    corrects.push(validation);
  }

  Incorrects:
  for(let index=0; index<incorrectValidations.length; index++) {
    const correctValidation = incorrectValidations[index];
    const validation = await runValidation(correctValidation, false, index);
    incorrects.push(validation);
  }

  const outputs1 = await Promise.all([
    TypesValidator.validateData(TypesParser.parse("string"), "800"),
    TypesValidator.validateData(TypesParser.parse("{name:string}"), {name:"ok"}),
    TypesValidator.validateData(TypesParser.parse("{age:number}"), {age:50}),
  ]);
  
  $moduler.assert(outputs1[0]["*type"] === "string", "Can validate data from parsed expressions correctly (1)");
  $moduler.assert(outputs1[1].name["*type"] === "string", "Can validate data from parsed expressions correctly (2)");
  $moduler.assert(outputs1[2].age["*type"] === "number", "Can validate data from parsed expressions correctly (3)");

}