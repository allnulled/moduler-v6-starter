{
  async detokenize({ token, state, index, compiler}) {
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    let replacement = "";
    let templateSource = null;
    Step_1_renderizar_plantilla: {
      const subcompiler = compiler.cloneForFile(state.input.file.path);
      const targetFile = subcompiler.moduler.normalizationOf(targetFileBrute);
      const templateCompilation = await subcompiler._compileTemplateFile(targetFile);
      Atencion_solo_se_transmite_el_canal_activo_original: {
        Std.classes.Printer.json("templateCompilation", state.input.file.path, templateCompilation);
        templateSource = templateCompilation.out.channel[state.memory.fileChannel].content;
      }
      const compilation = await subcompiler._compileSource(templateSource, state.input.file.path);
      replacement = compilation.out.channel[state.memory.fileChannel].content;
    }
    return { token, replacedBy: replacement };
  }
}