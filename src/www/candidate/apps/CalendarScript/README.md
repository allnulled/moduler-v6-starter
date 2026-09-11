# CalendarScript

Tal.

## Cómo describiría el día.


### Versión bruta

```
En @inicio [desayunar] por 30min.

Después si (@inicio es menor que 8am) y (@inicio es mayor que 4am) [porrillo] por 30min o si no [libre] por 30min.

Después [descansar] por 30min.
Después [pasear perrilla] por 20min.
Después [programar] por 2h.
Después [estirar] por 15min.
Después [almorzar] por 15min.
Después [descansar] por 15min (*uno) donde {
    "message": "Esto es un JSON, directamente",
    "message2": "Son metadatos asociados a un TO-DO",
    "message3": "Se mezclan con los de abajo"
}.
Después [programar] por 2h.
Después [reels] por 10min.
Después [tv] por 20min.
Después [diseño] por 30min.
Después [meditar] por @meditacion1.
Después [comer] por 1h.
Después [descansar] por 30min.
Después [meditar] por @meditacion2.
Después [caminar] por 1h.
Después [programar] por 2h.
Después [meditar] por @meditacion3.

A la 1am [rezos].
A las 3am [repaso mental].
A las 17pm [saltar].

El @inicio es desconocido.
El @inicio es 8am.

La duración de @meditacion1 es 20min.
La duración de @meditacion2 es 30min.
La duración de @meditacion3 es 40min.

Sobre *uno: {
    "message4": "Aquí puedes continuar extendiendo el JSON"
}.
```

### Versión mejorada

Los "Al", "A la", "A las", "En" y "Después" con "Ingreso de TO-DO".

Los "Máximo" y "Mínimo" también son "Ingreso de TO-DO" y de "Ingreso de NOT-TO-DO" a la vez.

Los "Ingreso de TO-DO" puedes wrapearse con selectores de rango y de frecuencia:

```
Cada lunes, miércoles y viernes {
    A las 8am [descansar] por 30min.
}.
De 2026/09 a 2026/10, cada lunes y jueves {

}.
En 2026/09/22 {
    Mínimo [programar] por 8h.
    Máximo [fumar] 3 veces.
}.
```

Si no especificas el día, es "cada día".

```
En 2026/09, cada día {

}.
En 2026/09 {

}.
En 2026 {

}.
```


### Sintaxis embedidas básicas

1. Duraciones
   - por 1y 1mon 1d 1h 1min 1s 1ms
1. Fechas (año, mes, día)
   - En 2026
   - En 2026/09
   - En 2026/09/21
2. Rangos continuos de fecha (años, meses, días)
   - De 2026 a 2027
   - De 2026/01 a 2026/12
   - De 2026/01/01 a 2026/12/31
3. Horas (hora, minuto)
   - 2026/09/21 a las 10am
   - 2026/09/21 a las 10pm
   - 2026/09/21 a las 10:20am
   - 2026/09/21 a las 10:20pm
4. Rangos discontinuos con días de la semana
   - 2026 cada lunes, miércoles y viernes
   - 2026/09 cada martes y domingo
   - 2026/09 cada sábado
5. Rangos discontinuos con días del mes
   - 2026/09 el día 8
   - 2026/09 los días 1, 3 y 5
6. Rangos discontinuos con días del mes con combinación con semana
   - Solo se puede este tipo de expresión:
   - 2026/09 el 1r domingo
   - 2026/09 el 2o martes
   - 2026/09 el 3r jueves
7. Máximos y mínimos
   - Según duración:
      - por 1h
   - Según veces:
      - 10 veces
8. Expresiones específicas de tiempo
   - cada día
9. Apertura de lista
   - Con los { y }
   - Dentro solo van "Ingreso de (NOT-)TO-DO"
   - En el scope global, que no hay apertura de lista, los NOT-TO-DO se pondrían en "Cada día { ... }"
10. JSON para los metadatos
11. Referencias para extender los JSON pero abajo, sin molestar en el árbol de TO-DOs
12. Ingreso de tareas por diferentes formas
   - Horas concretas:
      - A las 7am
      - A la 1pm (este es el único que acepta singular, por cierto)
   - Horas inconcretas:
      - A la hora de @algo (y algo no vuelve a aparecer en el documento, y está ok, no problema)
13. Gestión de variables
   - Poder despejar variables con:
      - "La hora de @tal es"
      - "La duración de @tal es"
   - Pero poder no despejarlas también, y que quede la ambigüedad
   - Las variables son holders de:
      - Hora
      - Duración
      - TO-DO
         - Esto ya veremos, porque aquí hay más miga, pero en principio, igual que los otros, un @tal puede usarse de holder de TO-DO también
      - Combinaciones de anteriores
         - un holder puede ser hora+TODO, TODO+duración o incluso hora+TODO+duración
         - pero eso el parser no lo sabe porque no controla en parsing-time estados, es un PEGjs sin filigranas de momento
            - así que cuando converjan, habrá una superposición, de los valores de la sintaxis inline, por sobre de, los valores de variable.
            - pero esto ya es post-parseo, ahora mismo no importa
   - Permiten sintaxis sin espacios y con espacios
      - @sinEspacios
      - @[con espacios también]
14. Condicionales
   - Pueden meterse donde metes un "Ingreso de TODO".
   - Permiten solo comprobaciones contra variables
      - Si una variable de hora es mayor, menor o igual que otra
      - Si una variable de duración es mayor, menor o igual que otra
      - Contra las variables de TO-DO no permite hacer nada
   - En el futuro?
      - Deberían poder hacerse queries más avanzadas
      - `si ¿en los últimos 10 días, he hecho [deporte]?`
      - `si ¿en los últimos 10 días, he hecho [deporte] por 3h o más?`
      - `si ¿en los últimos 10 días, he hecho [deporte] por 3h o menos?`
      - `si ¿en los últimos 10 días, he hecho [deporte] 5 veces o más?`
      - `si ¿en los últimos 10 días, he hecho [deporte] 5 veces o menos?`
      - Pero esto sería mucho más allá, queda como meta lejana futura, pero ahora no entra esto.
15. Expresiones booleanas
   - Los condicionales permiten expresiones booleanas muy simples
   - `@variable es {menor,mayor,igual,distinto} que {:hora,:veces}`
   - de momento ya está
16. Comentarios
   - Unilínea y multilínea, tipo JS normal, // y /* */
17. Continuación de tareas a ciegas
   - El "Después" sirve para referirte a que "no sé exactamente cuando acaba la anterior, pero, después".
   - Es una máscara de un dato tipo HORA
   - Y sirve para decir, "no sé a qué hora exacta cae, pero, después"
   - Tiene que ir seguida de una igual o de 

### Sintaxis avanzadas

Algunas otras sintaxis interesan también, aunque no son tan core como las anteriores.

1. Importar otros ficheros
```
Importo "otro fichero.calix" en @variable.

// Ahora en @variable puedes encontrar todo eso, hora, TODO, duración o combos.
// No hay comprobaciones más allá en el parse-time
```
2. Exportar 1 variable
   - Solo hay 1 por fichero.
```
Exporto [Nombre de TO-DO simple].
Exporto 2026/09.
Exporto nueva lista aleatoria con [
    [descansar] por 2h,
    [leer] por 1h,
    [meditar] por 20min
].
```
3. Listas de tipo
   - Hay una serie de listas prefabricadas que se pueden usar para meter en variables y tareas.
```
La @lista1 es una lista aleatoria con {}.
La @lista2 es una lista repetida con {
    [bíceps],
    [tríceps],
    [cuadríceps],
}.
La @lista3 es una lista con {
    [primero],
    [segundo],
    [tercero],
}.
La @lista4 es una lista inversa con {
    [último],
    [penúltimo],
    [antepenúltimo],
}.
La @lista5 es una lista con {
    [primer feature] que es una lista con {
        [metas] que es una lista con {
            [último obstáculo]
            [penúltimo obstáculo]
            [antepenúltimo obstáculo]
        }
        [obstáculos] que es una lista inversa con {
            [último obstáculo]
            [penúltimo obstáculo]
            [antepenúltimo obstáculo]
        }
    },
    [segundo],
    [tercero],
}.
```
4. Metadatos asociados a la tarea
   - Hay dos formas, que pueden convivir entre sí, la inmediata y la referida
   - La referida existe para que no contamine visualmente el script los metadatos asociados, pero se puedan persistir igualmente.
```
[echarse la siesta] (*siesta 1) donde {
    // Por ejemplo, en el inmediato:
    "tiempo máximo": "40min",
    "estado": "completado",
    "comentarios de después": "Ha sido fácil.",
    "comentarios de antes": "Parece fácil.",
}.

// Por ejemplo, en el referido:
Sobre (*siesta 1): {
    "otros datos": "ok",
}.
```