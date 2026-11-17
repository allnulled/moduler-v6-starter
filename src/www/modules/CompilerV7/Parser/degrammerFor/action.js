{
  async detokenize({ token, state, index, compiler}) {
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    let replacement = "";
    Aqui_habria_otra_operacion_para_averiguar_el_replacement: {
      // const compilation = await compiler.cloneForFile(state.input.file.path)._compile(targetFileBrute);
      // const replacement = compilation.out.channel[state.memory.fileChannel].content;
    }
    return { token, replacedBy: replacement };
  }
}