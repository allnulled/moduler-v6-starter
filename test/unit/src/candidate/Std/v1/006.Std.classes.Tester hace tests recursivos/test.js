module.exports = async function ({ Std, devbin }) {
  
  try {
    await Std.classes.Tester.start("Test primero", async function({ tester }) {
      await tester.case("Test 1.1", async function({ tester }) {
        await tester.case("Test 1.1.a", function({ tester }) {});
        await tester.case("Test 1.1.b", function({ tester }) {});
        await tester.case("Test 1.1.c", function({ tester }) {});
        await tester.case("Test 1.1.d", function({ tester }) {});
      });
      await tester.case("Test 1.2", async function({ tester }) {
        await tester.case("Test 1.2.a", function({ tester }) {});
        await tester.case("Test 1.2.b", function({ tester }) {});
        await tester.case("Test 1.2.c", function({ tester }) {});
        await tester.case("Test 1.2.d", function({ tester }) {
          // Error.normalize("1.2.d > 1.2 > primero").rethrow();
        });
      });
      await tester.case("Test 1.3", async function({ tester }) {
        await tester.case("Test 1.3.a", function({ tester }) {});
        await tester.case("Test 1.3.b", function({ tester }) {});
        await tester.case("Test 1.3.c", function({ tester }) {});
        await tester.case("Test 1.3.d", function({ tester }) {});
        // Error.normalize(".3").rethrow();
      });
      await tester.case("Test 1.4", async function({ tester }) {
        await tester.case("Test 1.4.a", function({ tester }) {});
        await tester.case("Test 1.4.b", function({ tester }) {});
        await tester.case("Test 1.4.c", function({ tester }) {});
        await tester.case("Test 1.4.d", function({ tester }) {});
        // Error.normalize(".4").rethrow();
      });
    });
  } catch (error) {
    console.log(error);
  }

};