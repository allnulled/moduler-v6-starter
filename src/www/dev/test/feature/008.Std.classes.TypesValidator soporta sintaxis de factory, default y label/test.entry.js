module.exports = async function ({ Tester }) {

  const {
    TypesCatalog,
    TypesValidator,
    TypesParser,
    Asserter: { new: asserter },
    Printer,
  } = Std.all;
  const { assert } = asserter;

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
/*
    [`@file1 ^file:"./std/example/person.tyla";`, 1, "Import como sintaxis del parser", Std.functions.noop],
    [`@file1 ^file:"./std/example/person.tyla";`, 1, "Import de file desde el validador no solo el parser (1)", Std.functions.noop, {
      name: "Carlos",
      born: new Date("1991/01/05"),
      email: "whatever@andever.you",
      city: "LA",
      polo: 2,
    }, 1],
    [`@file1 ^file:"./std/example/person.tyla";`, 1, "Import de file desde el validador no solo el parser (1)", Std.functions.noop, {
      name: "Carlos",
      born: new Date("1991/01/05"),
      email: "whatever@andever.you",
      city: "NY",
      polo: 1,
    }, 1, function(validation, ast) {
      Test_que_demuestra_que_los_imports_han_sido_reemplazados: {
        // Std.all.Printer.json(validation.ast);
        assert(typeof validation === "object", "Method validateData returns validation object (1)");
        assert(typeof validation.ast === "object", "Method validateData returns validation object (2)");
        assert(typeof validation.ast.ast === "object", "Method validateData returns validation object (3)");
        assert(typeof validation.ast.ast[0] === "object", "Method validateData returns validation object (4)");
        // A partir de aquí es de object y no de import:
        assert(typeof validation.ast.ast[0].properties === "object", "Method validateData returns validation object (5)");
        assert(typeof validation.ast.ast[0].properties.name === "object", "Method validateData returns validation object (6)");
        assert(typeof validation.ast.ast[0].properties.name.grammar === "string", "Method validateData returns validation object (7)");
        assert(typeof validation.ast.ast[0].properties.name.id === "string", "Method validateData returns validation object (8)");
        // Std.all.Printer.json(validation);
      }
    }],
*/
    [`string`, 1, "Puede validar un string cualquiera (1)", Printer.noop, {name:60}, 0],
    // @AHORA => ESTÁN FALLANDO LAS PROPIEDADES DE OBJETO
    // [`{name:string}`, 1, "Puede validar propiedades de un objeto cualquiera (1)", Std.functions.noop, {name:60}, 0],
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
    let validationOutput = undefined;
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
        validationOutput = await TypesValidator.validateData(ast, input);
        if(validationOutput instanceof Error) throw validationOutput;
        return validationOutput;
      }, exprezzion);
    }
    Validation_callback: {
      if(validationCallback) {
        await validationCallback(validationOutput, ast);
      }
    }
  }

  Test_con_mas_detalles_nivel_1: {
    const allTests = [
      ["string","Simplest mismatch (1) | Expects string but receives object",{},false,function() {},Printer.noop],
      ["{name:string}","Mismatch in object properties (1) | Expects string but receives object",{name:{}},false,function() {},Printer.noop],
      ["{person:{name:string}}","Mismatch in object nested properties (1) | Expects string but receives object",{person:{name:{}}},false,function() {},Printer.noop],
      ["{person:{name:string}}","Promatch in object nested properties (1) | Expects string and receives string",{person:{name:"Good"}},true,function() {},function(it) {
        assert(typeof it === "object", "Validation returns an object");
      }],
      ["{name:string,password:string,email:string,level:number}","Promatch in multiple object properties (1) | Expects and receives multiple properties",{
        name: "user",
        password: "wait.ok",
        email: "user@domain.com",
        level: 5,
      },true,function() {},function(it) {
        assert(typeof it === "object", "Validation returns an object");
        assert(it.validation.result.length === 5, "Validation returns result with items on success (1)");
      }],
      ["number|string|array","Mismatch in multiple or options (1)",[],1,Printer.noop,Printer.noop,],
      ["number|!string|array","Mismatch in multiple or options (1)",{},1,Printer.noop,Printer.noop,],
      ["{message:string|[]}","Mismatch property in object (1)",{message:10},0,Printer.noop,Printer.noop,],
      ["!(string|array)","Mismatch grouped negation (1)",[],0,Printer.noop,Printer.noop,],
      ["!(string|array)","Promatch grouped negation (1)",222,1,Printer.noop,Printer.noop,],
      ["integer","Mismatch integer (1)",555.555,0,Printer.noop,Printer.noop,],
      ["[string]","Promatch array with string (1)",["text"],1,Printer.noop,Printer.noop,],
      ["[string,number,{}]","Promatch array (1)",["",0,{}],1,Printer.noop,Printer.noop,],
      ["[string,number]","Mismatch array (1)",[0,0],0,Printer.noop,Printer.noop,],
      ["[...[number,object],...[boolean,number,...[string,array]]]","Promatch nested spreaded arrays (1)",[8,{},false,8,'',[]],1,Printer.noop,Printer.noop,],
      ["@last [string,array];[...[number,object],...[boolean,number,...@last]]","Mismatch nested spreaded arrays (2)",[8,{},false,8,'',{}],0,Printer.noop,Printer.noop,],
      ["@third [string,array]; @last [boolean,number,...@third]; @first [number,object]; @all [...@first,...@last]; @all","Mismatch nested spreaded arrays (3)",[8,{},false,8,'',[]],1,Printer.noop,Printer.noop,],
      ["@third [string,array]; @last [boolean,number,...@third]; @first [number,object]; @all [...@first,...@last]; @all","Mismatch nested spreaded arrays (4)",[8,{},false,8,'',''],0,Printer.noop,Printer.noop,],
      // Multiplicadores/Ejemplos de firmas tipo moduler:
      ["[string*,[]+,function() => any,{}?]","Promatch multipliers (1) | Unmulitplied row signature",["name",[],class{},{}],1,Printer.noop,Printer.noop,],
      ["[string*,[]+,function() => any,{}?]","Promatch multipliers (2) | Without ? element",["name",[],class{}],1,Printer.noop,Printer.noop,],
      ["[string*,[]+,function() => any,{}?]","Promatch multipliers (3) | Without ? and * elements",[[],class{}],1,Printer.noop,Printer.noop,],
      ["[string*,[]+,function() => any,{}?]","Promatch multipliers (4) | Without ? and * elements and multiplying + elements",[[],[],[],class{}],1,Printer.noop,Printer.noop,],
      ["[string*,[]+,function() => any,{}?]","Mismatch multipliers (5) | Without ? and * elements and multiplying + elements but missing random element",[[],[],[]],0,Printer.noop,Printer.noop,],
      ["[string*,[]+,function() => any,{}?]","Mismatch multipliers (6) | Multiplying * elements",["name1", "name2", [], class{}],1,Printer.noop,Printer.noop,],
      // Multiplicadores/Signo ?:
      ["[number?]","Mismatch multipliers (10) | Multiplying ? element per 3",[8,8,8],0,Printer.noop,Printer.noop,],
      ["[number?]","Mismatch multipliers (11) | Multiplying ? element per 2",[8,8],0,Printer.noop,Printer.noop,],
      ["[number?]","Promatch multipliers (12) | Multiplying ? element per 1",[8],1,Printer.noop,Printer.noop,],
      ["[number?]","Promatch multipliers (13) | Multiplying ? element per 0",[],1,Printer.noop,Printer.noop,],
      // Multiplicadores/Signo +:
      ["[number+]","Promatch multipliers (20) | Multiplying + element per 3",[8,8,8],1,Printer.noop,Printer.noop,],
      ["[number+]","Promatch multipliers (21) | Multiplying + element per 2",[8,8],1,Printer.noop,Printer.noop,],
      ["[number+]","Promatch multipliers (22) | Multiplying + element per 1",[8],1,Printer.noop,Printer.noop,],
      ["[number+]","Mismatch multipliers (23) | Multiplying + element per 0",[],0,Printer.noop,Printer.noop,],
      // Multiplicadores/Signo *:
      ["[number*]","Promatch multipliers (30) | Multiplying * element per 3",[8,8,8],1,Printer.noop,Printer.noop,],
      ["[number*]","Promatch multipliers (31) | Multiplying * element per 2",[8,8],1,Printer.noop,Printer.noop,],
      ["[number*]","Promatch multipliers (32) | Multiplying * element per 1",[8],1,Printer.noop,Printer.noop,],
      ["[number*]","Promatch multipliers (33) | Multiplying * element per 0",[],1,Printer.noop,Printer.noop,],
      // Multiplicadores/Ejemplos con signos, variables, spread operator, y negación:
      ["@two [string+, boolean+]; @one [boolean, ...@two]; [string+, ...@one]","Promatch multipliers (201) | Random combination of variables, spread operators and negation",["","","",true,"","","",true,true],1,Printer.noop,Printer.noop,],
      ["[number?, string+, function () => any*];","Promatch multipliers (202) | Random combination",["p1", "p2", "p3", () => {},() => {},() => {},],1,Printer.noop,Printer.noop,],
      ["function(number?, string+, function () => any*) => any;","Promatch multipliers (203) | Random combination", () => {},1,Printer.noop,Printer.noop,],
      
    ];
    const NoDataObject = {};
    for(let index=0; index<allTests.length; index++) {
      let title, expression, data, success, onParsed, onValidated;
      const currentTest = allTests[index];
      if(Array.isArray(currentTest)) {
        [ expression, title, data = NoDataObject, success = true, onParsed = Std.functions.noop, onValidated = Std.functions.noop ] = currentTest;
      } else {
        ({ title = "unnamed", expression, data = NoDataObject, success = true, onParsed = Std.functions.noop, onValidated = Std.functions.noop } = currentTest);
      }
      console.log(`[*] Expression: ${expression}`);
      if(data === NoDataObject) {
        const parsification = await TypesParser.parse(expression);
        onParsed({ event: "onParsed", title, expression, data, success, parsification });
      } else {
        const validation = await TypesValidator.validateData(expression, data);
        onValidated({ event: "onValidated", title, expression, data, success, validation });
        if(!success) assert(validation instanceof Error, `Expression titled «${title}» at index ${index} succeded but should have failed saying «${expression}»`);
        else if(validation instanceof Error) throw validation; // `Expression at index ${index} failed but should have succeeded saying «${expression}»`);
      }
    }
  }

  return;

};