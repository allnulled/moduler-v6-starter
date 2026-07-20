{
  const errorsRegistry = [];
  const locationAbbr = function(it, subtype) {
  	return {type:subtype,from: it.start.offset, to: it.end.offset };
  };
  const checkMarkupCoherence = function(it) {
    if(!(it.header.text.startsWith(it.footer.text))) {
      const errorMessage = 'Header and footer do not match: footer «' + it.footer.text + '» with header «' + it.header.text + '»';
      errorsRegistry.push(errorMessage);
      it.erroneous = it.erroneous || [];
      it.erroneous.push(errorMessage);
    }
    return it;
  };
}
Language = ast:Block_of_tokens { return { fragment: locationAbbr(location(),"ast"), errors: errorsRegistry, ast, } }

Block_of_tokens = Unique_token*

Unique_token = Markup_entry / Normal_text

Markup_entry =
  header:Markup_header
  body:Markup_body
  footer:Markup_footer
    { return checkMarkupCoherence({ fragment: locationAbbr(location(), "markup:entry"), header, body, footer }) }

Markup_token0 = "/*@<" (!"/")
Markup_header = Markup_token0 content:Markup_header_content Markup_token1 { return { fragment: locationAbbr(location(), "markup:header"), text: content } }
Markup_header_content = (!(Markup_token1) .)+ { return text() }
Markup_token1 = ">*/"
Markup_body = (!Markup_token2) body:Block_of_tokens { return body }
Markup_token2 = "/*@</"
Markup_footer = Markup_token2 content:Markup_footer_content Markup_token3 { return { fragment: locationAbbr(location(), "markup:footer"), text: content } }
Markup_footer_content = (!(Markup_token3) .)* { return text() }
Markup_token3 = ">*/"

Normal_text = ((!("/*@<" ("/")?)) .)+ { return { fragment: locationAbbr(location(), "text:raw"), source: text(), } }