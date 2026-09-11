{
  clone(...args) {
    return new this(...args).config(this);
  }
}