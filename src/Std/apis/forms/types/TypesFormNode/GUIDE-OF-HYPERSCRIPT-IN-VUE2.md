# Guía del hyperscript en vue2

Guía rápida del hyperscript de vue2.

# Situación

- El hyperscript de vue2 hay que tenerlo muy claro para construir componentes fuli dinámicos.
- Y en TypesForm es necesario para optimizar el DOM, porque los componentes funcionales NO OBLIGAN a meter 1 elemento en el DOM por consumir 1 nivel en el Virtual DOM
   - no Shadow DOM, hoy me ha corregido, en Vue2 estamos explotando un Virtual DOM, el Shadow DOM es un estándar oficial de la W3 y está en todos los navegadores sin Vue ni nada especial.

# Firma en vue2 render function

```js
Vue.component("Whatever", {
    name: "Whatever",
    functional: true,
    render: function(h, context) {
        // Hablamos de esta función.
        return h("div", null, "Hola");
    }
})
```

## Parámetro 1: elemento o componente

- Opción 1: `string` con elemento HTML
   - `h("div")`
   - `h("p")`
- Opción 2: `Object` con componente vue2
   - `h(Vue.options.components.MyComponent)`
   - `h({ name: "Tal", template: "..." })`

## Parámetro 2: configuración del nodo

| Propiedad | Función |
|---|---|
| `class` | Clases CSS |
| `style` | Estilos |
| `attrs` | Atributos HTML |
| `props` | Propiedades de componentes Vue |
| `domProps` | Propiedades nativas del DOM |
| `on` | Eventos |
| `nativeOn` | Eventos nativos en componentes |
| `directives` | Directivas Vue |
| `key` | Identificador del nodo |
| `ref` | Referencia al nodo |
| `scopedSlots` | Slots con ámbito |
| `slot` | Nombre del slot de destino |

## Parámetro 3: hijos del nodo

- Opción 1: `[(VNode|string)*]`
   - Ejemplo:
   ```js
   h("div", null, [
       h("div"),
       h("div"),
       h("div"),
   ])
   ```
- Opción 2: `VNode`
   - Ejemplo:
   ```js
   h("div", null, h("div"))
   ```
- Opción 3: `String`
   - Ejemplo:
   ```js
   h("div", null, "Esto es texto")
   ```

# Bibliografía

- Documentación oficial de Vue2: 
   - https://v2.vuejs.org/v2/guide/render-function?utm_source=chatgpt.com