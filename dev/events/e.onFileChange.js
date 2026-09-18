module.exports = async function({ file, devbin }) {
  await require(`${__dirname}/../bin.js`).utils.touchFile("@/src/www/index.html");
};