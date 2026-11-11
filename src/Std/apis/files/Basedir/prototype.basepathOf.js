function basepathOf(subpath) {
  const normalized = this.resolvePath([subpath], "basedirOf");
  const basedirSeparated = this.constructor.appendPathSeparator(this.basedir);
  if (normalized.startsWith(basedirSeparated)) {
    return normalized.replace(basedirSeparated, "./");
  }
  return normalized;
}