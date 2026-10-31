function addStep(step) {
  $compiler.inject.template("@/src/candidate/Std/snippets/methodLog.js", {name:"Std.interfaces.ValidationStateInterface.prototype.addStep"});
  if(!this.steps) this.steps = [];
  this.steps.push(step);
}