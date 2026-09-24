module.exports = async function ({ devbin, Std }) {
  const {
    Asserter,
    Checker,
    Tester,
    Urler,
    PropertiesMerger,
  } = Std.all;

  const asserter = Asserter.new;

  Test_de_Asserter_Checker_y_Tester: {
    const checker = Checker.new;
    const exampleTest = await Tester.create({
      title: "Test suite",
      allTests: ["test1", "test2", "test3",],
      test1: () => 600,
      test2: () => 700,
      test3: () => 800,
    }).runAsync("allTests");

    asserter.assert(true, "Asserter.prototype.assert can not throw when input is true (1)");
    asserter.assert(checker.check(false) === false, "Checker.prototype.check can return input (2)");
    asserter.assert(exampleTest === 600, "Tester.prototype.runAsync can return first returned value (3)");
    asserter.assertThrowsSync(() => Error.normalize({ name: "PromotedError", message: "Promoted error" }).rethrow(), "Mensaje de error", { name: "PromotedError" });
    asserter.assertThrowsAsync(async () => Error.normalize({ name: "PromotedError", message: "Promoted error" }).rethrow(), "Mensaje de error", { name: "PromotedError" });
    asserter.assertDoesNotThrowSync(() => { }, "Mensaje de error");
    asserter.assertDoesNotThrowAsync(async () => { }, "Mensaje de error");
  }

  Test_de_Properties_merger: {
    const output = PropertiesMerger.mergeByPropertiesList([
      [["static", "abstraction", "supertypes"], function (a, b) {
        if (!b) return a;
        if (!a) return b;
        return [...a, ...b].filter((v, i, list) => list.indexOf(v) === i);
      }],
      [["static", "abstraction", "id"], function (a, b) {
        return null;
      }],
      [["static", "abstraction", "definition"], function (a, b) {
        return [].concat(a || []).concat(b || []);
      }],
      [["static", "abstraction"], function (a, b) {
        if (!b) return a;
        if (!a) return b;
        return Object.assign({}, a, b);
      }],
    ], [{
      static: {
        abstraction: {
          id: "Class ACW",
          supertypes: ["A", "C", "W"],
          definition: "Alguna Cosa Wapa",
        }
      }
    }, {
      static: {
        abstraction: {
          id: "Class BCD",
          supertypes: ["B", "C", "D"],
          definition: "Bini Cota Duma",
        }
      }
    }, {
      static: {
        abstraction: {
          id: "Class GTD",
          supertypes: ["G", "T", "D"],
          definition: "Gran Top Donut",
        }
      }
    }]);
    asserter.assert(output.static.abstraction.supertypes[0] === "A", "PropertiesMerger puede mezclar propiedades personalizadamente (1)");
    asserter.assert(output.static.abstraction.supertypes[1] === "C", "PropertiesMerger puede mezclar propiedades personalizadamente (2)");
    asserter.assert(output.static.abstraction.supertypes[2] === "W", "PropertiesMerger puede mezclar propiedades personalizadamente (3)");
    asserter.assert(output.static.abstraction.supertypes[3] === "B", "PropertiesMerger puede mezclar propiedades personalizadamente (4)");
    asserter.assert(output.static.abstraction.supertypes[4] === "D", "PropertiesMerger puede mezclar propiedades personalizadamente (5)");
    asserter.assert(output.static.abstraction.supertypes[5] === "G", "PropertiesMerger puede mezclar propiedades personalizadamente (6)");
    asserter.assert(output.static.abstraction.supertypes[6] === "T", "PropertiesMerger puede mezclar propiedades personalizadamente (7)");
    asserter.assert(output.static.abstraction.id === null, "PropertiesMerger puede mezclar propiedades personalizadamente (8)");

    
  }


}