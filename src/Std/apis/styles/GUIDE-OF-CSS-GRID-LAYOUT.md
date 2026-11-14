# CSS Grid Layout API

Guía completa de Grid Layout API.

# Índice

- [CSS Grid Layout API](#css-grid-layout-api)
- [Índice](#índice)
- [Bibliografía previa](#bibliografía-previa)
- [Propiedades agrupadoras](#propiedades-agrupadoras)
- [Sintaxis formales](#sintaxis-formales)
  - [Sintaxis formas de grid](#sintaxis-formas-de-grid)
  - [Sintaxis formal de grid-template](#sintaxis-formal-de-grid-template)
- [Pregunta para ChatGPT](#pregunta-para-chatgpt)
- [1. Construir una tabla con CSS Grid](#1-construir-una-tabla-con-css-grid)
- [2. Gramática de tamaños de columnas y filas](#2-gramática-de-tamaños-de-columnas-y-filas)
  - [2.1. `<TRACK-BREADTH>`](#21-track-breadth)
    - [`<LENGTH-PERCENTAGE>`](#length-percentage)
    - [`<FLEX>`](#flex)
    - [`<INFLEXIBLE-BREADTH>`](#inflexible-breadth)
- [3. Las funciones de dimensionamiento](#3-las-funciones-de-dimensionamiento)
  - [3.1. minmax()](#31-minmax)
  - [3.2. fit-content()](#32-fit-content)
  - [3.3. repeat()](#33-repeat)
- [4. Resolvamos tus variantes de columnas](#4-resolvamos-tus-variantes-de-columnas)
  - [Caso A. Anchura adaptada al contenido](#caso-a-anchura-adaptada-al-contenido)
  - [Caso B. Adaptada al contenido, pero con un mínimo y un máximo](#caso-b-adaptada-al-contenido-pero-con-un-mínimo-y-un-máximo)
  - [Caso C. Anchura expandida independientemente del contenido](#caso-c-anchura-expandida-independientemente-del-contenido)
  - [Caso D. Anchura expandida con límite porcentual](#caso-d-anchura-expandida-con-límite-porcentual)
- [5. Gramática completa de `<LENGTH>`](#5-gramática-completa-de-length)
  - [5.1. Absolutas](#51-absolutas)
  - [5.2. Relativas a fuentes](#52-relativas-a-fuentes)
  - [5.3. Relativas al viewport](#53-relativas-al-viewport)
  - [5.4. Relativas a contenedores](#54-relativas-a-contenedores)
- [6. Gramática de `<PERCENTAGE>`](#6-gramática-de-percentage)
- [7. Gramática de las funciones matemáticas CSS](#7-gramática-de-las-funciones-matemáticas-css)
    - [calc()](#calc)
    - [min()](#min)
    - [max()](#max)
    - [clamp()](#clamp)
    - [minmax()](#minmax)
- [8. Tu tabla: catálogo final de configuraciones](#8-tu-tabla-catálogo-final-de-configuraciones)
  - [9. Una última consideración para tu documento](#9-una-última-consideración-para-tu-documento)

# Bibliografía previa

- Propiedades implicadas:
   1. [grid](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid)
   2. [grid-template](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template)
   3. [grid-template-columns](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-columns)
   4. [grid-template-rows](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-rows)
   5. [grid-template-areas](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-template-areas)
   6. [grid-auto-columns](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-auto-columns)
   7. [grid-auto-rows](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-auto-rows)
   8. [grid-auto-flow](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-auto-flow)
   9. [grid-row-start](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-row-start)
   10. [grid-column-start](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-column-start)
   11. [grid-row-end](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-row-end)
   12. [grid-column-end](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-column-end)
   13. [grid-row](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-row)
   14. [grid-column](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-column)
   15. [grid-area](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid-area)
   16. [gap](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/gap)
   17. [row-gap](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/row-gap)
   18. [column-gap](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/column-gap)
- Funciones implicadas:
   1. [repeat()](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/repeat)
   2. [minmax()](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/minmax)
   3. [fit-content()](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Values/fit-content)
- Ontologías implicadas:
   1. [Grid](https://developer.mozilla.org/es/docs/Glossary/Grid)
   2. [Grid Lines](https://developer.mozilla.org/es/docs/Glossary/Grid_Lines)
   3. [Grid Tracks](https://developer.mozilla.org/es/docs/Glossary/Grid_Tracks)
   4. [Grid Cell](https://developer.mozilla.org/es/docs/Glossary/Grid_Cell)
   5. [Grid Area](https://developer.mozilla.org/es/docs/Glossary/Grid_Area)
   6. [Gutters](https://developer.mozilla.org/es/docs/Glossary/Gutters)
   7. [Grid Axis](https://developer.mozilla.org/es/docs/Glossary/Grid_Axis)
   8. [Grid row](https://developer.mozilla.org/es/docs/Glossary/Grid_row)
   9. [Grid column](https://developer.mozilla.org/es/docs/Glossary/Grid_column)
- Guías de ayuda:
   1. [Basic concepts of Grid Layout](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Basic_concepts_of_Grid_Layout)
   2. [Relationship of Grid Layout to other layout methods](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Relationship_of_Grid_Layout_to_other_layout_methods)
   3. [Layout using line-based placement](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Layout_using_line-based_placement)
   4. [Grid template areas](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Grid_template_areas)
   5. [Layout using named grid lines](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Layout_using_named_grid_lines)
   6. [Auto-placement in CSS Grid Layout](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Auto-placement_in_CSS_Grid_Layout)
   7. [Box alignment in CSS Grid Layout](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Box_alignment_in_CSS_Grid_Layout)
   8. [CSS Grid, Logical Values and Writing Modes](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/CSS_Grid,_Logical_Values_and_Writing_Modes)
   9. [CSS Grid Layout and accessibility](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/CSS_Grid_Layout_and_accessibility)
   10. [CSS Grid and progressive enhancement](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/CSS_Grid_and_progressive_enhancement)
   11. [Realising common layouts using CSS Grid](https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout/Realising_common_layouts_using_CSS_Grid)


# Propiedades agrupadoras

- [grid](https://developer.mozilla.org/es/docs/Web/CSS/Reference/Properties/grid) agrupa:
   - [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows)
   - [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns)
   - [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-areas)
   - [grid-auto-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-rows)
   - [grid-auto-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-columns)
   - [grid-auto-flow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-flow)
   - [grid-row-gap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-row-gap)
   - [grid-column-gap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-column-gap)
- [grid-template](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template) agrupa:
   - [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows)
   - [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns)
   - [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-areas)

# Sintaxis formales

## Sintaxis formas de grid

```txt
grid = 
  <'grid-template'>                                   |
  <'grid-template-rows'> / [ column-gap && dense? ] <'grid-auto-columns'>?  |
  [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>  

<grid-template> = 
  none                                                |
  [ <'grid-template-rows'> / <'grid-template-columns'> ]  |
  [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?  

<grid-template-rows> = 
  none                       |
  <track-list>               |
  <auto-track-list>          |
  subgrid <line-name-list>?  

<grid-auto-columns> = 
  <track-size>+  

<grid-auto-rows> = 
  <track-size>+  

<grid-template-columns> = 
  none                       |
  <track-list>               |
  <auto-track-list>          |
  subgrid <line-name-list>?  

<line-names> = 
  '[' <custom-ident>* ']'  

<track-size> = 
  <track-breadth>                                   |
  minmax( <inflexible-breadth> , <track-breadth> )  |
  fit-content( <length-percentage [0,∞]> )          

<explicit-track-list> = 
  [ <line-names>? <track-size> ]+ <line-names>?  

<track-list> = 
  [ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?  

<auto-track-list> = 
  [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>? <auto-repeat> [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?  

<line-name-list> = 
  [ <line-names> | <name-repeat> ]+  

<track-breadth> = 
  <length-percentage [0,∞]>  |
  <flex [0,∞]>               |
  min-content                |
  max-content                |
  auto                       

<inflexible-breadth> = 
  <length-percentage [0,∞]>  |
  min-content                |
  max-content                |
  auto                       

<length-percentage> = 
  <length>      |
  <percentage>  

<track-repeat> = 
  repeat( [ <integer [1,∞]> ] , [ <line-names>? <track-size> ]+ <line-names>? )  

<fixed-size> = 
  <fixed-breadth>                                   |
  minmax( <fixed-breadth> , <track-breadth> )       |
  minmax( <inflexible-breadth> , <fixed-breadth> )  

<fixed-repeat> = 
  repeat( [ <integer [1,∞]> ] , [ <line-names>? <fixed-size> ]+ <line-names>? )  

<auto-repeat> = 
  repeat( [ auto-fill | auto-fit ] , [ <line-names>? <track-size> ]+ <line-names>? )  

<name-repeat> = 
  repeat( [ <integer [1,∞]> | auto-fill ] , <line-names>+ )  

<integer> = 
  <number-token>  

<fixed-breadth> = 
  <length-percentage [0,∞]>
```

## Sintaxis formal de grid-template

```txt
grid-template = 
  none                                                |
  [ <'grid-template-rows'> / <'grid-template-columns'> ]  |
  [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?  

<grid-template-rows> = 
  none                       |
  <track-list>               |
  <auto-track-list>          |
  subgrid <line-name-list>?  

<grid-template-columns> = 
  none                       |
  <track-list>               |
  <auto-track-list>          |
  subgrid <line-name-list>?  

<line-names> = 
  '[' <custom-ident>* ']'  

<track-size> = 
  <track-breadth>                                   |
  minmax( <inflexible-breadth> , <track-breadth> )  |
  fit-content( <length-percentage [0,∞]> )          

<explicit-track-list> = 
  [ <line-names>? <track-size> ]+ <line-names>?  

<track-list> = 
  [ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?  

<auto-track-list> = 
  [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>? <auto-repeat> [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?  

<line-name-list> = 
  [ <line-names> | <name-repeat> ]+  

<track-breadth> = 
  <length-percentage [0,∞]>  |
  <flex [0,∞]>               |
  min-content                |
  max-content                |
  auto                       

<inflexible-breadth> = 
  <length-percentage [0,∞]>  |
  min-content                |
  max-content                |
  auto                       

<length-percentage> = 
  <length>      |
  <percentage>  

<track-repeat> = 
  repeat( [ <integer [1,∞]> ] , [ <line-names>? <track-size> ]+ <line-names>? )  

<fixed-size> = 
  <fixed-breadth>                                   |
  minmax( <fixed-breadth> , <track-breadth> )       |
  minmax( <inflexible-breadth> , <fixed-breadth> )  

<fixed-repeat> = 
  repeat( [ <integer [1,∞]> ] , [ <line-names>? <fixed-size> ]+ <line-names>? )  

<auto-repeat> = 
  repeat( [ auto-fill | auto-fit ] , [ <line-names>? <track-size> ]+ <line-names>? )  

<name-repeat> = 
  repeat( [ <integer [1,∞]> | auto-fill ] , <line-names>+ )  

<integer> = 
  <number-token>  

<fixed-breadth> = 
  <length-percentage [0,∞]>  
```

# Pregunta para ChatGPT

- ¿Cómo hago una tabla con CSS Grid Layout?
   - Que tenga columnas y filas
   - Que soporte rowspan
   - Que soporte colspan
   - Que tenga columnas de ancho adaptado al contenido
      - pero con un mínimo
      - y con un máximo
   - Que tenga columnas de ancho expandido pese al contenido
      - con un máximo, pero porcentual
   - Y en el proceso de conseguirlo, me gustaría saber qué otras unidades (px, %) y funciones (fit minmax) puedo usar para sacar variantes.
   - Y necesito una breve lista explicativa con las unidades que hay, de vh, y esas raras. Saber a qué se refieren cada una, qué opciones tengo.

----

Ahora sí. He visto tu documento y creo que entiendo mucho mejor lo que estás construyendo. No quieres un tutorial de Grid: quieres un **árbol de gramáticas CSS**, donde cada tipo se descompone recursivamente hasta llegar a sus valores terminales.

Voy a respetar tu organización y empezar por las preguntas del apartado 20, sin volver a explicarte los conceptos visuales de Grid.

Hay una cuestión importante: tu documento ya contiene buena parte de la gramática formal de `grid-template`, `track-size`, `repeat()` y sus derivados. Vamos a aprovecharla como punto de partida. Texto pegado(20261114-085847)

# 1. Construir una tabla con CSS Grid

Primero, la estructura básica:

```css
.Table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: 1px;
}
```

Los elementos se distribuyen automáticamente por filas.

Para combinar celdas:

```css
.Cell {
  grid-column: span 2;
  grid-row: span 2;
}
```

Los dos mecanismos que necesitas son:

```text
<GRID-PLACEMENT>
│
├── <COLUMN-PLACEMENT>
│   ├── grid-column
│   ├── grid-column-start
│   └── grid-column-end
│
└── <ROW-PLACEMENT>
    ├── grid-row
    ├── grid-row-start
    └── grid-row-end
```

La gramática de ambos shorthands es:

```text
grid-column =
  <GRID-LINE> / <GRID-LINE>?
  | <GRID-LINE>?
  
grid-row =
  <GRID-LINE> / <GRID-LINE>?
  | <GRID-LINE>?
```

Y el tipo terminal:

```text
<GRID-LINE>
│
├── auto
│
├── <INTEGER>
│
├── <CUSTOM-IDENT>
│
├── span <INTEGER>
│
├── span <CUSTOM-IDENT>
│
└── span <INTEGER> <CUSTOM-IDENT>
```

Ejemplos:

```css
grid-column: 1 / 3;
grid-column: 2 / span 3;
grid-column: span 2;
grid-column: auto / 4;

grid-row: 1 / 3;
grid-row: span 2;
```

Para tu tabla, la equivalencia directa es:

```text
colspan="N"  → grid-column: span N
rowspan="N"  → grid-row: span N
```

Una precisión: el posicionamiento automático de los elementos restantes puede verse condicionado por los espacios ocupados por los elementos que tienen `span`. No necesitas crear manualmente las filas.

---

# 2. Gramática de tamaños de columnas y filas

Esta es la parte central de tu documento: `<track-size>`.

Tu documento recoge esta producción: Texto pegado(20261114-085847)

```text
<TRACK-SIZE>
│
├── <TRACK-BREADTH>
│
├── minmax(
│     <INFLEXIBLE-BREADTH>,
│     <TRACK-BREADTH>
│   )
│
└── fit-content(
      <LENGTH-PERCENTAGE>
    )
```

Vamos a desplegar cada rama.

## 2.1. `<TRACK-BREADTH>`

```text
<TRACK-BREADTH>
│
├── <LENGTH-PERCENTAGE>
│
├── <FLEX>
│
├── min-content
│
├── max-content
│
└── auto
```

### `<LENGTH-PERCENTAGE>`

```text
<LENGTH-PERCENTAGE>
│
├── <LENGTH>
│
└── <PERCENTAGE>
```

### `<FLEX>`

```text
<FLEX>
│
└── <NUMBER>fr
```

Ejemplos:

```css
1fr
2fr
0.5fr
3.25fr
```

Importante: `fr` no es una unidad de longitud. Es una unidad flexible de distribución del espacio disponible.

### `<INFLEXIBLE-BREADTH>`

Esta es otra rama que tienes en tu documento:

```text
<INFLEXIBLE-BREADTH>
│
├── <LENGTH-PERCENTAGE>
│
├── min-content
│
├── max-content
│
└── auto
```

La diferencia fundamental es que no admite `<FLEX>`.

Por tanto:

```css
minmax(100px, 1fr);            /* Válido */
minmax(min-content, 1fr);      /* Válido */

minmax(1fr, 300px);            /* Inválido */
minmax(1fr, 2fr);              /* Inválido */
```

---

# 3. Las funciones de dimensionamiento

Aquí tienes tres mecanismos diferentes que conviene no confundir.

## 3.1. minmax()

```text
minmax(
  <MIN>,
  <MAX>
)
```

Ejemplos:

```css
minmax(100px, 300px)
minmax(100px, 1fr)
minmax(min-content, max-content)
minmax(min-content, 1fr)
minmax(0, 1fr)
minmax(20%, 50%)
```

La función establece un intervalo entre un mínimo y un máximo.

Hay dos reglas importantes:

- El primer argumento no admite `fr`.
- Si el máximo resulta inferior al mínimo, se ignora el máximo.

## 3.2. fit-content()

```text
fit-content(
  <LENGTH-PERCENTAGE>
)
```

Ejemplos:

```css
fit-content(200px)
fit-content(20rem)
fit-content(30%)
fit-content(calc(100% - 20px))
```

Su fórmula es:

```text
max(
  AUTO-MINIMUM,
  min(
    LIMIT,
    MAX-CONTENT
  )
)
```

Esto significa que el contenido determina el tamaño, pero se establece un límite de crecimiento.

Una particularidad: el mínimo es automático, no lo defines directamente como argumento.

## 3.3. repeat()

```text
repeat(
  <REPETITION-COUNT>,
  <TRACK-LIST>
)
```

Donde:

```text
<REPETITION-COUNT>
│
├── <POSITIVE-INTEGER>
│
├── auto-fill
│
└── auto-fit
```

Y:

```text
<TRACK-LIST>
│
├── <TRACK-SIZE>
│
├── <TRACK-SIZE> <TRACK-SIZE>
│
└── ... 
```

Ejemplos:

```css
repeat(3, 100px)
repeat(3, 1fr)
repeat(3, minmax(100px, 1fr))
repeat(2, 100px 200px)
repeat(auto-fill, 200px)
repeat(auto-fit, minmax(150px, 1fr))
```

La gramática formal tiene restricciones adicionales según el tipo de repetición. Tu documento distingue correctamente `<track-repeat>`, `<fixed-repeat>` y `<auto-repeat>`. Texto pegado(20261114-085847)

---

# 4. Resolvamos tus variantes de columnas

Aquí es donde aplicamos las producciones anteriores.

## Caso A. Anchura adaptada al contenido

Quieres que la columna crezca según el contenido.

```css
grid-template-columns: max-content;
```

O:

```css
grid-template-columns: min-content;
```

O:

```css
grid-template-columns: auto;
```

Diferencias:

| Valor | Comportamiento |
|---|---|
| `min-content` | Busca el tamaño intrínseco mínimo. |
| `max-content` | Busca el tamaño intrínseco máximo sin saltos adicionales. |
| `auto` | Utiliza el dimensionamiento automático, teniendo en cuenta mínimos y máximos intrínsecos. |

## Caso B. Adaptada al contenido, pero con un mínimo y un máximo

Aquí tienes varias posibilidades.

**Opción 1: mínimo y máximo intrínsecos.**

```css
grid-template-columns: minmax(min-content, max-content);
```

**Opción 2: contenido adaptativo con límite máximo.**

```css
grid-template-columns: fit-content(300px);
```

**Opción 3: mínimo intrínseco y máximo explícito.**

```css
grid-template-columns: minmax(min-content, 300px);
```

**Opción 4: mínimo y máximo absolutos.**

```css
grid-template-columns: minmax(150px, 300px);
```

Hay una diferencia importante entre las opciones:

- `fit-content(300px)` limita el crecimiento según el contenido, conservando un mínimo automático.
- `minmax(min-content, 300px)` utiliza el mínimo intrínseco y un máximo de 300px.
- `minmax(150px, 300px)` establece un intervalo fijo.

Si quieres un mínimo explícito y un máximo que se adapte al contenido, puedes combinar `fit-content()` con el mínimo del elemento:

```css
.Cell {
  min-width: 150px;
}

.Table {
  grid-template-columns: fit-content(300px);
}
```

El mínimo automático de la pista tendrá en cuenta el mínimo especificado en el elemento. Esto requiere tener presente el algoritmo de dimensionamiento de pistas.

## Caso C. Anchura expandida independientemente del contenido

Aquí utilizaría:

```css
grid-template-columns: minmax(0, 1fr);
```

Esto permite que la pista absorba el espacio flexible disponible, sin dejar que su mínimo automático basado en el contenido la fuerce a crecer.

Para tres columnas:

```css
grid-template-columns: repeat(3, minmax(0, 1fr));
```

## Caso D. Anchura expandida con límite porcentual

Aquí hay dos alternativas según lo que quieras conseguir.

**Máximo porcentual:**

```css
grid-template-columns: minmax(0, 40%);
```

**Mínimo y máximo porcentuales:**

```css
grid-template-columns: minmax(20%, 40%);
```

**Adaptación al contenido con límite porcentual:**

```css
grid-template-columns: fit-content(40%);
```

Y una distinción importante:

```css
minmax(0, 1fr)
```

No es lo mismo que:

```css
minmax(0, 40%)
```

La primera distribuye espacio flexible disponible. La segunda establece un máximo porcentual.

`fr` no es un porcentaje y no tiene un límite porcentual incorporado.

La documentación de dimensionamiento de pistas recoge estas diferencias y las reglas de resolución de mínimos y máximos. [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns?utm_source=chatgpt.com)

---

# 5. Gramática completa de `<LENGTH>`

Esta es otra rama que te interesa tener desplegada.

CSS tiene varias familias de unidades de longitud.

```text
<LENGTH>
│
├── ABSOLUTE
│   │
│   ├── px
│   ├── cm
│   ├── mm
│   ├── Q
│   ├── in
│   ├── pc
│   └── pt
│
├── FONT-RELATIVE
│   │
│   ├── em
│   ├── ex
│   ├── ch
│   ├── cap
│   ├── ic
│   └── lh
│
├── ROOT-FONT-RELATIVE
│   │
│   ├── rem
│   ├── rex
│   ├── rch
│   ├── rcap
│   ├── ric
│   └── rlh
│
├── VIEWPORT-RELATIVE
│   │
│   ├── vw
│   ├── vh
│   ├── vi
│   ├── vb
│   ├── vmin
│   └── vmax
│
├── SMALL-VIEWPORT
│   │
│   ├── svw
│   ├── svh
│   ├── svi
│   ├── svb
│   ├── svmin
│   └── svmax
│
├── LARGE-VIEWPORT
│   │
│   ├── lvw
│   ├── lvh
│   ├── lvi
│   ├── lvb
│   ├── lvmin
│   └── lvmax
│
├── DYNAMIC-VIEWPORT
│   │
│   ├── dvw
│   ├── dvh
│   ├── dvi
│   ├── dvb
│   ├── dvmin
│   └── dvmax
│
└── CONTAINER-RELATIVE
    │
    ├── cqw
    ├── cqh
    ├── cqi
    ├── cqb
    ├── cqmin
    └── cqmax
```

Vamos a interpretar las unidades.

## 5.1. Absolutas

| Unidad | Significado |
|---|---|
| `px` | Píxel CSS. |
| `cm` | Centímetro. |
| `mm` | Milímetro. |
| `Q` | Cuarto de milímetro. |
| `in` | Pulgada. |
| `pc` | Pica. |
| `pt` | Punto tipográfico. |

Equivalencias:

```text
1in = 96px
1in = 2.54cm
1pc = 12pt
1pt = 1/72in
1Q  = 1/40cm
```

## 5.2. Relativas a fuentes

| Unidad | Referencia |
|---|---|
| `em` | Tamaño de fuente del elemento. |
| `ex` | Altura de la letra x de la fuente. |
| `ch` | Anchura de avance del carácter 0. |
| `cap` | Altura de las mayúsculas. |
| `ic` | Anchura de avance del carácter ideográfico. |
| `lh` | Altura de línea del elemento. |

Las unidades `r*` utilizan como referencia el elemento raíz:

| Unidad | Referencia |
|---|---|
| `rem` | Tamaño de fuente raíz. |
| `rex` | Altura x de la fuente raíz. |
| `rch` | Anchura del carácter 0 de la fuente raíz. |
| `rcap` | Altura de mayúsculas de la fuente raíz. |
| `ric` | Anchura ideográfica de la fuente raíz. |
| `rlh` | Altura de línea raíz. |

## 5.3. Relativas al viewport

Las unidades tradicionales:

| Unidad | Referencia |
|---|---|
| `vw` | 1% de la anchura del viewport. |
| `vh` | 1% de la altura del viewport. |
| `vi` | 1% del eje inline del viewport. |
| `vb` | 1% del eje block del viewport. |
| `vmin` | 1% de la dimensión menor. |
| `vmax` | 1% de la dimensión mayor. |

Las otras tres familias tienen una diferencia importante:

| Familia | Referencia |
|---|---|
| `sv*` | Viewport pequeño. |
| `lv*` | Viewport grande. |
| `dv*` | Viewport dinámico. |

Esto resulta especialmente relevante en móviles, donde las barras del navegador pueden modificar el espacio visible.

## 5.4. Relativas a contenedores

Estas son especialmente interesantes para construir componentes reutilizables.

| Unidad | Referencia |
|---|---|
| `cqw` | 1% de la anchura del contenedor. |
| `cqh` | 1% de la altura del contenedor. |
| `cqi` | 1% del eje inline del contenedor. |
| `cqb` | 1% del eje block del contenedor. |
| `cqmin` | 1% de la dimensión menor. |
| `cqmax` | 1% de la dimensión mayor. |

Por ejemplo:

```css
.Table {
  container-type: inline-size;
}

.Table > .Cell {
  width: 25cqw;
}
```

Así puedes dimensionar elementos según su contenedor, no según toda la ventana.

**Importante:** para las unidades `cq*` necesitas un contenedor de consulta elegible. Si no existe, se utiliza el viewport pequeño como referencia de fallback.

Referencia completa de unidades: [CSS Length — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length?utm_source=chatgpt.com).

---

# 6. Gramática de `<PERCENTAGE>`

No es una unidad de longitud, sino un tipo numérico independiente.

```text
<PERCENTAGE>
│
└── <NUMBER>%
```

Ejemplos:

```css
10%
25%
50%
100%
```

En Grid, los porcentajes de `grid-template-columns` se calculan respecto a la dimensión correspondiente del área de contenido del contenedor.

Por ejemplo:

```css
grid-template-columns: 25% 50% 25%;
```

Una advertencia: si el tamaño del contenedor depende intrínsecamente de sus propias pistas, los porcentajes pueden resolverse inicialmente como `auto` y producir ajustes posteriores.

---

# 7. Gramática de las funciones matemáticas CSS

Aquí hay otra familia que merece su propio árbol.

Las funciones matemáticas permiten construir expresiones de longitud y porcentaje.

```text
<CSS-MATH-FUNCTION>
│
├── calc()
│
├── min()
│
├── max()
│
├── clamp()
│
└── minmax()       [ESPECÍFICA DE GRID]
```

### calc()

```css
calc(100% - 20px)
calc(50vw + 10rem)
calc(100% / 3)
calc(2 * 50px)
```

### min()

Devuelve el menor valor:

```css
min(100%, 500px)
min(50vw, 800px)
```

### max()

Devuelve el mayor:

```css
max(200px, 20%)
max(10rem, 30vw)
```

### clamp()

Establece mínimo, valor preferido y máximo:

```css
clamp(
  200px,
  50%,
  600px
)
```

Su fórmula:

```text
clamp(MIN, PREFERRED, MAX)
```

### minmax()

La función de Grid:

```css
minmax(200px, 1fr)
```

No debes confundirla con `clamp()`.

`clamp()` calcula un valor numérico acotado. `minmax()` establece una función de dimensionamiento para una pista Grid.

Una precisión gramatical: `min()`, `max()` y `clamp()` pueden generar valores `<length-percentage>` cuando sus argumentos son compatibles. No puedes utilizar cualquier expresión matemática en cualquier posición de Grid.

---

# 8. Tu tabla: catálogo final de configuraciones

Para que tengas una colección de expresiones que puedas probar directamente:

| Objetivo | Expresión |
|---|---|
| Anchura fija | `200px` |
| Anchura porcentual | `30%` |
| Anchura flexible | `1fr` |
| Anchura intrínseca mínima | `min-content` |
| Anchura intrínseca máxima | `max-content` |
| Anchura automática | `auto` |
| Mínimo y máximo fijos | `minmax(100px, 300px)` |
| Mínimo intrínseco y máximo fijo | `minmax(min-content, 300px)` |
| Mínimo fijo y máximo flexible | `minmax(100px, 1fr)` |
| Mínimo y máximo intrínsecos | `minmax(min-content, max-content)` |
| Contenido limitado a 300px | `fit-content(300px)` |
| Contenido limitado al 30% | `fit-content(30%)` |
| Flexible sin mínimo automático | `minmax(0, 1fr)` |
| Mínimo y máximo porcentuales | `minmax(20%, 40%)` |
| Repetir tres columnas iguales | `repeat(3, 1fr)` |
| Repetir columnas adaptables | `repeat(auto-fit, minmax(150px, 1fr))` |
| Anchura calculada | `calc(100% - 20px)` |
| Anchura acotada | `clamp(150px, 30%, 400px)` |

## 9. Una última consideración para tu documento

Hay algo que quiero señalar porque afecta a cómo estás construyendo el árbol.

En tu documento, las producciones de `<track-size>` y `<track-breadth>` están bastante bien descompuestas. Sin embargo, yo mantendría tres ramas completamente independientes:

```text
<GRID-TRACK-SIZING>
│
├── <TRACK-SIZE>
│   ├── <TRACK-BREADTH>
│   ├── minmax()
│   └── fit-content()
│
├── <TRACK-REPEAT>
│   ├── repeat(integer, ...)
│   ├── repeat(auto-fill, ...)
│   └── repeat(auto-fit, ...)
│
└── <TRACK-NAMES>
    ├── <LINE-NAMES>
    └── <NAME-REPEAT>
```

Así evitas mezclar el dimensionamiento de una pista con la repetición de pistas y con la nomenclatura de líneas.

Es una separación importante para que tu cheatsheet termine siendo una gramática navegable y no una colección de propiedades.

**Y creo que este es el nivel de detalle que estabas buscando:** cada producción tiene sus alternativas, cada tipo se descompone y cada hoja termina en un valor CSS concreto.