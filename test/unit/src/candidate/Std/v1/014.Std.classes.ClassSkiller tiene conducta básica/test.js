module.exports = async function ({ devbin, Std }) {

  const { assert, assertThrows } = devbin.tester.asserters;

  const { ClassSkiller } = Std.all;

  Ejemplo_de_extender_class_y_object: {

    const Proto1 = {
      config(props) {
        return Object.assign(this, props);
      },
      hi() {
        return `Hi, ${this.name}!`;
      }
    };

    const Static1 = {
      get new() {
        if (typeof this === "object") return Object.create(Object.getPrototypeOf(this), { prototype: this.prototype });
        return new this();
      },
    };

    Test_con_clase: {
      const NuevaClase = class {
        static {
          ClassSkiller.addStatic(this, Static1);
          ClassSkiller.addPrototype(this, Proto1);
        }
      };
      const greetings1 = NuevaClase.new.config({ name: "ok" }).hi();
      assert(greetings1 === "Hi, ok!", "ClassSkiller.{addStatic,addPrototype} pueden extender clase (1)");
    }

    Test_con_objeto: {
      const NuevoObjeto = {};
      ClassSkiller.addStatic(NuevoObjeto, Static1);
      ClassSkiller.addPrototype(NuevoObjeto, Proto1);
      assert(NuevoObjeto === NuevoObjeto, "ClassSkiller puede extender objeto pivotando en el «prototype» igual que function (1)");
      assert(NuevoObjeto !== NuevoObjeto.new, "ClassSkiller puede extender objeto pivotando en el «prototype» igual que function (2)");
      assert(Object.getPrototypeOf(NuevoObjeto) === Object.getPrototypeOf(NuevoObjeto.new), "ClassSkiller puede extender objeto pivotando en el «prototype» igual que function (3)");
      assert(NuevoObjeto.prototype === Object.getPrototypeOf(NuevoObjeto.new));
      assert(NuevoObjeto.prototype !== NuevoObjeto.new.prototype);
      const greetings2 = NuevoObjeto.new.config({ name: "rock" }).hi();
      assert(greetings2 === "Hi, rock!", "ClassSkiller.{addStatic,addPrototype} pueden extender objeto (9)");
    }

    Test_con_miembro_ambiguo_salta_error: {
      assertThrows(() => ClassSkiller.addStatic({
        name: "something"
      }, {
        name: "other thing"
      }), "ClassSkiller.addStatic avisa cuando hay sobreescritura sin flag de confirmación (10)", {
        name: "ForbiddenOverrideError",
        message: "Property «name» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addStatic»"
      });
      assertThrows(() => ClassSkiller.addPrototype({
        name: "something"
      }, {
        name: "other thing"
      }), "ClassSkiller.addStatic avisa cuando hay sobreescritura sin flag de confirmación (10)", {
        name: "ForbiddenOverrideError",
        message: "Property «name» cannot be overriden as member unless specified so in «overriders» parameter on «ClassSkiller.addPrototype»",
      });
    }

    Probando_metodos_de_reflexion_con_objeto: {
      const example = {
        name: "text",
        get picker() {
          return "more text";
        }
      };
      const desc1 = ClassSkiller.getDescriptors(example);
      assert(Object.keys(desc1).includes("picker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores de un objeto (11)");
      const desc2 = ClassSkiller.getDescriptors(example, ClassSkiller.filters.members);
      assert(Object.keys(desc2).includes("name"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores de un objeto (12)");
      assert(!Object.keys(desc2).includes("picker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores de un objeto (13)");
      const desc3 = ClassSkiller.getDescriptors(example, ClassSkiller.filters.accessors);
      assert(!Object.keys(desc3).includes("name"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores de un objeto (14)");
      assert(Object.keys(desc3).includes("picker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores de un objeto (15)");
    }

    Probando_metodos_de_reflexion_con_clase: {
      const example = class {
        static {
          Object.assign(this, { clazz: "jazz" });
          Object.assign(this.prototype, { name: "text" });
        }
        static get megapicker() {
          return "some melodies";
        }
        get picker() {
          return "more text";
        }
      };
      El_prototype_se_encuentra_si_se_define_bien_desde_el_static: {
        const desc1 = ClassSkiller.getDescriptors(example.prototype);
        assert(Object.keys(desc1).includes("picker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores prototipo de una clase (21)");
        const desc2 = ClassSkiller.getDescriptors(example.prototype, ClassSkiller.filters.members);
        assert(Object.keys(desc2).includes("name"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores prototipo de una clase (22)");
        assert(!Object.keys(desc2).includes("picker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores prototipo de una clase (23)");
        const desc3 = ClassSkiller.getDescriptors(example.prototype, ClassSkiller.filters.accessors);
        assert(!Object.keys(desc3).includes("name"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores prototipo de una clase (24)");
        assert(Object.keys(desc3).includes("picker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores prototipo de una clase (25)");
      }
      El_static_se_encuentra: {
        const desc1 = ClassSkiller.getDescriptors(example);
        assert(Object.keys(desc1).includes("megapicker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores estáticos de una clase (31)");
        const desc2 = ClassSkiller.getDescriptors(example, ClassSkiller.filters.members);
        assert(Object.keys(desc2).includes("clazz"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores estáticos de una clase (32)");
        assert(!Object.keys(desc2).includes("megapicker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores estáticos de una clase (33)");
        const desc3 = ClassSkiller.getDescriptors(example, ClassSkiller.filters.accessors);
        assert(!Object.keys(desc3).includes("clazz"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores estáticos de una clase (34)");
        assert(Object.keys(desc3).includes("megapicker"), "ClassSkiller.getDescriptors puede encontrar todos los miembros y accesores estáticos de una clase (35)");
      }
    }

    const exampleInterface1 = {
      static: {
        steps: [],
        is1() {this.steps.push("is1")}
      },
      prototype: {
        protosteps: [],
        ip1() {this.protosteps.push("ip1")}
      }
    };
    const exampleInterface2 = {
      static: {
        is2() {this.steps.push("is2")}
      },
      prototype: {
        ip2() {this.protosteps.push("ip2")}
      }
    };
    const exampleInterface3 = {
      static: {
        is3() {this.steps.push("is3")},
        get clazzId() { return "zip" }
      },
      prototype: {
        ip3() {this.protosteps.push("ip3")},
        get message() { return "uip" }
      }
    };
    Metodo_de_interfaces_con_objetos: {
      const input = {};
      ClassSkiller.addInterface(input, exampleInterface1);
      ClassSkiller.addInterface(input, exampleInterface2);
      ClassSkiller.addInterface(input, exampleInterface3);
      input.is1();
      input.is2();
      input.prototype.ip1();
      input.prototype.ip2();
      assert(input.steps[0] === "is1", "ClassSkiller.addInterface puede decorar un objeto con static (51)");
      assert(input.steps[1] === "is2", "ClassSkiller.addInterface puede decorar un objeto con static (52)");
      assert(input.clazzId === "zip", "ClassSkiller.addInterface puede decorar un objeto con prototype usando accesores (53)");
      assert(input.prototype.protosteps[0] === "ip1", "ClassSkiller.addInterface puede decorar un objeto con prototype (56)");
      assert(input.prototype.protosteps[1] === "ip2", "ClassSkiller.addInterface puede decorar un objeto con prototype (57)");
      assert(input.prototype.message === "uip", "ClassSkiller.addInterface puede decorar un objeto con prototype usando accesores (58)");
    }

    Metodo_de_interfaces_con_clases: {
      const clazz = class {
        static {
          ClassSkiller.addInterface(this, exampleInterface1);
          ClassSkiller.addInterface(this, exampleInterface2);
          ClassSkiller.addInterface(this, exampleInterface3);
        }
      };
      clazz.is1();
      clazz.is2();
      const instanze = new clazz();
      instanze.ip1();
      instanze.ip2();
      assert(clazz.steps[0] === "is1", "ClassSkiller.addInterface puede decorar una clase con static (61)");
      assert(clazz.steps[1] === "is2", "ClassSkiller.addInterface puede decorar una clase con static (62)");
      assert(clazz.clazzId === "zip", "ClassSkiller.addInterface puede decorar un objeto con prototype usando accesores (63)");
      assert(instanze.protosteps[0] === "ip1", "ClassSkiller.addInterface puede decorar una clase con prototype (66)");
      assert(instanze.protosteps[1] === "ip2", "ClassSkiller.addInterface puede decorar una clase con prototype (67)");
      assert(instanze.message === "uip", "ClassSkiller.addInterface puede decorar un objeto con prototype usando accesores (68)");
    }

  }

};