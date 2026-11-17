{
  InjectPlain: ["$" + "compiler.inject.plain(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject Plain", inner: token.inner, location: token.location };
  }],
  InjectSource: ["$" + "compiler.inject.source(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject Source", inner: token.inner, location: token.location };
  }],
  InjectString: ["$" + "compiler.inject.string(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject String", inner: token.inner, location: token.location };
  }],
  InjectTemplate: ["$" + "compiler.inject.template(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject Template", ...token, };
  }],
  InjectModule: ["$" + "compiler.inject.module(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject Module", ...token, };
  }],
  InjectModules: ["$" + "compiler.inject.modules(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject Modules", ...token, };
  }],
  InjectPlainModule: ["$" + "compiler.inject.plainModule(", this.Parser.symbols.PARENTHESYS_BALANCE, function (token) {
    return { syntax: "Inject Plain Module", inner: token.inner, location: token.location };
  }],
  ImportJs: ["$" + "moduler.import(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
    return { syntax: "Moduler Import", ...token, };
  }, {}],
  ExportJs: ["$" + "moduler.export(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
    return { syntax: "Moduler Export", ...token, };
  }, {}],
  //*
  // SectionGet: ["$" + "moduler.section.get(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Get", ...token, };
  // }, {}],
  // SectionSet: ["$" + "moduler.section.set(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Set", ...token, };
  // }, {}],
  // SectionOverwrite: ["$" + "moduler.section.overwrite(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Overwrite", ...token, };
  // }, {}],
  // SectionExpand: ["$" + "moduler.section.expand(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Expand", ...token, };
  // }, {}],
  // SectionFill: ["$" + "moduler.section.fill(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Fill", ...token, };
  // }, {}],
  // SectionHas: ["$" + "moduler.section.has(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Has", ...token, };
  // }, {}],
  // SectionInitialize: ["$" + "moduler.section.initialize(", this.ParserUtils.stringOrArrayOfStringsContinuation, function (token) {
  //   return { syntax: "Moduler Section Initialize", ...token, };
  // }, {}],
  //*/
  EmbeddedFormFieldOpener: ["/" + "*=¿", "*/", function (token) {
    return { syntax: "Embedded Form Field Opener", ...token, };
  }, {}],
  EmbeddedFormFieldCloser: ["/" + "*?*/", "", function (token) {
    return { syntax: "Embedded Form Field Closer", ...token, };
  }, {}],
  MultilineCommentValueInjection: ["/" + "*%=", "*/", function (token) {
    return { syntax: "Multiline Comment Value Injection", ...token, };
  }, { includeAppendix: ['"template"', "0", "() {}"] }],
  MultilineCommentCodeInjection: ["/" + "*%", "*/", function (token) {
    return { syntax: "Multiline Comment Code Injection", ...token, };
  }, { includeAppendix: ['"template"', "0", "() {}"] }],
  AtRequires: ["/" + "*@requires:", "*/", function (token) {
    return { syntax: "@Requires", ...token, };
  }],
  AtInjects: ["/" + "*@injects:", "*/", function (token) {
    return { syntax: "@Injects", inner: token.inner, location: token.location };
  }],

  // JavadocComment: ["/"+"**", "*/", function (token) {return { syntax: "Javadoc Comment", ...token, };}, {allowInside:true}],


  // Markdown related syntaxes:
  // MultilineMarkdownComment: ["/" + "**@:", "*/", function (token) {
  //   return { syntax: "Multiline Markdown Comment", ...token };
  // }],
  // NewParagraphMarkdownComment: ["/" + "//@@:", "\n", function (token) {
  //   return { syntax: "New Paragraph Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],
  // NewLineMarkdownComment: ["/" + "//@:", "\n", function (token) {
  //   return { syntax: "New Line Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],
  // PrecisedTabulationMarkdownComment: ["/" + "//@~", "\n", function (token) {
  //   return { syntax: "Precised Tabulation Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],
  // IncreasedTabulationMarkdownComment: ["/" + "//@+", "\n", function (token) {
  //   return { syntax: "Increased Tabulation Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],
  // DecreasedTabulationMarkdownComment: ["/" + "//@-", "\n", function (token) {
  //   return { syntax: "Decreased Tabulation Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],
  // InlineMarkdownComment: ["/" + "//@&:", "\n", function (token) {
  //   return { syntax: "Inline Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],
  // UnspacedInlineMarkdownComment: ["/" + "//@&&:", "\n", function (token) {
  //   return { syntax: "Unspaced Inline Markdown Comment", ...token };
  // }, { enderCanBeEOF: true }],

}