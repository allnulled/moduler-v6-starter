static addInterfaces (base, others) {
  for(let index=0; index<others.length; index++) {
    const other = others[index];
    this.addInterface(base, other);
  }
  return base;
}