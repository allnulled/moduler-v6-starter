class Domer{
  static {
    $moduler.toolkit.makeClass([
      Std.interfaces.InstantiableInterface,
    ], this);
  }
  static insertElementById(id) {
    return document.querySelector(`#${id}`) || (function() {
      const elem = document.createElement("div");
      elem.setAttribute("id", id);
      document.body.appendChild(elem);
      return elem;
    })();
    
  }
}