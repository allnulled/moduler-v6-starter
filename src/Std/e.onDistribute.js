module.exports = function({ file, event, devbin }) {
  devbin.files.copyFile(event.distribution.js, `@/src/www/external/std/std-v1.entry.js`);
  devbin.files.copyFile(event.distribution.js, `@/dist/www/external/std/std-v1.dist.js`);
}