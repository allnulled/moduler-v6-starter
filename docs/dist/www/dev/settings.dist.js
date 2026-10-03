module.exports = $moduler.import([
  "@/dist/www/dev/settings/publicable.json",
], async function ([publicable]) {
  return {
    ...publicable,
  };
});