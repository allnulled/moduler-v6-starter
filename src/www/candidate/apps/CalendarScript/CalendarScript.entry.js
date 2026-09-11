(function (mod) {
  if (typeof window !== 'undefined') window['CalendarScript'] = mod;
  if (typeof global !== 'undefined') global['CalendarScript'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function () {
  return class CalendarScript {
    /*@injects:"./static.AssertionError.js"*/
    /*@injects:"./static.assert.js"*/
    /*@injects:"./static.Parser.js"*/
    /*@injects:"./static.Expression.js"*/
  };
}.call());