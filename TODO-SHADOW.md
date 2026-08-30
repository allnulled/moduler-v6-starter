- [ ] BUG: conseguir que al guardar un unit test se ejecute solamente él.


- [ ] API: el Reactor
   - [ ] hacer test que use funciones
   - [ ] documentar un README de la API
- [ ] BUG: mejorar el $compiler.inject.module
   - [ ] para que no polucione ni haga tanto ruido
   - [ ] meter el _initializeModule y el _exportModule para minimizar el ruido, solo const {module,exports,__originalModule}
   - [ ] que quede mucho más recogido el output, y sin proxies, gracias
- [ ] FEATURE: el $compiler.inject.modules
   - [ ] para agrupar varios módulos
   - [ ] con un _initializeModuleGroup y un _exportModuleGroup
   - [ ] con ellos comprometes todos los módulos y sus rutas de fichero desde el principio del script
   - [ ] así no se escapan llamadas AJAX ni lecturas de ficheros
      - [ ] ni se confunde la fuente de verdad de ese módulo
      - [ ] que ahora es el script actual
- [ ] API: el Propagator
   - [ ] poder incluir picomatch con inject.source
   - [ ] FEATURE: comando «devbin build node module --of picomatch --to "@/src/www/external/picomatch/picomatch.entry.js"»
      - [ ] llama a «npx esbuild» contra el package.json#main del node_modules/{--of} especificado y lo escribe con ensureFile en el {--to} especificado
      - [ ] te interesa generar los entry para luego incluir ese dist donde quieras tú luego o ponerle cabeceras estandarizadas y cosas así
         - [ ] no alterarlo, pero sí adaptarlo, para que funcione como esperarías
         - [ ] y poder inyectarlo a conveniencia
         - [ ] por eso se pone como *.entry.js en src y no como *.dist.js en dist
            - [ ] pero cuidado, el *.entry.js va a ser parseado por sintaxis que estos desarrolladores no conocen, por lo cual puede darnos algún problema COMPILAR fuentes externas
            - [ ] pronto vendrá al rescate un $compiler.inject.rawSource para poder inyectar ficheros sin preocuparte de que no respeten las sintaxis
            - [ ] pronto vendrá al rescate un *.raw.js en el touchFile para que en estos casos ni dudes, simplemente pongas la extensión, y el touch ya respete

- [ ] API: el Reactor
   - [ ] API: con su
      - [ ] .trigger(tal, parameters)
      - [ ] .on(tal).{before,after,insteadOf}(cual|true|false|null).set(pascual)
         - [ ] donde true es "la función propia"
            - [ ] before es antes de la función propia
            - [ ] after es después de la función propia
            - [ ] instead puede confundir pero mantiene el símbolo de la función original pero en donde hay true, pone un símbolo a la nueva función
            - [ ] esto significa que para que una función se ejecute usándose como símbolo, necesita inicializarse con [true]
            - [ ] por tanto cualquier función que pase por el sistema ocupará un [true] mínimo
            - [ ] por tanto cuando haces on(tal).insteadOf(true).set(whatever) te estás cargando la llamada a la función propia del símbolo (desde trigger, el puntero no se toca en ningún momento)
               - [ ] puedes recuperarla con on(tal).before(null).set(true) // antes de "cualquiera" mete "la función propia"
               - [ ] el .set no acepta 0
               - [ ] el 0 solo tiene sentido como selector pero no como valor en el array de listeners
               - [ ] el true sí tiene sentido como selector y como valor en el array de listeners
         - [ ] donde 1 es "cualquier evento"
            - [ ] before es prepend
            - [ ] after es append
            - [ ] insteadOf es reset

      - [ ] Reactor.prototype.trigger(selector, [subselector,]? parametros)
      - [ ] Reactor.prototype.on(selector).{before,after,insteadOf}(subselector).set(reaccion)
         - [ ] donde selector:String|Function
            - [ ] String usará el v in reactions
            - [ ] Function usará el Symbol(v) + in reactions
         - [ ] donde subselector:String|Function|true|null
            - [ ] donde String significa reaction.indexOf(v)
            - [ ] donde Function significa Symbol(v) + reaction.indexOf(-)
            - [ ] donde true significa la misma función pero usará reaction.indexOf(-)
            - [ ] donde null significa cualquier función y usará pos -1 o pos .length según before o after
               - [ ] y con insteadOf(null).set(fn.whatever) se carga toda la lista y pone esta solamente
               - [ ] así que cuidado con ".insteadOf(null).set(" porque es un indicador de bestiality
               - [ ] pero puedes limpiar triggers adjuntos simplemente con `reactor.on(fns.whate).insteadOf(null).set(true)`
                  - [ ] con esto le dices en el símbolo tal, en lugar de toda la bullshit que haya, ponle la función que es
               - [ ] otros patrones interesantes pueden ser:
                  - [ ] `reactor.on(fns.whate).before(true).set(hook)`: prependiza a la función original, si no aparece, lanza error
                  - [ ] `reactor.on(fns.whate).after(true).set(done)`: apendiza a la función original, si no aparece, lanza error
                  - [ ] `reactor.on(fns.whate).before(null).set(intro)`: prependiza a todo el bloque
                  - [ ] `reactor.on(fns.whate).after(null).set(format)`: apendiza a todo el bloque
         - [ ] donde parametros:Object
         - [ ] donde reaccion:String|Function|true
            - [ ] donde String es un this.reactions
            - [ ] donde Function es un this.reactions con Symbol(v)
            - [ ] donde true es: la función original de este símbolo
            - [ ] donde null NO ES POSIBLE USARLO
- Te va quedando una API que permite:
```js

const fns = {
   a: function({ reactor, message = "" }) {
      reactor.state.message += message + "a";
   },
   b: function({ reactor, message = "" }) {
      reactor.state.message += message + "b";
   },
   c: function({ reactor, message = "" }) {
      reactor.state.message += message + "c";
   }
};
let reactor;
reactor = Reactor.create({ message: "" });
reactor.on(fns.a).follow(fns.b).follow(fns.c);
// Que en la API anterior sería:
reactor.on(fns.a).after(null).set(b);
reactor.on(fns.a).after(fns.b).set(fns.c);
// Que también sería lo mismo que:
reactor.define(fns).on("a").follow("b").follow("c");
// Pero cuidado, las function con nombre aparecen 2 veces en la tabla:
reactor.on("a"); // Se refiere a la lista de eventos cuando usas la clave de string "a"
reactor.on(fns.a); // Se refiere a la lista de eventos cuando usas la clave de Function to Symbol de fns.a
// Si te fijas, en ningún caso es que estrictamente, se refiera a la función: porque puedes falsear la tabla
// Porque si no está el `true` en la lista de eventos, aunque sea el symbol de esa función, esa función no se llamará si se usa el prototy.trigger
// Y aquí un ejemplo del trigger
reactor.trigger(a, { message: "ok:" });
assert(reactor.state.message === "ok:abc", "Can use methods Reactor.create, Reactor.prototype.{on,trigger} and Causalism.prototype.follow as expected (1)");
```

- [ ] FEATURE: mejorar el $compiler.inject.module
   - [ ] mejorar el snippet de inyección
   - [ ] que sobreescriba $moduler.modules
   - [ ] que sobreescriba $moduler.sections según el sectionsMap
- [ ] FEATURE: incorporar la instrucción de compilación de bundling $compiler.inject.modules
   - [ ] como $compiler.inject.module pero acepta un array de strings
   - [ ] él mismo los ordena, por lo que no tienes que preocuparte de cuál va antes y cuál después
   - [ ] [5566] TIENE QUE HACER UN LOCK O ALGO PARA QUE AL EMPEZAR EL BLOQUE YA DIGA OK, TODOS ESTOS, ESTÁN VINIENDO
      - [ ] probablemente dejar promises sería la solución por defecto
      - [ ] pero se perderían por el camino, mientras son sobreescritas
      - [ ] por tanto hay que pensar un poco más esto
         - [ ] podría haber una estructura de cacheo
         - [ ] lo que no puedo mantener es una Promise donde va a ir un número
         - [ ] y no debería plantearme ahora suplantar al número con una Promise tampoco
         - [ ] por tanto no veo una solución, o es una o es la otra
         - [ ] empiezo a entender por qué se usa el export.<prop> en lugar del module.exports
            - [ ] el export.<prop> te asegura que va a existir desde el primer momento
            - [ ] por tanto, no hay error de que no exista el módulo
            - [ ] sin embargo, sabes lo que sí hay? race conditions
            - [ ] es decir, puede que no te de el error de que no encuentra el módulo
            - [ ] pero una instrucción puede intentar querer acceder a una propiedad que todavía no está definida
            - [ ] por tanto se sigue sucediendo el escenario de race condition
            - [ ] por fallback, la mejor opción pasa a ser wrapearlos en Promise siempre a todos
            - [ ] haces que exista desde el principio
            - [ ] entonces desde el primer momento, ese módulo ya existe
               - [ ] crea una Promise que tenga en su prototype un "resolve" y "reject"
               - [ ] permite a los módulos resolver la Resolvable: $moduler.modules["@/whatever.js"].resolve(400)
               - [ ] el snippet tiene que hacer:
                  - [ ] 1. exportar Resolvable al módulo 
                     - [ ] ESTO ES MUY IMPORTANTE
                     - [ ] ESTAMOS DICIENDO:
                        - [ ] para que un módulo programático js sea compatible con la inyección en compilation time
                        - [ ] hay que pensar que siempre que se use,
                        - [ ] aunque devuelva un valor síncronamente, con module.exports
                        - [ ] debemos recogerlo como si de una Promise se tratara
                        - [ ] porque en los casos donde es síncrono
                        - [ ] podría llevarnos a race conditions igualmente
                        - [ ] todo esto es por lo que digo en 5566
                        - [ ] al empezar un bloque pueden pasar muchas cosas
                        - [ ] ponte en una fácil que te va a complicar:
                           - [ ] cargas los scripts
                           - [ ] el compilador te los ha ordenado según las dependencias y todo, ok
                              - [ ] hasta sections, que ahí el compilador ya no se mete
                           - [ ] pero lo que sucede es que:
                             - [ ] CASE 1: todo ok
                               - [ ] un Script100 empieza la carga
                               - [ ] requiere de un Script99 y Script98
                               - [ ] pero él lo hace vía $compiler.inject.source
                               - [ ] por tanto carga primero los otros
                               - [ ] pasa al Script98
                               - [ ] pasa al Script99
                               - [ ] pasa al Script100
                               - [ ] completa el script, todo ha salido bien
                             - [ ] CASE 2: race condition
                               - [ ] un Script100 requiere de fichero Script99.js y Script98.js
                               - [ ] pero él lo hace con $moduler.import
                                  - [ ] combina $compile.inject.{source,module} para concatenar varios $moduler.import
                                  - [ ] que es el caso precisamente por el cual se hace esta feature
                                  - [ ] y que coincide con el main script donde juntas todos los scripts desde el alto nivel
                                  - [ ] pero esto está mal, si tú inyectas el source de un module.import
                                     - [ ] estás desvinculando la ruta del fichero (se la das al $compiler) con el contenido (que emplea a $moduler.import)
                                     - [ ] esto provocará primero que las rutas locales dejen de servir: no puedes usar "./" ni "../", solo "@/"
                                     - [ ] esto provocará primero que las rutas de los ficheros no se cacheen
                                        - [ ] y si vuelven a importar ese fichero, el $moduler intentará ir a buscarlo
                                        - [ ] a no ser que hagas export o sectionsMap y uses el selector de sección, que entonces sí se cachea
                                           - [ ] pero te obligaría a meter por caché a todos los módulos para poder reusar las definiciones
                                           - [ ] y en ficheros te dejaría en pelotas, e incurriría si te descuidas en esto
                                           - [ ] no es una circunstancia aceptable realmente
                                           - [ ] hay que dar algún tipo de soporte a ficheros desde el primer momento
                                           - [ ] la única norma que cambia es que siempre espera una Promise de un import de fichero
                                              - [ ] algo que estaba ahí flotando
                                              - [ ] que estábamos contentos de no haber forzado
                                              - [ ] pero que llegados a aquí, y para dar full-support al compiler, pues, hay que incorporar, y estaremos contentos de hacerlo
                                              - [ ] esto nos permitirá tener bundling inline
                                                 - [ ] compatible 98% con modulación programática (solo cambia lo de que siempre serían Promise si estás en un bundleo de $compiler.inject.modules)
                                                 - [ ] no ordenará los módulos leyendo sus dependencias porque las Promise ya hacen que no sea necesario
                               - [ ] el Script99.js no existe en el $moduler.modules
                                  - [ ] tiene que ir a buscarlo y evaluarlo
                               - [ ] si hay un lock al principio del bloque
                                  - [ ] donde nada más entrar ya está una Promise diciendo que va a llegar
                                  - [ ] el script se parará en los puntos de espera en cada hilo, como esperaríamos intuitivamente
                                  - [ ] pero no sucederá que el valor tenga su valor estático síncrono original 
                                     - [ ] siempre es una Promise
                                     - [ ] por eso hay que usarlo con await siempre
                                  - [ ] ni tampoco sucederá que se quede vacío en ningún momento
      - [ ] Por tanto dos métodos
```js
$moduler.reserve([
   "@/dist/www/src/modulo-1.dist.js",
   "@/dist/www/src/modulo-2.dist.js",
   "@/dist/www/src/modulo-3.dist.js",
   "@/dist/www/src/modulo-4.dist.js",
]);
// Todos los módulos aquí
Modulo_1: {
   // Y al final de cada módulo:
   $moduler.serve("@/dist/....js", {});
}
// Y al final nada porque esto ya es una Promise
```
      - [ ] Este método
      - [ ] Solo lo usa el $compiler.inject.modules
         - [ ] Para cargar de golpe varios módulos
         - [ ] Dejarlos en precarga asíncrona
         - [ ] Los .has y los .then funcionarán correctamente
         - [ ] Los raw module no funcionarán correctamente: todos serán Promise
         - [ ] Pero te aseguras que desde el primer momento del bloque de $compiler.inject.modules
            - [ ] Todos los ficheros se van a resolver en orden y sin llamadas
            - [ ] Todos los ficheros van a estar disponibles desde el primer momento del script
            - [ ] Eso sí, pierdes que todos en formato de Promise




- [ ] VirtualFilesystem API + test
   - [ ] nodejs
   - [ ] normalizar test browser
   - [ ] localstorage
   - [ ] indexeddb
   - [ ] sockets no






- [ ] Limpiar el starter:
   - [x] vaciar el src excepto lib
   - [x] pasar lib a external
      - [ ] con los cambios en el devbin
   - [ ] vaciar el test/unit
   - [ ] vaciar el test/{feature,integrity}/runner.js
      - [ ] incorporar un método para llamar a todos los tests de 1 directorio
         - [ ] a los js directos (opción A)
         - [ ] a 1 js específico dentro de las carpetas (opción B)
- [ ] Preparar el starter mínimo bien limpio
   - [ ] un $moduler.css.link iría bien
      - [ ] sin trackeo ahora no importa
   - [ ] un $moduler.js.script iría bien
      - [ ] sin trackeo ahora no importa
   - [ ] y que en el index.html
      - [ ] ya sabiendo si es test o no automáticamente $moduler
      - [ ] te meta el $moduler.js.script contra el socket.io + client porque sabe que está con refrescador
      - [ ] y ese condicional inicial (de si es test o dev, vaya, pues incluyo), encapsularlo en un Runtime.initialize o algo así.
   - [ ] sobre todo la idea es empezar con un boilerplate:
      - [ ] limpio, despejado: sin ficheros haciendo bulto, solo ficheros customizables o estrictamente necesarios
      - [ ] experto, entendido: que sabe por qué es así y no asá
         - [ ] por ejemplo, moduler, compiler, devbin, van en el src y el src/www, pero no en dist
            - [ ] porque así los puedes inyectar (aunque habrá problemas con eso, seguramente)
            - [ ] pero no es necesario que contaminen el dist de serie
            - [ ] y el moduler va en el www porque es compatible con nodejs y browser