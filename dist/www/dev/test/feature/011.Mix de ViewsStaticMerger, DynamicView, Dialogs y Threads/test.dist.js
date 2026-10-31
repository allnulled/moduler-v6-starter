module.exports = async function ({ Tester }) {

  const {
    ViewsRegistry,
    ViewsStaticMerger,
    DynamicView,
    Dialogs,
    DialogsFactory,
    DialogsPort,
    Threads,
  } = Std.all;

  const extractions = {
    ViewsRegistry,
    ViewsStaticMerger,
    DynamicView,
    Dialogs,
    DialogsFactory,
    DialogsPort,
    Threads,
  };

  {
    const calls = [];
    const firstCreated = function () {
      calls.push("first");
    };
    const secondCreated = function () {
      calls.push("second");
    };
    const firstWatch = function () {
      calls.push("watch-first");
    };
    const secondWatch = function () {
      calls.push("watch-second");
    };
    const first = {
      methods: {
        firstMethod() {
          return "first";
        },
      },
      computed: {
        firstComputed() {
          return 1;
        },
      },
      watch: {
        value: firstWatch,
      },
      created: firstCreated,
    };
    const second = {
      methods: {
        secondMethod() {
          return "second";
        },
      },
      computed: {
        secondComputed() {
          return 2;
        },
      },
      watch: {
        value: secondWatch,
      },
      created: secondCreated,
    };
    const merged = ViewsStaticMerger.mergeViews(
      [first, {}],
      [second, {}]
    );
    // Methods
    $moduler.assert("first" === merged.methods.firstMethod());
    $moduler.assert("second" === merged.methods.secondMethod());
    // Computed
    $moduler.assert(1 === merged.computed.firstComputed());
    $moduler.assert(2 === merged.computed.secondComputed());
    // Watch: ambos observadores deben conservarse.
    $moduler.assert(Array.isArray(merged.watch.value));
    $moduler.assert(2 === merged.watch.value.length);
    $moduler.assert(firstWatch === merged.watch.value[0]);
    $moduler.assert(secondWatch === merged.watch.value[1]);
    // Lifecycle: ambos hooks deben conservarse en orden.
    $moduler.assert(Array.isArray(merged.created));
    $moduler.assert(2 === merged.created.length);
    merged.created[0]();
    merged.created[1]();
    $moduler.assert(calls[0], "first");
    $moduler.assert(calls[1], "second");
    // Las estructuras originales no deben modificarse.
    $moduler.assert(firstWatch === first.watch.value);
    $moduler.assert(secondWatch === second.watch.value);
    $moduler.assert(firstCreated === first.created);
    $moduler.assert(secondCreated === second.created);
    // console.log("OK: mergeo de propiedades compatibles");
  }

  // ------------------------------------------------------------
  // 3. Duplicidad incompatible
  // ------------------------------------------------------------

  {
    const first = {
      methods: {
        save() {
          return "first";
        },
      },
    };
    const second = {
      methods: {
        save() {
          return "second";
        },
      },
    };
    Std.classes.Asserter.new.assertThrowsSync(
      () => ViewsStaticMerger.mergeViews([first, {}], [second, {}]),
      "Some properties cannot match between elements in merge operation",
      error => {
        $moduler.assert(error.message.match(/Duplicated property/g));
        $moduler.assert(error.name === "AssertionError");
        return error;
      },
    );
    // console.log("OK: detección de métodos duplicados");
  }
  // ------------------------------------------------------------
  // 4. Referencias originales
  // ------------------------------------------------------------
  {
    const method = function () {
      return true;
    };
    const first = {methods: {method,},};
    const merged = ViewsStaticMerger.mergeViews([first, {}]);
    $moduler.assert(method === merged.methods.method);
    $moduler.assert(merged.methods !== first.methods);
    // console.log("OK: referencias conservadas sin compartir el contenedor");
  }

  console.log("Todos los tests han finalizado correctamente.");



  // console.log(extractions);


};