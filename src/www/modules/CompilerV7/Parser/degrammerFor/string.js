{
  async detokenize({ token, state, index, compiler}) {
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    const content = await compiler.moduler.cloneForFile(state.input.file.path)._readPath(targetFileBrute);
    const replacement = JSON.stringify(content);
    return { token, replacedBy: replacement };
  }
}