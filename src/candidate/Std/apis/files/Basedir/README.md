# Std.classes.Basedir

## Definición

> Clase para crear instancias que puedasn localmente:
>  - Juntar rutas parciales correctamente:
>     - mediante `Basedir.prototype.resolvePath`
>  - Normalizar y resolver rutas relativas:
>     - mediante `Basedir.prototype.normalizationOf`
>     - a raíz `this.rootdir = string` con `@/` y
>     - a base `this.basedir = string` con `./`
>  - Extraer referencias relativas de raíz y de base:
>     - mediante `Basedir.prototype.{basepathOf,rootpathOf}`
>  - Ofrecer utilidades relacionadas con la resolución y reconstrucción de rutas
>     - como reconstruir el directorio superior:
>        - mediante `Basedir.prototype.{basepathOf,rootpathOf}`
>     - como añadir el símbolo de unión de rutas al final:
>        - mediante `Basedir.prototype.appendPathSeparator`
>     - y otros.

## Instanciación

```js
const base = Std.classes.Basedir.new.config({
    rootdir: "root",
    basedir: "root/basedir",
});
```

## Propiedades

```js
base.basedir = string
base.rootdir = string
```

## Métodos prototipo más útiles

- `Basedir.prototype.resolvePath(subpaths:[string]) => string`
- `Basedir.prototype.normalizationOf(subpath:string) => string`
- `Basedir.prototype.basepathOf(subpath:string) => string`
- `Basedir.prototype.rootpathOf(subpath:string) => string`

## Métodos estáticos más útiles

- `Basedir.superiorPathOf(subpath:string) => string`
- `Basedir.splitPath(subpath:string) => string`

## Métodos menos útiles pero disponibles

- `Basedir.removePathSymbols(subpath:string)`
- `Basedir.appendPathSeparator(subpath:string)`