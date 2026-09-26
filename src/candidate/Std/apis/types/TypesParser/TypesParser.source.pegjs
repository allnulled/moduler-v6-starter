Types_script = ast:Evaluable { return ast }

Evaluable = 
  body:Prevaluable_2
  appendix:Type_appendixes*
    { return { ...body, appendix: appendix?.length && appendix || undefined } }

Prevaluable_2 = 
  label:Type_label?
  negation:Type_negation?
  core:Prevaluable_1
  parameters:Type_parameters?
  modifiers:Type_modifiers?
  defaults:Type_defaults?
    { return { ...core, label: label || undefined, negation: negation || undefined, parameters: parameters || undefined, ...modifiers || undefined, defaults: defaults !== null ? defaults : undefined } }

Prevaluable_1 = Type_group / Type_factory / Type_atom / Type_object / Type_array

Type_factory = 
  token1:(_)
  isAsync:(("async"/"sync") _)?
  token2:("function" _)
  token3:("(" _)
  input:Type_array_items?
  token4:(_ ")" _ "=>" _)
  output:Evaluable
    { return { grammar: "factory type", input, output, synchrony: !isAsync ? undefined : isAsync[0] } }
  
Type_object =
  token1:(_ "{" _)
  props:Type_object_properties?
  token2:(_ "}")
    { return { grammar: "object type", properties: props || undefined } }

Type_array =
  token1:(_ "[" _)
  items:Type_array_items?
  token2:(_ "]")
    { return { grammar: "array type", items: items || undefined } }

Type_object_properties =
  p_1:Type_object_property_first
  p_n:Type_object_property_other*
    { return Object.fromEntries([p_1].concat(p_n || [])) }
Type_object_property_first = _
  k:Property_name _ optionalProperty:Optional_sign? _ ":" _
  property:Evaluable
    { return [k,{...property, optionalProperty}] }
Type_object_property_other = _ "," _
  prop:Type_object_property_first
    { return prop }

Type_array_items =
  p_1:Type_array_item_first
  p_n:Type_array_item_other*
    { return [p_1].concat(p_n || []) }
Type_array_item_first = _ v:Evaluable { return v }
Type_array_item_other = _ "," _ v:Evaluable { return v }

Property_name = Property_chars

Type_group = 
  token1:(_ "(" _)
  atom:Evaluable
  token3:(_ ")" _)
    { return atom }

Type_atom = 
  id:Type_identifier
    { return { grammar: "type id", id } }

Type_negation = _ "!" _ { return "!" }

Type_appendixes = And_or_appendix

Optional_sign = it:(_ "?")? { return it ? true : undefined }
Question_mark = _ "?" { return { optional: true } }

And_or_appendix = _
  operator:("&" / "|") _
  complement:Prevaluable_2
    { return { grammar: "type appendix", operator, complement }}

Type_identifier = _ Variable_name Variable_accessors*
    { return text().trim() }

Type_parameters =
  token1:(_ "(" _)
  list:Type_array_items?
  token3:(_ ")" _)
    { return list }

Type_modifiers = modifier:(Question_mark)
    { return modifier }

Type_label = _ "@" Type_identifier
    { return text().trim() }

Type_defaults = _ "=" _ Default_value

Default_value = Hardcoded_value / Type_identifier

Property_chars = [A-Za-z_$] [A-Za-z0-9_$]* { return text() }

Variable_name = Property_chars

// Variable_name = Unforbidden_tokens { return text() }

Variable_accessors = Variable_accessor_by_dot+

Variable_accessor_by_dot = "." name:Variable_name { return name }

Comments = Comment_oneline / Comment_multiline
Comment_oneline = __* "//" (!(___).)* {}
Comment_multiline = __* "/*" (!("*/").)* "*/" {}

Unforbidden_tokens = ((!Forbidden_tokens).)+ { return text() }
Forbidden_tokens = "("
  / ")"
  / "|"
  / "&"
  / "{"
  / "}"
  / ","
  / "."
  / "!"
  / ":"
  / "/*"
  / "["
  / "]"
  / "?"
  / "*"
  / "+"
  / "@"
  / "="
  / "//"
  / "\n" {}

_ = one_space*
one_space = __ / ___ / Comments
__ = "\t" / " "
New_line = ___
___ = "\r\n" / "\r" / "\n"

Hardcoded_value = json_value

json_value = json_object / json_array / json_string / json_number / json_true / json_false / json_null 
json_object = "{" json_space m:json_members? json_space "}" { return m }
json_members = m1:json_member mN:json_coma_member* { return {...m1, ...Object.assign({},...mN) } }
json_coma_member = json_space "," json_space m:json_member { return m }
json_member = key:(json_string/js_variable_name) json_space ":" json_space value:json_value { return {[key]: value}}
json_array = "[" json_space e:json_elements? json_space "]" { return e || [] }
json_elements = e1:json_value eN:json_coma_value* { return [e1, ...eN || []] }
json_coma_value = json_space "," json_space v:json_value { return v }
json_string = '"' t:json_string_char* '"'  { return t.join("") }
json_string_char = json_escape / [^"\\\u0000-\u001F]
json_escape = "\\" ( '"' / "\\" / "/" / "b" / "f" / "n" / "r" / "t" / "u" [0-9a-fA-F]{4})
json_number = "-"? json_integer json_fraction? json_exponent? { return parseFloat(text()) }
json_integer = "0" / [1-9] [0-9]* { return parseInt(text()) }
json_fraction = "." [0-9]+
json_exponent = [eE] [+-]? [0-9]+
json_true = "true" { return true }
json_false = "false" { return false }
json_null = "null" { return null }
js_variable_name = [A-Za-záéíóúàèìòù$_] [A-Za-z0-9áéíóúàèìòù$_]* { return text() }
json_space = [ \t\n\r]*