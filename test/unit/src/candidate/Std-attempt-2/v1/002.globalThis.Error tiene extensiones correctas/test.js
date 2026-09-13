module.exports = async function ({ devbin, Std }) {

  const assert = (...args) => devbin.assert(...args);
  const assertThrows = (...args) => devbin.tester.assertThrows(...args);

  Sintaxis_de_creacion_por_string: {
    const error1 = Error.create("Mensaje de error");
    const error2 = Error.create({ name: "NormalError", message: "More info" });
    const error3 = new Error("Unique instance");
    const error4 = Error.create(error3);
    assert(error1.message === "Mensaje de error", "Error.create(String) [1]");
    assert(error2.name === "NormalError", "Error.create(Object) [1]");
    assert(error2.message === "More info", "Error.create(Object) [2]");
    assert(error3 === error4, "Error.create(Error) [1]");
  }

  Sintaxis_de_throw: {
    assertThrows(() => Error.create({ name: "StrangeError", message: "OKKK" }).throw());
    assertThrows(() => Error.throw("Un error"));
  }

  Sintaxis_de_handler: {
    Error.toThrower("Un error mas");
    Error.toThrower("Un error mas", console.log);
    assertThrows(() => Error.create("Un error mas").handle(error)); // el de los catch sincronos
  }

  Sintaxis_de_handler_en_Promises: {
    let reject = undefined;
    const somePromise = new Promise((resolve, _reject) => { reject = _reject; });
    assertThrows(() => somePromise.catch(Error.create("Error concreto 1").handle));
    assertThrows(() => somePromise.catch(Error.create("Error concreto 2").toThrower()));
    assertThrows(() => somePromise.catch(Error.toThrower({ name: "error tipico", message: "Error concreto 3" })));
    assertThrows(() => somePromise.catch(Error.toThrower("Error concreto 4")));
    assertThrows(() => somePromise.catch(Error.toThrower("Error concreto 5"))); // el de los catch asínronos en Promis)e
    somePromise.catch(Error.silencer); // el de los catch asínronos en Promise
    somePromise.catch(() => undefined); // el de los catch asínronos en Promise
    // reject(Error.create("Original error"));
  }

  Sintaxis_de_error_switcher: {
    break Sintaxis_de_error_switcher;
    // @TODO: funcionalidad pendiente
    Error.switcher(error => {
      if(error.message.startsWith("ENOENT")) return "FileNotFoundError";
      if(error.message.startsWith("Parameter «")) return "BadParametersError";
    }, {
      FileNotFoundError: {name: "File not found error", message: "The file %s was not found" },
      DeniedPermissionError: {name: "Denied permission error", message: "The file %s can not be accessed due to permission issues" },
      BadFormatError: {name: "Bad format error", message: "The file %s can not be accessed due to permission issues" },
      BadParametersError: {name: "Bad parameters error", message: "The parameter %s was expected to be string" },
    }).from(error);

    Error.switch(error => {}, {}).toThrower();
  }

  Sintaxis_de_error_toObject: {
    // @TODO: funcionalidad pendiente
    break Sintaxis_de_error_toObject;
    Error.toObject(new Error("Something"));
    Error.create("Something").toObject();
  }

  Sintaxis_de_error_toInvestigation: {
    // @TODO: funcionalidad pendiente
    break Sintaxis_de_error_toInvestigation;
    Error.toInvestigation(new Error("Something"));
    Error.create("Something").toInvestigation();
  }

  Sintaxis_de_error_toPrint: {
    // @TODO: funcionalidad pendiente
    break Sintaxis_de_error_toPrint;
    Error.toPrint(new Error("Something"));
    Error.create("Something").toPrint();
  }

};