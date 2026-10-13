module.exports = async function ({ Tester }) {

  const {
    TypesCatalog,
    TypesValidator,
    TypesParser,
    Asserter: { new: asserter },
    Printer,
  } = Std.all;

  const list = [
    // Las que sí deberían funcionar:
    ["number", 1, "Simple"],
    ["!number", 1, "Negado"],
    ["number&integer", 1, "Conjuntivo de 2"],
    ["number&integer & !string", 1, "Conjuntivo de 3"],
    ["number|string", 1, "Disjuntivo de 2"],
    ["number|string | null", 1, "Disjuntivo de 3"],
    ["(number|string) & !empty", 1, "Paréntesis de 1"],
    ["((number&!empty)|(string&!empty))&!object", 1, "Paréntesis de 2"],
    ["@name string", 1, "Etiqueta (1)"],
    ["function(string,{})=>undefined", 1, "Función síncrona (1)"],
    ["async function(@id string,@data {})=>undefined", 1, "Función asíncrona (1)"],
    ["[number,string]", 1, "Array (1)"],
    ["[@id number,@operation string,@parameters object]", 1, "Array (2)"],
    ["{name:string,password:string}", 1, "Object (1)"],
    ["{name?:string}", 1, "Propiedad opcional de object (1)"],
    ["@name string;@age number;[@name,@age]", 1, "Etiqueta reusada como tipo (1)"],
    ["@name string;@age number;{name:@name,age:@age}", 1, "Etiqueta reusada como propiedad (2)"],
    ["@name string;@age number;{@name,@age}", 1, "Etiqueta reusada como propiedad y nombre (3)"],
    ["[...[a,b],...[c,d],...[e,f]]", 1, "Spread array operator en arrays con array (1)"],
    [`@grupo1 [a,b]; @grupo2 [c,d];@grupo3 [e,f];[...@grupo1,...@grupo2,...@grupo3]`, 1, "Spread array operator en arrays con variables (2)"],
    ["function(...[a,b],...[c,d])=>undefined", 1, "Spread array operator en parámetros de función con array (3)"],
    [`@grupo1 [a,b];@grupo2 [c,d];function(...@grupo1,...@grupo2)=>undefined`, 1, "Spread array operator en parámetros de función con variable (4)"],
    ["[...[a,b]?,c]", 1, "Spread array operator con multiplicador de 0 o 1 (?) con array (1)"],
    ["[...[a,b]+,c]", 1, "Spread array operator con multiplicador de 0 o más (*) con array (2)"],
    ["[...[a,b]*,c]", 1, "Spread array operator con multiplicador de 1 o más (+) con array (3)"],
    ["@grupo1 [a,b];[...@grupo1?,c]", 1, "Spread array operator con multiplicador de 0 o 1 (?) con array (1)"],
    ["@grupo1 [a,b];[...@grupo1+,c]", 1, "Spread array operator con multiplicador de 0 o más (*) con array (2)"],
    ["@grupo1 [a,b];[...@grupo1*,c]", 1, "Spread array operator con multiplicador de 1 o más (+) con array (3)"],
    ["{name:string}&{password:string}", 1, "Spread object operator o por qué no existe"],
    ["@password string;{name:string}&@password;", 1, "Spread object operator o por qué no existe"],
    [`{city:@city="Elei"};`, 1, "Valor por defecto (1)"],
    [`{run:class{hello:function()=>undefined,prototype:{id:number}}};`, 1, "Class y firmas de static y prototype (1)", Std.functions.noop, {
      run: class {
        static hello() {};
        static {
          this.prototype.id = 300;
        }
      }
    }, 1],
    [`number;`, 1, "Valor simple (1)", Std.functions.noop, 0, 1],
    [`!number;`, 1, "Valor negado (1)", Std.functions.noop, '', 1],
    [`!number&!string&(!object|!array)`, 1, "Testeo", Std.functions.noop],
    [`!number&!string|(array|object)`, 1, "Testeo", Std.functions.noop, {},],
    [`@name string;@total number;{@name,@total};`, 1, "Reutiliza variables declaradas (1)", Std.functions.noop, {name:"1",total:2}, 1],
    [`@core string|null|object;{a:{b:{c:@core {}}}};`, 1, "Reutiliza variables declaradas (2)", Std.functions.noop, {a:{b:{c:{}}}}, 1, val => {
      // console.log(val);
    }],
    [`{"a b c":number};`, 1, "Permite nombres de propiedades de objetos como string (1)", Std.functions.noop, {"a b c":100}],
    [`@file1 ^file:"./std/example/person.tyla";`, 1, "Import como sintaxis del parser", Std.functions.noop],
    // @RETAKE from here:
    [`@file1 ^file:"./std/example/person.tyla";`, 1, "Import de file desde el validador no solo el parser (1)", Printer.json, {title:"some"}, 1, (...args) => {
      console.log(...args);
    }],
    /*
    [`@url1 ^url:"./std/example/person.tyla";`, 1, "Import de url desde el validador no solo el parser (2)", Printer.json, {title:"some"}],
    [`@path1 ^path:"./std/example/person.tyla";`, 1, "Import de path desde el validador no solo el parser (3)", Printer.json, {title:"some"}],
    [`@resource1 ^"./std/example/person.tyla";`, 1, "Import de path implítico desde el validador no solo el parser (4)", Printer.json, {title:"some"}],
    //*/
  ];

  const errors = [];
  for(let index=0; index<list.length; index++) {
    const row = list[index];
    const [
      exprezzion,
      expectParseSuccess,
      concept,
      callback = false,
      input = null,
      expectValidateSuccess = true,
      validationCallback = false,
    ] = row;
    let ast = undefined;
    let validation = undefined;
    Expression: {
      const parseAsserter = expectParseSuccess ? "assertDoesNotThrowAsync" : "assertThrowsAsync";
      const errorMessage = `Can${expectParseSuccess ? "" : "not"} on concept «${concept}» parse '${expectParseSuccess ? '' : 'in'}correct validation' at index ${index}: ${exprezzion}`;
      console.log(`[*] Expression: ${exprezzion}`);
      await asserter[parseAsserter](() => ast = TypesParser.parse(exprezzion), errorMessage);
    }
    Callback: {
      if(callback) {
        await callback(ast);
      }
    }
    Input: {
      if(input === null) break Input;
      const validateAsserter = expectValidateSuccess ? "assertDoesNotThrowAsync" : "assertThrowsAsync";
      await asserter[validateAsserter](async () => {
        validation = await TypesValidator.validateData(ast, input);
        if(validation instanceof Error) throw validation;
      });
    }
    Validation_callback: {
      if(validationCallback) {
        await validationCallback(validation);
      }
    }
  }

  return;

};