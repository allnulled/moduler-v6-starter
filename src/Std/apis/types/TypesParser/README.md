# TypesParser

Documentación oficial del parser de `typeslang`.

## Índice

- [TypesParser](#typesparser)
  - [Índice](#índice)
  - [Features](#features)
    - [Feature 001: Primitivos básicos](#feature-001-primitivos-básicos)
    - [Feature 002: Negación, agrupación, conjunción y disyunción](#feature-002-negación-agrupación-conjunción-y-disyunción)
    - [Feature 003: Operador de esparción en arrays y parámetros de función](#feature-003-operador-de-esparción-en-arrays-y-parámetros-de-función)
    - [Feature 004: Multiplicadores en arrays y parámetros de función](#feature-004-multiplicadores-en-arrays-y-parámetros-de-función)
    - [Feature 005: Variables reusables](#feature-005-variables-reusables)
    - [Feature 006: Importación por fetch o fs](#feature-006-importación-por-fetch-o-fs)

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

### Feature 003: Operador de esparción en arrays y parámetros de función

```tyla
// con arrays:
[...[number, string], ...[boolean]];
// con funciones:
function(...[number, boolean], ...[{}]) => undefined;
```

### Feature 004: Multiplicadores en arrays y parámetros de función

```tyla
// con arrays:
[number?, string+, function () => any*];
// con funciones:
function(number?, string+, function () => any*) => any;
```

### Feature 005: Variables reusables

```tyla
@id number;
@name string;
// Reusable en un objeto:
{id:@id,name:@name};
// O incluso abreviado:
{@id,@name};
```

### Feature 006: Importación por fetch o fs

```tyla
{
   // Como path:
   person: ^"./subtypes/persona.tyla",
   // Como file con fs:
   place: ^file:"./subtypes/geolocation.tyla",
   // Como url con fetch:
   moment: ^url:"./subtypes/moment.tyla",
   // Como path, que es según el contexto:
   message: ^path:"./subtypes/message.tyla",
}
```
