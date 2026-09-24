┌{ # TODOs }───────···
│├─{ 1 } Tareas de ayer
│├─{ 2 } Tareas de hoy
│└┬{ 3 } Tareas de mañana
│ ├┬{ 3.1 } [ ] Error API
│ │└┬{ 3.1.1 } [ ] Falta corregir el reporter
│ │ ├─{ 3.1.1.1 } [ ] Cogerlo del Tester.evaluateDirectory y pasarlo al Error.extension
│ │ └─{ 3.1.1.2 } [ ] Nos quedaría un Error.tools.print(errors, errorFormat, frameFormat, errorsJoiner, framesJoiner) que acepta múltiples errores
│ ├┬{ 3.2 } [ ] Tester API
│ │├┬{ 3.2.1 } [ ] Faltan nuevas funciones
│ ││├─{ 3.2.1.1 } [ ] Tester.prototype.start: para iniciar un test collection
│ ││├─{ 3.2.1.2 } [ ] Tester.prototype.case: para crear un nuevo caso de uso dentro de la testCollection
│ ││├─{ 3.2.1.3 } [ ] Se tiene que poder hacer:
│ │││  // Sin título:
│ │││  Tester.test(function({ tester, asserter, progresser }) {});
│ │││  // Con título:
│ │││  Tester.test("Nombre de la colección", async function({ tester }) {
│ │││    tester.case("1. Uso habitual", function({ tester, asserter, progresser }) {
│ │││      progresser.setTotalSteps(10);
│ │││      progresser.advance(1);
│ │││      asserter(true, "Primera aserción");
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││    });
│ │││    tester.case("2. Uso extraordinario", function({ tester, asserter, progresser }) {
│ │││      progresser.setTotalSteps(10);
│ │││      progresser.advance(1);
│ │││      asserter(false, "Primer fallo");
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││    });
│ │││    tester.case("3. Uso insólito - caso 1", function({ tester, asserter, progresser }) {
│ │││      progresser.setTotalSteps(10);
│ │││      progresser.advance(1);
│ │││      asserter(false, "Segundo fallo");
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││      progresser.advance(1);
│ │││    });
│ │││  }).start();
│ ││├─{ 3.2.1.4 } [ ] Otra cosa aquí
│ ││└─{ 3.2.1.5 } [ ] Otra más
│ │└─{ 3.2.2 } [ ] Más
│ ├┬{ 3.3 } [ ] Otra categoría
│ │├─{ 3.3.1 } [ ] Otra categoría
│ │├─{ 3.3.2 } [ ] Otra categoría
│ │└─{ 3.3.3 } [ ] Otra categoría
│ └┬{ 3.4 } [ ] Otra categoría
│  ├┬{ 3.4.1 } [ ] Otra categoría
│  │├─{ 3.4.1.1 } [ ] Otra categoría
│  │└─{ 3.4.1.2 } [ ] Otra categoría
│  ├┬{ 3.4.2 } [ ] Otra categoría
│  │└─{ 3.4.2.1 } [ ] Otra categoría
│  └─{ 3.4.3 } [ ] Otra categoría