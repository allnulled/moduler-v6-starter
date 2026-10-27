static getRandomSyllabus (vocalsBrute = 0) {
  const vocals =
    vocalsBrute === 0 ? this.getRandomItemFrom([1,2]) :
    vocalsBrute > 0 ? vocalsBrute : 
    vocalsBrute < 0 ? (
      vocalsBrute === -1 ? this.getRandomItemFrom([1,1,2]) :
      vocalsBrute === -2 ? this.getRandomItemFrom([1,2,2]) :
      vocalsBrute === -3 ? this.getRandomItemFrom([1,1,1,2]) :
      vocalsBrute === -4 ? this.getRandomItemFrom([1,2,2,2]) : 
      this.getRandomItemFrom([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3])
    ) : "never";
    ;
  let out = "";
  out += this.getRandomConsonant(1);
  out += this.getRandomVocal(vocals);
  return out;
}