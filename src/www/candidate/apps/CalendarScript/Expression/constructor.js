constructor(textOrObject) {
  if (typeof textOrObject === "string") this.text = textOrObject;
  else if (typeof textOrObject === "object") this.data = textOrObject;
}