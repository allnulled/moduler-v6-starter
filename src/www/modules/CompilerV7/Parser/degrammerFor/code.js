{
  async detokenize({ token, state, index, compiler}) {
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    const compilation = await compiler.cloneForFile(state.input.file.path)._compileFile(targetFileBrute);
    const replacement = compilation.out.channel[state.memory.fileChannel].content;
    return { token, replacedBy: replacement };
  }
}