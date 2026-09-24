+ TODOs
+ Tareas de ayer
+ Tareas de hoy
+ Tareas de mañana
 + [ ] Error API
  + [ ] Falta corregir el reporter
   + [ ] Cogerlo del Tester.evaluateDirectory y pasarlo al Error.extension
   + [ ] Nos quedaría un Error.tools.print(errors, errorFormat, frameFormat, errorsJoiner, framesJoiner) que acepta múltiples errores
 + [ ] Tester API
  + [ ] Faltan nuevas funciones
   + [ ] Tester.prototype.start: para iniciar un test collection
   + [ ] Tester.prototype.case: para crear un nuevo caso de uso dentro de la testCollection
   + [ ] Se tiene que poder hacer:
    // Sin título:
    Tester.test(function({ tester, asserter, progresser }) {});
    // Con título:
    Tester.test("Nombre de la colección", async function({ tester }) {
      tester.case("1. Uso habitual", function({ tester, asserter, progresser }) {
        progresser.setTotalSteps(10);
        progresser.advance(1);
        asserter(true, "Primera aserción");
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
      });
      tester.case("2. Uso extraordinario", function({ tester, asserter, progresser }) {
        progresser.setTotalSteps(10);
        progresser.advance(1);
        asserter(false, "Primer fallo");
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
      });
      tester.case("3. Uso insólito - caso 1", function({ tester, asserter, progresser }) {
        progresser.setTotalSteps(10);
        progresser.advance(1);
        asserter(false, "Segundo fallo");
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
        progresser.advance(1);
      });
    }).start();
   + [ ] Otra cosa aquí
   + [ ] Otra más
  + [ ] Más
 + [ ] Otra categoría
  + [ ] Otra categoría
  + [ ] Otra categoría
  + [ ] Otra categoría
 + [ ] Otra categoría
  + [ ] Otra categoría
   + [ ] Otra categoría
   + [ ] Otra categoría
  + [ ] Otra categoría
   + [ ] Otra categoría
  + [ ] Otra categoría