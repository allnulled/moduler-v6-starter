¡Buah! Esta sí que es una pregunta troncal. Y además has identificado algo que me parece fundamental: **CSS Grid no es simplemente un sistema para colocar elementos en filas y columnas. Es un pequeño lenguaje declarativo para construir estructuras bidimensionales.**

Y creo que la mejor manera de estudiarlo no es empezar por las clases CSS ni por ejemplos de tablas. Es exactamente lo que propones: estudiar su gramática, sus tipos, sus combinaciones y sus reglas de composición.

Voy a organizarlo como una referencia técnica, pensando en que después puedas utilizarla para construir tu propia API de tablas, paneles, formularios, interfaces y estructuras dinámicas.

Una advertencia conceptual antes de empezar:

- `display: grid` activa el modelo de disposición.
- Las propiedades `grid-*` definen la estructura y la colocación.
- Las funciones `repeat()`, `minmax()`, `fit-content()` y otras construyen expresiones dentro de esa estructura.
- Las propiedades generales de CSS (`gap`, `padding`, `margin`, `background`, etc.) complementan el modelo.
- HTML proporciona los elementos y CSS Grid determina cómo se distribuyen.

Y una distinción muy importante: Grid tiene dos sistemas de posicionamiento diferentes:
1. **Grid explícito:** defines las filas y columnas que forman la cuadrícula.
2. **Grid implícito:** permites que el navegador genere filas y columnas adicionales cuando aparecen elementos que no caben en la estructura explícita.

Esto último es especialmente interesante para tu idea de generar tablas mediante bucles.

# CSS Grid Layout — Referencia gramatical completa

# 1. El modelo mental: cómo funciona una cuadrícula

Antes de estudiar las propiedades, tenemos que conocer las cinco piezas fundamentales de Grid.

```text
GRID CONTAINER
│
├── GRID LINES       Líneas que delimitan las divisiones.
│
├── GRID TRACKS      Filas y columnas.
│   │
│   ├── Column tracks
│   └── Row tracks
│
├── GRID CELLS       Intersecciones entre una fila y una columna.
│
├── GRID AREAS       Una o varias celdas contiguas.
│
└── GRID ITEMS       Elementos hijos que ocupan las áreas.
```

Imagina esta cuadrícula:

```text
       COLUMNA 1    COLUMNA 2    COLUMNA 3

          │            │            │
     ─────┼────────────┼────────────┼─────
          │            │            │
 FILA 1   │   CELL     │   CELL     │
          │            │            │
     ─────┼────────────┼────────────┼─────
          │            │            │
 FILA 2   │   CELL     │   CELL     │
          │            │            │
     ─────┼────────────┼────────────┼─────
          │            │            │
 FILA 3   │   CELL     │   CELL     │
          │            │            │
     ─────┴────────────┴────────────┴─────
```

Hay tres columnas y tres filas.

Pero fíjate en algo: **las líneas son las que realmente gobiernan el posicionamiento**.

Con tres columnas tienes cuatro líneas verticales:

```text
│ 1 │ 2 │ 3 │ 4 │
```

Con tres filas tienes cuatro líneas horizontales:

```text
── 1 ──
── 2 ──
── 3 ──
── 4 ──
```

Esto explica por qué Grid utiliza índices de líneas para colocar elementos y no índices de celdas.

Por ejemplo:

```css
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}
```

Significa:

- Empieza en la línea vertical 1.
- Termina en la línea vertical 3.
- Empieza en la línea horizontal 1.
- Termina en la línea horizontal 3.

Resultado: ocupa cuatro celdas.

```text
       1       2       3

   1   ┌───────────────┐
       │               │
       │     ITEM      │
   2   │               │
       │               │
   3   └───────────────┘
```

Aquí ya tienes el equivalente conceptual de `colspan="2"` y `rowspan="2"`.

---

# 2. Activación del modelo Grid

Existen dos valores principales:

```css
display: grid;
display: inline-grid;
```

| Valor | Comportamiento |
|---|---|
| `grid` | El contenedor se comporta como un bloque. |
| `inline-grid` | El contenedor se comporta como un elemento inline-level. |

Los hijos directos del contenedor pasan a ser Grid Items.

Esto es importante: no necesitas declarar nada especial en los hijos para que participen.

```html
<div class="grid">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>
```

```css
.grid {
  display: grid;
}
```

Los cuatro elementos ya participan en el algoritmo de colocación de Grid.

Hay una excepción interesante: los nodos de texto directos también pueden convertirse en elementos anónimos de Grid, aunque no podrás asignarles propiedades individuales mediante selectores.

---

# 3. La gramática fundamental: grid-template

Esta es probablemente la parte más importante de toda la API.

Las propiedades fundamentales para construir una cuadrícula explícita son:

```css
grid-template-columns
grid-template-rows
grid-template-areas
```

Y existe un shorthand que las agrupa:

```css
grid-template
```

Vamos por partes.

## 3.1. grid-template-columns y grid-template-rows

Estas propiedades definen las dimensiones de las pistas (tracks).

Ejemplo:

```css
.container {
  display: grid;

  grid-template-columns: 100px 200px 1fr;
  grid-template-rows: 50px 100px 1fr;
}
```

La cuadrícula tendrá:

```text
COLUMNAS:
100px | 200px | 1fr

FILAS:
50px
100px
1fr
```

Pero aquí aparece una cuestión fundamental: ¿qué tipos de valores acepta cada pista?

## 3.2. Gramática de los tamaños de pista

El árbol simplificado de la gramática es:

```text
<TRACK-SIZING>
│
├── <LENGTH>
│   ├── px
│   ├── em
│   ├── rem
│   ├── vw
│   ├── vh
│   ├── etc.
│
├── <PERCENTAGE>
│   └── %
│
├── <FLEX>
│   └── fr
│
├── <INTRINSIC-KEYWORDS>
│   ├── auto
│   ├── min-content
│   └── max-content
│
├── minmax()
│
├── fit-content()
│
├── repeat()
│
└── subgrid
```

Vamos a estudiar cada uno.

### A. Longitudes

```css
grid-template-columns: 100px 200px 300px;
```

También:

```css
grid-template-columns: 10rem 20vw 30%;
```

Son tamaños convencionales.

### B. Porcentajes

```css
grid-template-columns: 25% 50% 25%;
```

Los porcentajes se calculan respecto al tamaño correspondiente del contenedor Grid.

Ojo: cuando el tamaño del contenedor es indefinido, los porcentajes tienen particularidades durante el cálculo de dimensiones intrínsecas.

### C. fr (fractional unit)

Esta es una de las características más interesantes de Grid.

```css
grid-template-columns: 1fr 1fr 1fr;
```

Divide el espacio disponible en tres partes iguales.

Pero también:

```css
grid-template-columns: 1fr 2fr 1fr;
```

Representa cuatro fracciones:

```text
┌─────┬──────────┬─────┐
│ 1fr │   2fr    │ 1fr │
└─────┴──────────┴─────┘
```

Y puedes combinarlo con tamaños fijos:

```css
grid-template-columns: 200px 1fr 100px;
```

La primera columna ocupa 200px, la última 100px y la central recibe el espacio restante.

**Importante:** `1fr` no equivale necesariamente a `minmax(0, 1fr)`. Fuera de `minmax()`, un tamaño flexible implica un mínimo automático, que puede verse condicionado por el contenido. Para evitar desbordamientos es muy habitual utilizar:

```css
grid-template-columns: repeat(3, minmax(0, 1fr));
```

### D. auto

```css
grid-template-columns: auto 1fr auto;
```

`auto` permite que el contenido influya en el tamaño de la pista.

Puede comportarse como un tamaño intrínseco, teniendo en cuenta los mínimos y máximos de sus elementos.

Además, las pistas `auto` pueden recibir espacio adicional mediante `justify-content` o `align-content`.

### E. min-content

```css
grid-template-columns: min-content 1fr;
```

Busca el tamaño mínimo intrínseco del contenido.

Por ejemplo, en un texto, intenta ajustarse a su anchura mínima posible sin desbordar palabras indivisibles.

### F. max-content

```css
grid-template-columns: max-content 1fr;
```

Busca el tamaño máximo intrínseco del contenido sin introducir saltos de línea adicionales.

### G. minmax()

Aquí empieza la verdadera potencia.

Su gramática:

```text
minmax(
  <MINIMUM>,
  <MAXIMUM>
)
```

Ejemplos:

```css
minmax(100px, 300px)
minmax(100px, 1fr)
minmax(min-content, 300px)
minmax(min-content, max-content)
minmax(auto, 1fr)
minmax(0, 1fr)
```

El primer argumento define el mínimo y el segundo el máximo.

Hay una restricción: `fr` no puede utilizarse como mínimo.

Ejemplo práctico:

```css
grid-template-columns: 200px minmax(300px, 1fr);
```

La segunda columna nunca debería bajar de 300px por esta definición y podrá crecer hasta ocupar el espacio disponible.

### H. fit-content()

Su gramática:

```text
fit-content(
  <LENGTH | PERCENTAGE>
)
```

Ejemplos:

```css
fit-content(200px)
fit-content(30%)
fit-content(20rem)
```

Es una forma de permitir que una pista crezca según su contenido, pero limitando su crecimiento.

Conceptualmente:

```text
min(max-content, max(auto, límite))
```

Es especialmente útil para columnas cuyo contenido debe determinar el tamaño, pero no quieres que se extiendan indefinidamente. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows?utm_source=chatgpt.com)


---

# 4. repeat(): la gramática recursiva

Esta función merece un capítulo propio.

Su estructura básica:

```text
repeat(
  <COUNT>,
  <TRACK-LIST>
)
```

Ejemplos:

```css
repeat(3, 100px)
repeat(4, 1fr)
repeat(3, minmax(100px, 1fr))
repeat(2, 100px 200px)
```

Observa el último caso:

```css
grid-template-columns: repeat(2, 100px 200px);
```

Produce:

```text
100px | 200px | 100px | 200px
```

Es decir, puedes repetir fragmentos completos de pistas.

## 4.1. auto-fill

Aquí empieza la magia.

```css
grid-template-columns: repeat(auto-fill, 150px);
```

El navegador calcula cuántas columnas de 150px caben en el contenedor.

## 4.2. auto-fit

```css
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
```

Es similar a `auto-fill`, pero las pistas repetidas que quedan vacías se colapsan.

La diferencia:

```text
auto-fill:
┌─────┬─────┬─────┬─────┐
│  A  │  B  │     │     │
└─────┴─────┴─────┴─────┘

auto-fit:
┌──────────┬──────────┐
│    A     │    B     │
└──────────┴──────────┘
```

Este ejemplo es especialmente útil para galerías, catálogos y tarjetas.

## 4.3. Gramática completa de repeat

Simplificando las variantes de la especificación:

```text
repeat()
│
├── repeat(<INTEGER>, <TRACK-LIST>)
│
├── repeat(auto-fill, <FIXED-SIZE-LIST>)
│
└── repeat(auto-fit, <FIXED-SIZE-LIST>)
```

Hay restricciones importantes:

- El número entero debe ser positivo.
- Solo puedes utilizar una repetición automática (`auto-fill` o `auto-fit`) por lista.
- Las repeticiones automáticas necesitan tamaños fijos para poder calcular cuántas pistas caben.
- No puedes anidar una función `repeat()` dentro de otra `repeat()`.

En cambio, puedes combinar varias repeticiones enteras:

```css
grid-template-columns:
  repeat(2, 100px)
  repeat(3, 1fr);
```

Y puedes combinar `repeat()` con `minmax()`:

```css
grid-template-columns:
  repeat(4, minmax(100px, 1fr));
``` :chatgpt-content-reference{index="1"}


---

# 5. Nombres de líneas: line names

Esta funcionalidad es bastante desconocida y muy potente.

Puedes asignar nombres a las líneas de tu cuadrícula utilizando corchetes:

```css
.container {
  display: grid;

  grid-template-columns:
    [start] 100px
    [middle] 1fr
    [end] 200px
    [finish];
}
```

Visualmente:

```text
[start]     [middle]          [end]       [finish]
   │           │                │             │
   ├──100px────┼──────1fr───────┼───200px─────┤
```

Después puedes utilizar esos nombres para posicionar elementos:

```css
.item {
  grid-column: start / end;
}
```

Y también puedes repetir nombres de línea:

```css
grid-template-columns:
  [column] 100px
  [column] 100px
  [column] 100px;
```

En ese caso puedes utilizar índices para seleccionar una aparición concreta:

```css
.item {
  grid-column: column 1 / column 3;
}
```

Esto permite construir estructuras bastante descriptivas sin depender exclusivamente de números.

---

# 6. grid-template-areas: construir la cuadrícula mediante ASCII

Esta propiedad es probablemente la más visual de toda la API.

Su gramática es muy sencilla:

```text
grid-template-areas:
  <STRING>
  <STRING>
  <STRING>
  ...
```

Cada string representa una fila.

Cada identificador separado por espacios representa una celda.

Ejemplo:

```css
.container {
  display: grid;

  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer footer footer";
}
```

La estructura es:

```text
┌────────┬────────┬────────┐
│        HEADER           │
├────────┼────────┴────────┤
│        │                 │
│SIDEBAR │      MAIN       │
│        │                 │
├────────┴─────────────────┤
│          FOOTER          │
└──────────────────────────┘
```

Y después asignas las áreas a los elementos:

```css
.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
```

¡Sin índices, sin cálculos y sin tener que definir manualmente los spans!

## 6.1. Celdas vacías

Puedes utilizar puntos:

```css
grid-template-areas:
  "header header header"
  "sidebar main   ."
  "footer footer footer";
```

El punto representa una celda sin área nombrada.

Puedes escribir varios puntos:

```css
". . ."
```

Pero todos equivalen a una celda vacía por posición.

## 6.2. Restricciones gramaticales

Hay reglas importantes:

1. Todas las filas deben tener el mismo número de celdas.
2. Los nombres de las áreas deben formar rectángulos.
3. Un mismo nombre no puede aparecer en dos regiones independientes.
4. Los puntos representan posiciones vacías.

Por ejemplo, esto es válido:

```css
grid-template-areas:
  "a a b"
  "a a b";
```

Pero esto no:

```css
grid-template-areas:
  "a b"
  "b a";
```

Porque las celdas de `a` y `b` no forman áreas rectangulares.

## 6.3. Nombres de líneas automáticos

Aquí hay algo especialmente interesante.

Cuando declaras un área llamada `header`, CSS Grid crea automáticamente cuatro nombres de línea:

```text
header-start
header-end
```

En realidad, hay dos líneas de inicio y dos de final: una pareja para cada eje.

Por tanto, puedes hacer:

```css
.item {
  grid-column: header-start / header-end;
}
```

Y también:

```css
.item {
  grid-row: header-start / header-end;
}
```

Esto es posible porque los nombres de áreas generan nombres implícitos de líneas. [W3C](https://www.w3.org/TR/css-grid/?utm_source=chatgpt.com)


---

# 7. grid-template: el primer gran shorthand

Ya conocemos:

```css
grid-template-columns
grid-template-rows
grid-template-areas
```

Podemos agruparlas con:

```css
grid-template
```

Tiene tres formas principales.

### Forma A: filas / columnas

```css
grid-template: 100px 1fr / 200px 1fr;
```

La barra `/` separa los dos ejes.

```text
grid-template:
  ROWS
  /
  COLUMNS
```

Por tanto:

```css
grid-template:
  50px 100px 1fr
  /
  200px 1fr;
```

Equivale a:

```css
grid-template-rows: 50px 100px 1fr;
grid-template-columns: 200px 1fr;
grid-template-areas: none;
```

### Forma B: áreas y tamaños de fila

```css
grid-template:
  "header header" 50px
  "menu   main"   1fr
  "footer footer" 40px
  / 200px 1fr;
```

Esta es una sintaxis fantástica porque puedes definir la geometría y los nombres en un único bloque.

Visualmente:

```text
┌──────────────────────────┐
│          HEADER          │ 50px
├──────────┬───────────────┤
│          │               │
│   MENU   │     MAIN      │ 1fr
│          │               │
├──────────┴───────────────┤
│          FOOTER          │ 40px
└──────────────────────────┘

    200px        1fr
```

### Forma C: nombres de líneas y áreas

También puedes introducir nombres de líneas:

```css
grid-template:
  [top] "header header" 50px [header-end]
  [main] "menu main" 1fr [main-end]
  [bottom] "footer footer" 40px [bottom-end]
  / 200px 1fr;
```

Esto permite definir simultáneamente:

- Áreas.
- Líneas.
- Dimensiones de las filas.
- Dimensiones de las columnas.

Una observación: la sintaxis con áreas no admite `repeat()` en la lista de tamaños de filas que acompaña a los strings. Es una restricción de esa forma particular de `grid-template`. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template?utm_source=chatgpt.com)


---

# 8. El grid implícito: filas y columnas automáticas

Hasta ahora hemos definido cuadrículas explícitas.

Pero imagina esto:

```html
<div class="grid">
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
  <div>E</div>
  <div>F</div>
  <div>G</div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

Solo has definido tres columnas.

¿Dónde se coloca G?

CSS Grid genera filas adicionales automáticamente.

```text
┌──────┬──────┬──────┐
│  A   │  B   │  C   │
├──────┼──────┼──────┤
│  D   │  E   │  F   │
├──────┼──────┼──────┤
│  G   │      │      │
└──────┴──────┴──────┘
```

Estas filas adicionales pertenecen al **implicit grid**.

Y tenemos tres propiedades para controlar su comportamiento:

```css
grid-auto-rows
grid-auto-columns
grid-auto-flow
```

## 8.1. grid-auto-rows

Controla el tamaño de las filas implícitas.

```css
grid-auto-rows: 100px;
```

También admite:

```css
grid-auto-rows: 1fr;
grid-auto-rows: auto;
grid-auto-rows: min-content;
grid-auto-rows: max-content;
grid-auto-rows: minmax(100px, auto);
grid-auto-rows: minmax(100px, 1fr);
grid-auto-rows: fit-content(200px);
```

Incluso puedes definir un patrón que se repita:

```css
grid-auto-rows: 100px 200px 300px;
```

Las filas implícitas irán alternando esos tamaños.

## 8.2. grid-auto-columns

Exactamente lo mismo, pero para columnas implícitas.

```css
grid-auto-columns: 150px;
```

O:

```css
grid-auto-columns: minmax(100px, 1fr);
```

## 8.3. grid-auto-flow

Esta propiedad controla cómo se colocan automáticamente los elementos.

Su gramática:

```text
grid-auto-flow
│
├── row
├── column
├── dense
│
├── row dense
└── column dense
```

Ejemplos:

```css
grid-auto-flow: row;
```

Rellena filas antes de pasar a la siguiente.

```css
grid-auto-flow: column;
```

Rellena columnas antes de pasar a la siguiente.

```css
grid-auto-flow: row dense;
```

Intenta rellenar huecos anteriores cuando encuentra elementos que caben en ellos.

La diferencia entre `row` y `column`:

```text
row:

A B C
D E F
G H I


column:

A D G
B E H
C F I
```

Y `dense` tiene una consecuencia importante: puede alterar el orden visual respecto al orden del DOM.

Esto es algo que debes tener presente si estás generando interfaces mediante bucles y el orden de lectura importa. [GitHub](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/properties/grid-auto-flow/index.md?utm_source=chatgpt.com)


---

# 9. grid: el shorthand general

Ahora que conocemos el grid explícito y el implícito, aparece:

```css
grid
```

Este es el shorthand más amplio.

Puede definir:

- `grid-template-rows`
- `grid-template-columns`
- `grid-template-areas`
- `grid-auto-rows`
- `grid-auto-columns`
- `grid-auto-flow`

Tiene tres grandes familias de sintaxis.

### A. Definición explícita

```css
grid: 100px 1fr / 200px 1fr;
```

O:

```css
grid:
  "header header" 50px
  "main   main"   1fr
  /
  1fr 1fr;
```

### B. Flujo automático por columnas

```css
grid: 200px / auto-flow;
```

También:

```css
grid: 200px / auto-flow 100px;
```

Esto define las filas explícitamente y deja que se generen columnas automáticamente.

### C. Flujo automático por filas

```css
grid: auto-flow / 200px;
```

O:

```css
grid: auto-flow 100px / 200px;
```

Esto define las columnas explícitamente y genera filas automáticamente.

También puedes añadir `dense`:

```css
grid: auto-flow dense 100px / 200px;
```

**¡Mucho cuidado con este shorthand!**

`grid` reinicia las propiedades de la cuadrícula que no hayas especificado, incluidas las propiedades del grid implícito.

No es equivalente a escribir únicamente `grid-template`.

Yo utilizaría las propiedades individuales mientras estés diseñando una estructura compleja. Reservaría `grid` para declaraciones compactas y controladas. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid?utm_source=chatgpt.com)


---

# 10. Posicionamiento de los elementos: grid-column, grid-row y grid-area

Esta es la segunda gran familia de la API.

Hasta ahora hemos definido la cuadrícula. Ahora toca decidir dónde vive cada elemento.

Tenemos seis propiedades fundamentales:

```text
GRID ITEM
│
├── grid-column-start
├── grid-column-end
├── grid-row-start
├── grid-row-end
│
├── grid-column
├── grid-row
│
└── grid-area
```

## 10.1. grid-column-start / grid-column-end

Permiten especificar las líneas verticales de inicio y final.

```css
.item {
  grid-column-start: 1;
  grid-column-end: 3;
}
```

## 10.2. grid-column

Agrupa las dos anteriores:

```css
grid-column: 1 / 3;
```

También:

```css
grid-column: 2 / 4;
grid-column: 1 / -1;
grid-column: 2 / span 3;
grid-column: span 2;
grid-column: auto / span 2;
```

Fíjate en `-1`.

Los índices negativos permiten contar desde el final de la cuadrícula explícita.

Por ejemplo:

```css
grid-column: 1 / -1;
```

Significa ocupar todas las columnas explícitas.

## 10.3. grid-row

Exactamente lo mismo para las filas:

```css
grid-row: 1 / 3;
grid-row: 2 / 5;
grid-row: 1 / -1;
grid-row: span 3;
```

## 10.4. span

Esta palabra es fundamental.

```css
grid-column: span 2;
```

Significa que el elemento debe ocupar dos columnas.

```css
grid-row: span 3;
```

Significa que debe ocupar tres filas.

Es el equivalente directo a:

```html
<td colspan="2" rowspan="3">
```

En Grid:

```css
.item {
  grid-column: span 2;
  grid-row: span 3;
}
```

## 10.5. grid-area

Aquí tenemos un shorthand de cuatro posiciones:

```css
grid-area:
  <ROW-START>
  /
  <COLUMN-START>
  /
  <ROW-END>
  /
  <COLUMN-END>;
```

Ejemplo:

```css
.item {
  grid-area: 1 / 2 / 4 / 5;
}
```

Equivale a:

```css
.item {
  grid-row: 1 / 4;
  grid-column: 2 / 5;
}
```

También puedes utilizar nombres de áreas:

```css
.item {
  grid-area: main;
}
```

O nombres de líneas:

```css
.item {
  grid-area:
    header-start /
    sidebar-start /
    footer-end /
    main-end;
}
```

La gramática de posicionamiento acepta:

```text
<GRID-LINE>
│
├── auto
│
├── <INTEGER>
│
├── <CUSTOM-IDENT>
│
├── <CUSTOM-IDENT> <INTEGER>
│
├── span <INTEGER>
│
├── span <CUSTOM-IDENT>
│
└── span <INTEGER> <CUSTOM-IDENT>
```

No todas las combinaciones tienen sentido en cualquier posición, pero estas son las familias que debes conocer.

Por ejemplo:

```css
grid-column: 2 / span 3;
grid-column: sidebar-start / sidebar-end;
grid-column: span 2;
```

Y puedes combinar un nombre con un número para referenciar una aparición determinada de una línea con nombre repetido. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-column?utm_source=chatgpt.com)


---

# 11. subgrid: compartir la cuadrícula del padre

Esta funcionalidad merece especial atención.

Imagina que tienes un Grid principal:

```css
.parent {
  display: grid;
  grid-template-columns: 100px 200px 1fr;
  grid-template-rows: 50px 100px 200px;
}
```

Y uno de sus hijos también necesita distribuir elementos siguiendo exactamente esas mismas líneas.

Tradicionalmente, tendrías que volver a declarar la estructura.

Con `subgrid` puedes hacer:

```css
.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```

Esto permite que el Grid hijo adopte las pistas del padre en los ejes correspondientes.

Visualmente:

```text
PARENT GRID
│
├── Column 1
├── Column 2
└── Column 3
    │
    └── CHILD GRID
        ├── Hereda las columnas del padre
        └── Puede distribuir sus propios elementos
```

Puedes utilizarlo solamente en uno de los ejes:

```css
.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: 100px 1fr;
}
```

También puedes utilizar nombres de líneas con `subgrid`:

```css
.child {
  grid-template-columns: subgrid [inner-start] [inner-end];
}
```

Y controlar los espacios entre pistas mediante `gap`.

Esto resulta especialmente útil para formularios complejos, tarjetas con estructuras compartidas y tablas compuestas por componentes independientes. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid?utm_source=chatgpt.com)


---

# 12. Alineación: las propiedades place-, align- y justify-

Aquí aparece otra familia muy interesante.

Grid permite alinear dos cosas diferentes:

1. Los elementos dentro de sus celdas o áreas.
2. La cuadrícula completa dentro del contenedor.

Son dos operaciones distintas.

## 12.1. Alinear los elementos dentro de sus áreas

Tenemos:

```css
align-items
justify-items
place-items
```

Y sus equivalentes individuales:

```css
align-self
justify-self
place-self
```

### align-items

Controla la alineación de los elementos en el eje de bloque (normalmente vertical).

```css
align-items: start;
align-items: center;
align-items: end;
align-items: stretch;
align-items: baseline;
```

### justify-items

Controla la alineación en el eje inline (normalmente horizontal).

```css
justify-items: start;
justify-items: center;
justify-items: end;
justify-items: stretch;
```

### place-items

Agrupa ambas:

```css
place-items: center;
```

Equivale a:

```css
align-items: center;
justify-items: center;
```

También puedes especificar dos valores:

```css
place-items: start center;
```

El primero corresponde a `align-items` y el segundo a `justify-items`.

### Propiedades individuales

Si quieres modificar solamente un elemento:

```css
.item {
  align-self: center;
  justify-self: end;
}
```

O utilizar:

```css
.item {
  place-self: center end;
}
```

## 12.2. Alinear la cuadrícula completa

Aquí tenemos:

```css
align-content
justify-content
place-content
```

Estas propiedades no alinean los elementos dentro de sus celdas. Alinean los tracks de la cuadrícula dentro del espacio disponible del contenedor.

Por ejemplo:

```css
.container {
  display: grid;
  width: 800px;
  height: 600px;

  grid-template-columns: 100px 100px;
  grid-template-rows: 100px 100px;

  justify-content: center;
  align-content: center;
}
```

La cuadrícula completa queda centrada dentro de los 800 × 600 píxeles.

Entre sus valores encontramos:

```text
<CONTENT-ALIGNMENT>
│
├── start
├── end
├── center
├── stretch
│
├── space-between
├── space-around
├── space-evenly
│
└── baseline
```

Puedes utilizar:

```css
place-content: center;
```

Para centrar la cuadrícula en ambos ejes.

También:

```css
place-content: space-between center;
```

El primer valor controla el eje de bloque y el segundo el eje inline.

### Una distinción fundamental

Mira estos dos ejemplos:

```css
/* Centra los elementos dentro de sus celdas */
place-items: center;
```

```css
/* Centra la cuadrícula dentro del contenedor */
place-content: center;
```

No hacen lo mismo.

Y esta distinción te ahorrará bastantes quebraderos de cabeza. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Box_alignment?utm_source=chatgpt.com)


---

# 13. Los espacios: gap, row-gap y column-gap

Grid tiene un sistema propio de separación entre pistas.

```css
gap
row-gap
column-gap
```

Su gramática:

```text
gap:
  <ROW-GAP>
  <COLUMN-GAP>?
```

Ejemplos:

```css
gap: 10px;
```

Diez píxeles en ambos ejes.

```css
gap: 10px 20px;
```

Diez píxeles entre filas y veinte entre columnas.

```css
row-gap: 10px;
column-gap: 20px;
```

Equivalente al ejemplo anterior.

También acepta porcentajes y `calc()`:

```css
gap: 2%;
gap: calc(1rem + 4px);
gap: 10px 2vw;
```

Y puedes utilizar:

```css
gap: 0;
gap: normal;
```

Una característica importante: `gap` no crea márgenes exteriores. Solamente introduce separación entre pistas.

Por tanto:

```css
.container {
  display: grid;
  gap: 10px;
}
```

No añade diez píxeles alrededor de toda la cuadrícula.

---

# 14. El resto de CSS que puedes combinar con Grid

Aquí quiero separar dos cosas.

Las propiedades que hemos estudiado hasta ahora pertenecen al modelo Grid.

Pero un Grid Container sigue siendo un elemento CSS normal. Por tanto, puedes utilizar prácticamente todo el sistema de estilos convencional.

Te preparo una pequeña taxonomía de las familias que considero más interesantes para construir tu API.

## 14.1. Dimensiones

```text
DIMENSIONS
│
├── width
├── height
│
├── min-width
├── max-width
│
├── min-height
└── max-height
```

Ejemplos:

```css
width: 100%;
height: 100%;

min-width: 200px;
max-width: 800px;

min-height: 100px;
max-height: 600px;
```

También puedes utilizar `min()`, `max()` y `clamp()`:

```css
width: min(100%, 1200px);
height: max(300px, 50vh);
width: clamp(300px, 50vw, 800px);
```

Son especialmente útiles para construir cuadrículas adaptables.

## 14.2. Padding y margin

Aquí tenemos los shorthands clásicos.

```text
PADDING
│
├── padding
├── padding-top
├── padding-right
├── padding-bottom
└── padding-left

MARGIN
│
├── margin
├── margin-top
├── margin-right
├── margin-bottom
└── margin-left
```

La gramática de ambos shorthands admite entre uno y cuatro valores:

```css
padding: 10px;
padding: 10px 20px;
padding: 10px 20px 30px;
padding: 10px 20px 30px 40px;
```

Su interpretación:

```text
padding: A;
  A A A A

padding: A B;
  A B A B

padding: A B C;
  A B C B

padding: A B C D;
  A B C D
```

También puedes utilizar:

```css
padding-inline: 10px;
padding-block: 20px;
```

Y sus variantes:

```css
padding-inline-start: 10px;
padding-inline-end: 10px;

padding-block-start: 20px;
padding-block-end: 20px;
```

Estas últimas utilizan los ejes lógicos de CSS, por lo que se adaptan a la dirección de escritura.

## 14.3. Border

Otra familia:

```text
BORDER
│
├── border
│
├── border-top
├── border-right
├── border-bottom
├── border-left
│
├── border-width
├── border-style
├── border-color
│
├── border-radius
│
└── border-*-radius
```

Ejemplo:

```css
border: 1px solid black;
border-radius: 8px;
```

También:

```css
border: none;
border-top: 1px solid #ccc;
```

## 14.4. Background

Esta familia es bastante más compleja.

```text
BACKGROUND
│
├── background
│
├── background-color
├── background-image
├── background-position
├── background-size
├── background-repeat
├── background-origin
├── background-clip
├── background-attachment
└── background-blend-mode
```

Ejemplo:

```css
background:
  #222
  url("/image.png")
  center / cover
  no-repeat;
```

El shorthand permite combinar varias propiedades en una declaración.

También puedes definir varias capas:

```css
background:
  url("foreground.png") center / contain no-repeat,
  url("background.png") center / cover no-repeat,
  #222;
```

Cada capa se separa mediante comas.

## 14.5. Overflow

Muy importante en interfaces con Grid:

```text
OVERFLOW
│
├── overflow
├── overflow-x
└── overflow-y
```

Ejemplos:

```css
overflow: hidden;
overflow: auto;
overflow: scroll;
overflow-x: auto;
overflow-y: hidden;
```

## 14.6. Posicionamiento

```text
POSITION
│
├── position
│
├── top
├── right
├── bottom
├── left
│
├── inset
├── inset-block
├── inset-inline
│
└── z-index
```

Puedes combinar Grid con posicionamiento absoluto:

```css
.container {
  display: grid;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
}
```

Un elemento con `position: absolute` no participa en el flujo normal de colocación de Grid.

## 14.7. Otras propiedades interesantes

```text
VISUAL
│
├── opacity
├── visibility
├── filter
├── backdrop-filter
├── box-shadow
├── transform
└── cursor

TYPOGRAPHY
│
├── font
├── font-size
├── font-family
├── font-weight
├── line-height
├── text-align
├── text-overflow
└── white-space
```

Y una propiedad especialmente importante:

```css
box-sizing: border-box;
```

Te recomiendo utilizarla de manera general en tus interfaces.

---

# 15. Tabla comparativa: todas las propiedades propias de Grid

Vamos a reunir la API en un árbol único.

Este es el mapa que yo guardaría como referencia.

```text
CSS GRID LAYOUT
│
├── 1. CONTAINER
│   │
│   ├── display
│   │   ├── grid
│   │   └── inline-grid
│   │
│   ├── GRID EXPLÍCITO
│   │   ├── grid-template
│   │   ├── grid-template-columns
│   │   ├── grid-template-rows
│   │   └── grid-template-areas
│   │
│   ├── GRID IMPLÍCITO
│   │   ├── grid-auto-columns
│   │   ├── grid-auto-rows
│   │   └── grid-auto-flow
│   │
│   ├── SHORTHAND GENERAL
│   │   └── grid
│   │
│   ├── SEPARACIÓN
│   │   ├── gap
│   │   ├── row-gap
│   │   └── column-gap
│   │
│   └── ALINEACIÓN DEL GRID
│       ├── justify-content
│       ├── align-content
│       └── place-content
│
└── 2. GRID ITEM
    │
    ├── POSICIONAMIENTO
    │   ├── grid-column
    │   ├── grid-column-start
    │   ├── grid-column-end
    │   ├── grid-row
    │   ├── grid-row-start
    │   ├── grid-row-end
    │   └── grid-area
    │
    ├── ALINEACIÓN
    │   ├── justify-items       [Container]
    │   ├── align-items         [Container]
    │   ├── place-items         [Container]
    │   │
    │   ├── justify-self        [Item]
    │   ├── align-self          [Item]
    │   └── place-self          [Item]
    │
    └── ORDEN
        └── order
```

Una precisión: `justify-items`, `align-items` y `place-items` pertenecen al contenedor, aunque afectan a cómo se alinean sus hijos.

Y lo mismo sucede con `justify-content`, `align-content` y `place-content`: se aplican al contenedor y distribuyen sus pistas.

---

# 16. Cómo sustituir table, colspan y rowspan

Vamos a lo que probablemente más te interesa.

Imagina una tabla convencional:

```html
<table>
  <tr>
    <td colspan="2">A</td>
    <td>B</td>
  </tr>
  <tr>
    <td rowspan="2">C</td>
    <td>D</td>
    <td>E</td>
  </tr>
  <tr>
    <td>F</td>
    <td>G</td>
  </tr>
</table>
```

Con Grid puedes construir exactamente esa geometría:

```html
<div class="table">
  <div class="cell a">A</div>
  <div class="cell b">B</div>
  <div class="cell c">C</div>
  <div class="cell d">D</div>
  <div class="cell e">E</div>
  <div class="cell f">F</div>
  <div class="cell g">G</div>
</div>
```

```css
.table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 50px;
}

.cell {
  border: 1px solid black;
}

.a {
  grid-column: span 2;
}

.c {
  grid-row: span 2;
}
```

¡Y ya está!

El navegador coloca automáticamente los elementos restantes en las posiciones disponibles.

La equivalencia fundamental es:

| HTML Table | CSS Grid |
|---|---|
| `<table>` | `display: grid` |
| `<tr>` | `grid-auto-flow: row` (conceptualmente) |
| `<td>` | Grid Item |
| `colspan="2"` | `grid-column: span 2` |
| `rowspan="2"` | `grid-row: span 2` |
| Columnas | `grid-template-columns` |
| Altura de filas | `grid-auto-rows` |
| Espacio entre celdas | `gap` |
| Celdas combinadas | `grid-area` / `grid-column` / `grid-row` |

Una diferencia importante: Grid no necesita que declares elementos `<tr>` para generar filas. Las filas son pistas de distribución, no elementos HTML.

**Advertencia:** si estás representando datos tabulares reales, con encabezados, relaciones entre filas y columnas, accesibilidad y navegación mediante tecnologías asistivas, sigue siendo preferible utilizar `<table>`. Grid reproduce la geometría visual, pero no proporciona automáticamente la semántica de una tabla.

---

# 17. Tres patrones que considero especialmente importantes

Te dejo tres configuraciones que probablemente utilizarás muchísimo.

## A. Tabla dinámica convencional

Número de columnas fijo, filas automáticas:

```css
.table {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: minmax(40px, auto);
  gap: 1px;
}
```

Puedes generar 100 elementos desde JavaScript y Grid irá distribuyéndolos.

## B. Tabla con columnas de anchura variable

```css
.table {
  display: grid;

  grid-template-columns:
    60px
    200px
    minmax(100px, 1fr)
    auto;
}
```

Obtienes cuatro columnas:

- Primera: 60px.
- Segunda: 200px.
- Tercera: mínimo 100px, ampliable.
- Cuarta: determinada por su contenido.

## C. Tabla completamente adaptable

```css
.table {
  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(180px, 1fr));

  grid-auto-rows: minmax(100px, auto);

  gap: 12px;
}
```

Aquí el navegador decide cuántas columnas caben.

No necesitas JavaScript para calcularlas.

---

# 18. Una característica que te interesa especialmente: CSS Variables

Aquí es donde empezamos a acercarnos a tu idea de API configurable.

Puedes combinar Grid con propiedades personalizadas:

```css
.DynamicGrid {
  --columns: 3;
  --cell-size: 50px;
  --gap: 4px;

  display: grid;

  grid-template-columns:
    repeat(var(--columns), minmax(0, 1fr));

  grid-auto-rows: var(--cell-size);

  gap: var(--gap);
}
```

Y después cambiarlo desde JavaScript:

```javascript
element.style.setProperty("--columns", 5);
element.style.setProperty("--cell-size", "80px");
element.style.setProperty("--gap", "10px");
```

¡Sin modificar ninguna regla CSS!

También puedes utilizar:

```css
grid-template-columns:
  repeat(var(--columns), var(--column-width));
```

Esto te permite construir una API donde el CSS define las reglas y JavaScript proporciona los parámetros.

Una precaución: los valores de `--columns` deben resolverse a un entero válido para `repeat()`. Y no todas las funciones CSS admiten cualquier combinación de variables.

---

# 19. Las trampas más habituales de CSS Grid

Quiero dejarte algunas advertencias porque son particularmente importantes cuando construyes interfaces complejas.

### 1. El famoso min-width: auto

Grid tiene un comportamiento que puede sorprenderte.

Por defecto, los elementos Grid tienen un tamaño mínimo automático en determinados contextos. Esto puede impedir que una columna se reduzca lo suficiente y provocar desbordamientos.

Por ejemplo:

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
}
```

Si el segundo elemento contiene una cadena larguísima, puede forzar el crecimiento de la columna.

Una solución habitual:

```css
.container {
  grid-template-columns: 200px minmax(0, 1fr);
}
```

Y en los hijos:

```css
.grid_item {
  min-width: 0;
  min-height: 0;
}
```

Esto es especialmente importante en tus componentes Vue y paneles.

### 2. Grid no equivale a Flexbox

Grid trabaja en dos dimensiones.

Flexbox trabaja principalmente en una dimensión.

No intentes resolver todos los problemas con Grid.

Por ejemplo:

- Distribuir un conjunto de botones en una fila: Flexbox.
- Construir una interfaz de filas y columnas relacionadas: Grid.
- Combinar ambas cosas: Grid exterior y Flexbox interior.

### 3. grid-auto-flow: dense puede alterar el orden visual

Aunque es muy útil para rellenar huecos, no debes olvidar que puede colocar visualmente elementos posteriores antes que otros anteriores.

El orden del DOM no cambia.

### 4. Los elementos absolutos no participan en el auto-placement

Puedes superponer elementos con `position: absolute`, pero no ocuparán una posición automática como los Grid Items normales.

### 5. Los márgenes no son gaps

`gap` separa pistas. `margin` separa cajas.

No son intercambiables.

---

# 20. Mi mapa mental definitivo para trabajar con Grid

Si tuviera que condensar todo lo anterior en una estructura de conocimiento, lo organizaría así:

```text
CSS GRID
│
├── A. CONSTRUCTION
│   │
│   ├── display
│   │
│   ├── EXPLICIT GRID
│   │   ├── grid-template
│   │   ├── grid-template-columns
│   │   ├── grid-template-rows
│   │   └── grid-template-areas
│   │
│   ├── IMPLICIT GRID
│   │   ├── grid-auto-columns
│   │   ├── grid-auto-rows
│   │   └── grid-auto-flow
│   │
│   └── REUSE
│       └── subgrid
│
├── B. TRACK GRAMMAR
│   │
│   ├── <LENGTH>
│   ├── <PERCENTAGE>
│   ├── <FLEX>
│   ├── auto
│   ├── min-content
│   ├── max-content
│   ├── minmax()
│   ├── fit-content()
│   ├── repeat()
│   └── <LINE-NAMES>
│
├── C. PLACEMENT
│   │
│   ├── grid-column
│   ├── grid-row
│   ├── grid-area
│   ├── grid-column-start
│   ├── grid-column-end
│   ├── grid-row-start
│   ├── grid-row-end
│   ├── span
│   ├── auto
│   └── named lines / named areas
│
├── D. ALIGNMENT
│   │
│   ├── ITEMS
│   │   ├── align-items
│   │   ├── justify-items
│   │   ├── place-items
│   │   ├── align-self
│   │   ├── justify-self
│   │   └── place-self
│   │
│   └── TRACKS / CONTENT
│       ├── align-content
│       ├── justify-content
│       └── place-content
│
├── E. SPACING
│   ├── gap
│   ├── row-gap
│   └── column-gap
│
└── F. GENERAL CSS
    │
    ├── dimensions
    ├── padding / margin
    ├── border
    ├── background
    ├── overflow
    ├── position
    ├── box-sizing
    └── typography / visual
```

---

# 21. Documentación de referencia

Te dejo las fuentes que utilizaría para profundizar. La primera es especialmente importante porque es la especificación formal, no simplemente una guía de uso.

1. **[CSS Grid Layout Module — W3C](https://www.w3.org/TR/css-grid-2/?utm_source=chatgpt.com)** — Especificación técnica. Contiene las reglas formales del modelo.
2. **[MDN — CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout?utm_source=chatgpt.com)** — Guía general y ejemplos.
3. **[MDN — Grid properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout?utm_source=chatgpt.com#reference)** — Referencia de propiedades.
4. **[MDN — Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid?utm_source=chatgpt.com)** — Cuadrículas anidadas y compartición de pistas.

---

## Mi conclusión: hay tres niveles que debes dominar

Después de todo este recorrido, quiero dejarte una última reflexión.

Para mí, CSS Grid tiene tres niveles de abstracción:

| Nivel | Qué resuelve | Herramientas |
|---|---|---|
| Estructural | Cómo es la cuadrícula | `grid-template`, `repeat`, `minmax` |
| Espacial | Dónde vive cada elemento | `grid-area`, `span`, líneas |
| Adaptativo | Cómo se comporta ante contenido y espacio | `auto-fit`, `auto-fill`, `fr`, `minmax`, auto-placement |

Y creo que el segundo nivel es el que más potencial tiene para tu proyecto.

**No estás obligado a pensar en filas y columnas como elementos HTML. Puedes pensar en regiones espaciales y asignarles componentes.**

Por ejemplo, imagina una API de layout que internamente genera:

```css
.layout {
  display: grid;

  grid-template:
    "toolbar toolbar toolbar" 40px
    "left    center  right"   1fr
    "footer  footer  footer"  30px
    /
    200px minmax(0, 1fr) 250px;
}
```

Y después cada componente ocupa una región:

```css
.toolbar { grid-area: toolbar; }
.left    { grid-area: left; }
.center  { grid-area: center; }
.right   { grid-area: right; }
.footer  { grid-area: footer; }
```

Eso es prácticamente un sistema declarativo de composición de interfaces.

Y una última cosa: **Grid puede ser la geometría de tu sistema de vistas, mientras que Vue puede ser el motor que materializa los componentes.** Son dos responsabilidades perfectamente separables.

Creo que ahí tienes muchísimo terreno para experimentar. 😁