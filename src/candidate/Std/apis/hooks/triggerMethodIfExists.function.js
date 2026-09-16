function triggerMethodIfExists(base, method, args = [], scope = false) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodIn.js", {name:"Std.functions.triggerMethodIfExists"});
  let output = undefined;
  if(base && (typeof base[method] === "function")) {
    if(scope) return base[method].call(scope, ...args);
    output = base[method](...args);
  }
  $compiler.inject.template("@/src/candidate/Std/snippets/methodOut.js", {name:"Std.functions.triggerMethodIfExists"});
  return output;
}