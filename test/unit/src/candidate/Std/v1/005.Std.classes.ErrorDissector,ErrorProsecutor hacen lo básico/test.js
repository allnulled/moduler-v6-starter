module.exports = async function ({ Std, devbin }) {
  const prosecuted = await Error.normalize("Uat?").prosecuted();
  console.log(prosecuted.std.dissection);
}