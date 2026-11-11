class ObjectUtils {

  static fillProperties(base, filler) {
    $moduler.assert((typeof base === "object") && (base !== null), "Parameter «base» must be object and not null on «ObjectUtils.fillProperties»");
    $moduler.assert((typeof filler === "object") && (filler !== null), "Parameter «filler» must be object and not null on «ObjectUtils.fillProperties»");
    for(let prop in filler) {
      const shouldBeFilled = !(prop in base);
      if(shouldBeFilled) {
        base[prop] = filler;
      }
    }
    return base;
  }

}