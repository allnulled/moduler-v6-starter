Std.classes.ViewsRegistry.$.set("LoremIpsum", {
  name: "LoremIpsum",
  template: $compiler.inject.string("@/src/candidate/Std/apis/views/development/LoremIpsum/LoremIpsum.view.html"),
  props: {
    paragraphs: {
      type: Number,
      default: 5,
    },
  },
  created() {
    let generatedParagraphs = [];
    for(let index=0; index<this.paragraphs; index++) {
      const paragraph = Std.classes.Randomizer.getRandomSentence(Std.classes.Randomizer.getRandomItemFrom([20,30,40,50,60,70,80,90,10,5]));
      generatedParagraphs.push(paragraph);
    }
    this.$locals = {
      generatedParagraphs,
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
});