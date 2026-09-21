module.exports = async function() {
  await Std.all.IndexeddbDatabase.create({});
};