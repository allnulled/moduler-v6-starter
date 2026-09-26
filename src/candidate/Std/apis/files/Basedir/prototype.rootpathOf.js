function rootpathOf (subpath) {
  const normalized = this.resolvePath([subpath], "rootdirOf");
  const rootdirSeparated = this.constructor.appendPathSeparator(this.rootdir);
  if(normalized.startsWith(rootdirSeparated)) {
    return normalized.replace(rootdirSeparated, "@/");
  }
  return normalized;
}