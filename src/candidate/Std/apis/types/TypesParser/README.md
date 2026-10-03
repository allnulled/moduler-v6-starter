# TypesParser

Documentación oficial del parser de `typeslang`.

## Índice

- [TypesParser](#typesparser)
  - [Índice](#índice)
  - [Proceso](#proceso)
  - [Features](#features)
    - [Feature 001: Primitivos básicos](#feature-001-primitivos-básicos)
    - [Feature 002: Negación, agrupación, conjunción y disyunción](#feature-002-negación-agrupación-conjunción-y-disyunción)
    - [Feature 003: Opcionalidad](#feature-003-opcionalidad)
    - [Feature 004: Opcionalidad en propiedad de objeto](#feature-004-opcionalidad-en-propiedad-de-objeto)
    - [Feature 005: Listas, grupos de lista y multiplicadores](#feature-005-listas-grupos-de-lista-y-multiplicadores)

## Proceso

- [ ] Misión 1:
   - [ ] Se anula la sintaxis de «Lista repetible»
   - [ ] Se substituye por «Grupos paramétricos» y «Multiplicadores»
- [ ] Misión 2:
   - [ ] Se anula la sintaxis de opcionalidad ? en el evaluable
   - [ ] Se substituye por `|undefined`
   - [ ] Se mantiene opcionalidad en la propiedad de objeto
   - [ ] Se extenderá opcionalidad en elementos de lista
      - [ ] Para listas
      - [ ] Para parámetros de función
      - [ ] Para parámetros de tipo
   - [ ] Se añadirá a la opcionalidad:
      - [ ] 0 o más con *
      - [ ] 1 o más con +
   - [ ] Con esto, la opcionalidad desaparece para evaluable,
      - [ ] pero se fusiona con la multiplicidad y sigue existiendo:
         - [ ] para propiedad de objeto
         - [ ] para elementos de array
         - [ ] para parámetros de función
         - [ ] para parámetros de tipo
      - [ ] y no afecta, porque sigues teniendo la opción de `|undefined`
   - [ ] y así se reserva el `?` con los `+` y `*` solo en los casos donde tienen sentido:
      - [ ] en listas de elementos
      - [ ] no en tipos, un tipo no tendrá esto en este lenguaje: `tipo?` `tipo(string)?`
         - [ ] pudiendo poner esto y no inmiscuir al interrogante: `tipo|undefined` `tipo(string)|undefined`
   - [ ] De aquí se deduce que:
      - [ ] El símbolo de opcionalidad `?` no es nunca `o undefined`
      - [ ] El símbolo de opcionalidad `?` nos dice que un elemento o grupo puede estar, o no estar.
         - [ ] y esa expresión solo tiene sentido en un conjunto
            - [ ] como las propiedades del objeto, con `?:`
            - [ ] como los elementos de una lista, con `,?`

## Features

A continuación se enumeran y ejemplifican las features que soporta el lenguaje.

### Feature 001: Primitivos básicos

Las ontologías más básicas, que incluye tipos custom parametrizables.

```tyla
undefined;
null;
boolean;
number;
string;
[];
{};
function() => undefined;
async function() => undefined;
custom;
custom(string,number);
```

### Feature 002: Negación, agrupación, conjunción y disyunción

Las operaciones lógicas más básicas.

```tyla
// negación: no booleano
!boolean;

// agrupación + disyunción: objeto y no (booleano o número o string)
{} & !(boolean | number | string);

// conjunción: con user:string y con password:string
{user:string} & {password:string}
```

### Feature 003: Opcionalidad

- El `?` puede aplicarse a varias ontologías que son distintas:
   - A un tipo nominado:
      - `custom?`
      - `custom(string)?`
      - sería lo mismo que poner `custom(string) | undefined`
   - A una propiedad de objeto:
      - `{name?:string}`
      - no sería lo mismo que poner `{name: string|undefined}`
      - sería decir que esa propiedad puede no estar y no pasa nada
   - A una agrupación de tipo:
      - `(number|string|boolean)?`
      - sería lo mismo que poner `number|string|boolean|undefined`
   - A una agrupación de elementos:
      - solo puede existir en:
         - parámetros de funciones
         - parámetros de tipo
         - elementos de lista
      - la opcionalidad se aplica a la coma
         - sus posibles símbolos son:
            - `[a,?]`
            - `[a,b,c,?]`
            - `[...(a,b,c)?]`
         - porque se aplica a los elementos como elementos dentro del conjunto o fuera
            - no se aplica a los tipos como tipos definidos o indefinidos
      - sería decir que ese elemento o grupo de elementos


### Feature 004: Opcionalidad en propiedad de objeto

### Feature 005: Listas, grupos de lista y multiplicadores

Ahora tendríamos que poder:

```tyla
[a?,]
[a,b?,]
[a,b,c?,]
[...[a?,b?,c?,]?,]
[...tipo?,]
[...tipo1|tipo2|tipo3,?]
[...tipo1|tipo2|tipo3,+]
[...tipo1|tipo2|tipo3,*]
```


Antes:

```tyla
// Esto serían LAS ANTERIORMENTE CONOCIDAS COMO listas repetibles:
// [^number|string, function() => undefined]
// Pero en realidad usarías esto:
// [...(number|string, function() => undefined)*]
```

