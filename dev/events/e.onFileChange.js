module.exports = function({ file }) {
  return require(`${__dirname}/../bin.js`).utils.touchFile(file);
};