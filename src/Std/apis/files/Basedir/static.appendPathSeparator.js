function appendPathSeparator(subpath) {
  return subpath.replace(this.pathSymbols.REGEX_FOR_SLASH_AT_THE_END, "") + "/";
}