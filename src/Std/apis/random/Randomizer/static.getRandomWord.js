static getRandomWord (syllabusBrute = 2) {
  const syllabus = syllabusBrute > 0 ? syllabusBrute : parseInt(this.getRandomItemFrom("11111112222222222223333333444455".split("")));
  let counter = 0;
  let out = "";
  while(counter < syllabus) {
    out += this.getRandomSyllabus(-5);
    counter++;
  }
  return out;
}