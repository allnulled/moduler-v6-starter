deleteFile = Object.assign(file => {
  return this._deleteFile({ file });
}, {
  onlyTry: (...args) => this._deleteFile.onlyTry(...args),
});