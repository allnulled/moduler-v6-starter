module.exports = async function({ devbin }) {
  await devbin.utils.touchFile("@/src/www/app.entry.css");
}