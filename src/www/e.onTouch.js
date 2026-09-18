module.exports = async function({ file, devbin }) {
  const compilation = await devbin.compiler.compile("@/src/www/index.html");
  // console.log(compilation);
  await compilation.toFile("@/dist/www/index.dist.html");
};