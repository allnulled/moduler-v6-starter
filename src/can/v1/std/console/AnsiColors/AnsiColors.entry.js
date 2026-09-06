module.exports = (mod => {
  if (typeof window !== "undefined") window.AnsiColorsMv6 = mod;
  if (typeof global !== "undefined") global.AnsiColorsMv6 = mod;
  return mod;
})($compiler.inject.source("./AnsiColors.class.js"));