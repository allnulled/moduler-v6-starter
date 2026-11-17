{
  async detokenize({ token, state, index, compiler}) {
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    const replacement = await compiler.moduler.cloneForFile(state.input.file.path)._readPath(targetFileBrute);
    return { token, replacedBy: replacement };
  }
}