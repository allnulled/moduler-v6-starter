constructor (basedir = false) {
  this.basedir = basedir;
  $compiler.inject.source("./prototype.basedir.js")
}