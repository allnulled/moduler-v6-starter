const treeToBox = function (text) {
  const lines = text.split("\n");
  const nodes = [];
  const stack = [];
  const counters = [];
  // ------------------------------------------------------------
  // 1. Parseo
  // ------------------------------------------------------------
  let lastNode;
  for (const line of lines) {
    let indentation = 0;
    while (indentation < line.length && /\s/.test(line[indentation])) {
      indentation++;
    }
    if (line[indentation] === "+") {
      const level = indentation + 1;
      const node = {
        text: line.slice(indentation + 1).trim(),
        level,
        lines: [],
        last: true,
        children: false,
      };
      nodes.push(node);
      // El nodo anterior con el mismo nivel deja de ser el último.
      if (stack[level]) {
        stack[level].last = false;
      }
      // Si el nodo anterior está por encima de este nivel,
      // entonces este nodo es hijo suyo.
      if (lastNode && level > lastNode.level) {
        lastNode.children = true;
      }
      stack.length = level + 1;
      stack[level] = node;
      lastNode = node;
    } else if (lastNode) {
      lastNode.lines.push(
        line.slice(Math.min(lastNode.level, line.length))
      );
    }
  }
  // ------------------------------------------------------------
  // 2. Render
  // ------------------------------------------------------------
  let output = "";
  const ancestors = [];
  Iterating_nodes:
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (index === 0) {
      output += `┌{ # ${node.text} }───────···`;
      for (const line of node.lines) {
        output += `\n   ${line}`;
      }
      ancestors.length = 0;
      ancestors.push(node);
      continue Iterating_nodes;
    }
    // ------------------------------------------------------------
    // 2.1. Ajustar antecesores al nivel actual
    // ------------------------------------------------------------
    ancestors.length = node.level;
    let prefix = "";
    for (const ancestor of ancestors) {
      prefix += ancestor.last ? " " : "│";
    }
    // ------------------------------------------------------------
    // 2.2. Numeración
    // ------------------------------------------------------------
    counters.length = node.level;
    counters[node.level - 1] = (counters[node.level - 1] || 0) + 1;
    const ordinal = counters.slice(0, node.level).join(".");
    // ------------------------------------------------------------
    // 2.3. Rama
    // ------------------------------------------------------------
    const branch = node.children ? node.last ? "└┬" : "├┬" : node.last ? "└─" : "├─";
    output += `\n${prefix}${branch}{ ${ordinal} } ${node.text}`;
    // ------------------------------------------------------------
    // 2.4. Texto asociado
    // ------------------------------------------------------------
    for (const line of node.lines) {
      output += `\n${prefix}${node.last ? " " : "│"}  ${line}`;
    }
    ancestors[node.level] = node;
  }

  return output;
};

module.exports = async function ({ devbin, parameters }) {
  parameters.out = parameters.out.replace(/\.json$/g, ".out.md");
  const normalized = {
    command: parameters.command.join("/"),
    in: devbin.moduler.normalizationOf(parameters.in),
    out: devbin.moduler.normalizationOf(parameters.out),
  };

  Validacion: {
    Resuelve_fichero_del_in: {
      if (!await devbin.files.hasFile(normalized.in)) {
        if (!await devbin.files.hasFile(`@/dev/filecom/${normalized.command}/in/${parameters.in}`)) {
          throw new Error(`Required parameter «--in» to match to an existing fullpath, rootedpath or local «@/dev/filecom/{command}/in/{input}» filename but none of them was matched by «${parameters.in}» on «devbin filecom -c "${normalized.command}"»`);
        }
        normalized.in = devbin.moduler.normalizationOf(`@/dev/filecom/${normalized.command}/in/${parameters.in}`);
      }
    }
    Resuelve_fichero_del_out: {
      if (!await devbin.files.hasFile(normalized.out)) {
        // Esto estaba pero no parece que debería porque empalma las rutas
        break Resuelve_fichero_del_out;
        normalized.out = devbin.moduler.normalizationOf(`@/dev/filecom/${normalized.command}/out/${parameters.out}`);
      }
    }
  }

  //////////////////////////////

  Comando: {
    let output;
    let input, fs;
    Importacion: {
      fs = require("fs");
      input = await fs.promises.readFile(normalized.in, "utf8");
    }
    Generacion: {
      output = treeToBox(input);
    }
    Exportacion: {
      console.log(`[*] DevBinaryV6 is saving schema circuit from tree at:`);
      devbin.console.setProfile("green").print(`   - ${devbin.moduler.rootdirOf(normalized.out)}`);
      await fs.promises.writeFile(normalized.out, output, "utf8");
    }
  }
};