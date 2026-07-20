# moduler-v6-starter

Boilerplate para proyectos basados en ModulerV6, CompilerV6 y DevBinaryV6.

## Instalar devbin

Tienes que bajarte [moduler-v6](https://github.com/allnulled/moduler-v6) e instalar el `bin.devbin` del `package.json` con `npm link`:

```sh
git clone https://github.com/allnulled/moduler-v6.git .
npm install
npm link
# Y aquí ya existe devbin:
devbin help --all
```

Alternativamente, puedes hacer `git clone+npm install` y en vez de `devbin` usar el `./dev/run.js` del proyecto para correr los comandos sin instalar `devbin` globalmente.

## Instalar el starter

Aparte de `git clone` + `npm install`, con el `devbin` puedes empezar un proyecto vació con:

```sh
npm init -y
devbin ensure core --reset --from .
npm install
```

## El objetivo

Automatizar el desarrollo de JavaScript modular en *devtime* y *runtime*.

## La estrategia

Principalmente se trata de:

1. Extender tú mismo los comandos de línea de comandos del `devbin`:
   - Añadiendo directorios que contengan `command.js`
   - Si está en `dev/bin/some/tool/command.js` el comando es `devbin some tool`
   - Los parámetros empiezan siempre con `--` o `-`, ej: `--algun-parametro` o `-abreviado`
2. Aprovechar los comandos sombra que tiene el `devbin`:
   - [`loop`](https://github.com/allnulled/moduler-v6/blob/main/src/DevBinaryV6/ShadowCommands/prototype.loop.js) inicia el loop de desarrollo del `DevBinaryV6`
      - La [Guía del loop de DevBinaryV6](https://github.com/allnulled/moduler-v6/blob/main/guides/Gu%C3%ADa%20del%20loop%20de%20DevBinaryV6.md) lo profundiza.
   - [`ensure core`](https://github.com/allnulled/moduler-v6/blob/main/src/DevBinaryV6/ShadowCommands/prototype.ensure%20core.js)
      - La [Guía rápida de moduler-v6-starter](https://github.com/allnulled/moduler-v6/blob/main/guides/Gu%C3%ADa%20r%C3%A1pida%20del%20moduler-v6-starter.md) lo profundiza.
   - [`new project`](https://github.com/allnulled/moduler-v6/blob/main/src/DevBinaryV6/ShadowCommands/prototype.new%20project.js) lo mismo que `ensure core`
   - [`print root`](https://github.com/allnulled/moduler-v6/blob/main/src/DevBinaryV6/ShadowCommands/prototype.print%20root.js)
   - [`touch`](https://github.com/allnulled/moduler-v6/blob/main/src/DevBinaryV6/ShadowCommands/prototype.touch.js) es la acción que hace el `loop` cuando guardas 1 fichero del `src/**/*`
      - La [Guía del loop de DevBinaryV6](https://github.com/allnulled/moduler-v6/blob/main/guides/Gu%C3%ADa%20del%20loop%20de%20DevBinaryV6.md) explica esto, básicamente.

## Profundización

Si quieres profundizar en cómo funciona, puedes mirar la [Guía rápida de moduler-v6-starter](https://github.com/allnulled/moduler-v6/blob/main/guides/Gu%C3%ADa%20r%C3%A1pida%20del%20moduler-v6-starter.md), que habla un poco más sobre la intención de cómo usarlo.

Además, tienes otras guías [aquí](https://github.com/allnulled/moduler-v6/tree/main/guides).