module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows, assertDoesNotThrow } = devbin.tester.asserters;

  const ClassSkiller = class {
    static assert(condition, message) {
      if (!condition) throw new Error(message);
    }
    static isInterface(target, errorClue) {
      this.assert(typeof target === "object", `Target must be object but «${typeof target}» was found instead${errorClue || ""}`);
      const keys = Object.keys(target);
      this.assert(keys.length <= 4, `Target cannot have more than 4 properties but «${keys.length}» keys were found instead${errorClue || ""}`);
      const validKeys = ["static", "prototype", "signatures"];
      const invalidKeys = keys.filter(key => !validKeys.includes(key));
      this.assert(invalidKeys.length === 0, `Target can only have keys «${validKeys.join(",")}» but «${invalidKeys.join(",")}» ${invalidKeys.length === 1 ? "is" : "are"} not among them${errorClue || ""}`);
    }
    static mixInterface(baseInterface, addedInterface, options = {}) {
      this.assert(typeof baseInterface === "object", `Parameter «baseInterface» must be object on «ClassSkiller.mixInterface»`);
      this.assert(typeof addedInterface === "object", `Parameter «addedInterface» must be object on «ClassSkiller.mixInterface»`);
      this.assert(typeof options === "object", `Parameter «options» must be object on «ClassSkiller.mixInterface»`);
      this.isInterface(baseInterface, ` using «ClassSkiller.mixInterface» on parameter «baseInterface»`);
      this.isInterface(addedInterface, ` using «ClassSkiller.mixInterface» on parameter «addedInterface»`);
      const { overridables = [], errorClue = false } = options;
      const interfaceables = ["static", "prototype"];
      for (let indexInterfaceable = 0; indexInterfaceable < interfaceables.length; indexInterfaceable++) {
        const interfaceableProperty = interfaceables[indexInterfaceable];
        const origin = baseInterface[interfaceableProperty] || {};
        const mixable = addedInterface[interfaceableProperty] || {};
        const originDescriptors = Object.getOwnPropertyDescriptors(origin);
        const mixableDescriptors = Object.getOwnPropertyDescriptors(mixable);
        const originKeys = Object.keys(originDescriptors);
        const mixableKeys = Object.keys(mixableDescriptors);
        const conflictiveNames = originKeys.filter(bkey => mixableKeys.includes(bkey) && !overridables.includes(bkey));
        if (conflictiveNames.length) throw new Error(`Cannot mix conflictive properties «${conflictiveNames.join(",")}»${errorClue || ""} on «ClassSkiller.mixInterface»`);
        Object.defineProperties(origin, mixableDescriptors);
      }
      return baseInterface;
    }
    static mixInterfaces(subinterfazes, options = []) {
      const {
        overridables = [],
        errorClue = false,
        base = { static: {}, prototype: {} }
      } = options;
      
      for (let index = 0; index < subinterfazes.length; index++) {
        const subinterfaze = subinterfazes[index];
        this.isInterface(subinterfaze, ` using «ClassSkiller.mixInterfaces» on parameter «subinterfazes» at index «${index}»`);
        this.mixInterface(base, subinterfaze, {
          overridables,
          errorClue: `${errorClue||""} using «ClassSkiller.mixInterfaces» at index «${index}»`,
        });
      }
      return base;
    }
    static addInterfaces(clazz, list) {
      this.assert(typeof clazz === "function", `Parameter «clazz» must be function but «${typeof clazz}» was found instead on «ClassSkiller.addInterfaces»`);
      const interfaze = this.mixInterfaces(list);
      Object.defineProperties(clazz, Object.getOwnPropertyDescriptors(interfaze.static));
      Object.defineProperties(clazz.prototype, Object.getOwnPropertyDescriptors(interfaze.prototype));
      return clazz;
    }
  };

  const MixedInterface1 = ClassSkiller.mixInterfaces([{
    static: {
      staticAction1: function () {
        return "static action 1";
      },
      staticAction2: function () {
        return "static action 2";
      },
    },
    prototype: {
      protoAction1: function () {
        return "prototype action 1";
      },
      protoAction2: function () {
        return "prototype action 2";
      },
    },
    signatures: {},
  }, {
    static: {
      staticAction3: function () {
        return "static action 3";
      },
      staticAction4: function () {
        return "static action 4";
      },
    },
    prototype: {
      protoAction3: function () {
        return "prototype action 3";
      },
      protoAction4: function () {
        return "prototype action 4";
      },
    },
    signatures: {},
  }, {
    static: {
      staticAction5: function () {
        return "static action 5";
      },
      staticAction6: function () {
        return "static action 6";
      },
      get staticCollection3() {
        return ["staticAction5", "staticAction6"];
      },
      set staticallyCommunicable(v) {
        this.staticallyCommunicated = v;
      }
    },
    prototype: {
      protoAction5: function () {
        return "prototype action 5";
      },
      protoAction6: function () {
        return "prototype action 6";
      },
      get protoCollection3() {
        return ["protoAction5", "protoAction6"];
      },
      set protoCommunicable(v) {
        this.protoCommunicated = v;
      }
    },
    signatures: {},
  }]);

  assert(typeof MixedInterface1 === "object", "Fallo nº1: el return del mixInterfaces");
  assert(typeof MixedInterface1.static === "object", "Fallo nº2: la interfaz que devuelve mixInterfaces debe ser una interfaz con su static y prototype");
  assert(typeof MixedInterface1.prototype === "object", "Fallo nº3");
  assert(typeof MixedInterface1.static.staticAction1 === "function", "Fallo nº4: los métodos estáticos");
  assert(typeof MixedInterface1.static.staticAction2 === "function", "Fallo nº5");
  assert(typeof MixedInterface1.static.staticAction3 === "function", "Fallo nº6");
  assert(typeof MixedInterface1.static.staticAction4 === "function", "Fallo nº7");
  assert(typeof MixedInterface1.static.staticAction5 === "function", "Fallo nº8");
  assert(typeof MixedInterface1.static.staticAction6 === "function", "Fallo nº9");
  assert(typeof MixedInterface1.prototype.protoAction1 === "function", "Fallo nº10: los métodos prototipo");
  assert(typeof MixedInterface1.prototype.protoAction2 === "function", "Fallo nº11");
  assert(typeof MixedInterface1.prototype.protoAction3 === "function", "Fallo nº12");
  assert(typeof MixedInterface1.prototype.protoAction4 === "function", "Fallo nº13");
  assert(typeof MixedInterface1.prototype.protoAction5 === "function", "Fallo nº14");
  assert(typeof MixedInterface1.prototype.protoAction6 === "function", "Fallo nº15");

  const ExtraInterface1 = {
    static: {},
    prototype: {},
  }

  class BasicInterface1 {
    static {
      ClassSkiller.addInterfaces(this, [
        MixedInterface1,
        ExtraInterface1,
      ]);
    }
  };

  await assertDoesNotThrow("Puede aplicar interfaces con getters y setters en clases", () => {
    const bint1 = new BasicInterface1();
    Los_metodos_estaticos: {
      BasicInterface1.staticAction1();
      BasicInterface1.staticAction2();
      BasicInterface1.staticAction3();
      BasicInterface1.staticAction4();
      BasicInterface1.staticAction5();
      BasicInterface1.staticAction6();
    }
    Los_metodos_prototipo: {
      bint1.protoAction1();
      bint1.protoAction2();
      bint1.protoAction3();
      bint1.protoAction4();
      bint1.protoAction5();
      bint1.protoAction6();
    }
    El_getter_prototipo: {
      assert(bint1.protoCollection3[0] === "protoAction5", "Fallo nº16: los getters del prototipo");
      assert(bint1.protoCollection3[1] === "protoAction6", "Fallo nº17");
    }
    El_getter_estatico: {
      assert(bint1.constructor.staticCollection3[0] === "staticAction5", "Fallo nº16: los getters del estático");
      assert(bint1.constructor.staticCollection3[1] === "staticAction6", "Fallo nº18");
    }
    El_setter_prototipo: {
      assert(typeof bint1.protoCommunicated === "undefined", "Fallo nº19");
      bint1.protoCommunicable = "OK";
      assert(bint1.protoCommunicated === "OK", "Fallo nº20 los setters del prototipo");
    }
    El_setter_estatico: {
      assert(typeof bint1.constructor.staticallyCommunicated === "undefined", "Fallo nº21");
      bint1.constructor.staticallyCommunicable = "OK";
      assert(bint1.constructor.staticallyCommunicated === "OK", "Fallo nº22: los setters del estático");
    }
  });


  await assertThrows("ClassSkiller.mixInterfaces no puede sobreescribir métodos sin overridables especificado", () => {
    ClassSkiller.mixInterfaces([{
      static: {
        a: 900,
      }
    }, {
      static: {
        a: 1000,
      }
    }]);
  });

  await assertDoesNotThrow("ClassSkiller.mixInterfaces sí puede sobreescribir métodos con overridables especificado", () => {
    ClassSkiller.mixInterfaces([{
      static: {
        a: 900,
      }
    }, {
      static: {
        a: 1000,
      }
    }], {
      overridables: ["a"]
    });
  });

}