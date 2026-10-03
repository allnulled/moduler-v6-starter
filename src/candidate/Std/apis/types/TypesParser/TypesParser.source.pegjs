{
  /**
   * 
   * - [x] labels pueden ser evaluables
   * - [x] labels pueden ser propiedad y valor de objeto
   * - [ ] 
   * 
   **/
}

Types_script = _ ast:Evaluables? _ { return (ast && ast.length === 1) ? ast[0] : ast }

Evaluables = f:Evaluable_first n:Evaluable_others? (_ ";")? { return [f, ...(n || [])] }

Evaluable_first = e:Evaluable { return e }

Evaluable_others = Evaluable_other+

Evaluable_other = 
  token1:(_ ";" _)
  e:Evaluable_first
    { return e; }

Evaluable = 
  body:Prevaluable_2
  appendix:Type_appendixes*
    { return { ...body, appendix: appendix?.length && appendix || undefined } }

Prevaluable_2 = Prevaluable_2_as_label / Prevaluable_2_as_type

Prevaluable_2_as_label = 
  label:Type_label?
  negation:Type_negation?
  core:Prevaluable_1
  parameters:Type_parameters?
  defaults:Type_defaults?
    { return { ...core, label: label || undefined, negation: negation || undefined, parameters: parameters || undefined, defaults: defaults !== null ? defaults : undefined } }

Prevaluable_2_as_type = 
  negation:Type_negation?
  label:Type_label
    { return { label: label || undefined, negation: negation || undefined } }

Prevaluable_1 = Type_group / Type_factory / Type_atom / Type_object / Type_array

Type_factory = 
  token1:(_)
  isAsync:(("async"/"sync") _)?
  token2:("function" _)
  token3:("(" _)
  input:Type_array_items?
  token4:(_ ")" _)
  throwables:Throwables?
  token5:(_ "=>" _)
  output:Evaluable
    { return { grammar: "factory type", input, output, throwables: throwables || undefined, synchrony: !isAsync ? undefined : isAsync[0] } }

Throwables = Throwable+

Throwable = 
  token1:(_ "~>" _)
  v:Evaluable
    { return v }

Type_object =
  token1:(_ "{" _)
  props:Type_object_properties?
  token2:(_ "}")
    { return { grammar: "object type", properties: props || [] } }

Type_array =
  token1:(_ "[" _)
  items:Type_array_items?
  token2:(_ "]")
    { return { grammar: "array type", items: items || [] } }

Type_object_properties =
  p_1:Type_object_property_first
  p_n:Type_object_property_other*
    { return Object.fromEntries([p_1].concat(p_n || [])) }

Type_object_property_first = Type_object_property_as_label / Type_object_property_as_key_value

Type_object_property_as_label = 
  label:Type_label
  optional:Optional_sign?
    { return [label,{label, optional}] }
Type_object_property_as_key_value = _
  k:Property_name _
  optional:Optional_sign? _ ":" _
  property:Evaluable
    { return [k,{...property, optional}] }
Type_object_property_other = _ "," _
  prop:Type_object_property_first
    { return prop }

Type_array_items =
  p_1:Type_array_item_first
  p_n:Type_array_item_other*
    { return [p_1].concat(p_n || []) }

Type_array_item_first = Type_array_item_as_spread_operation / Type_array_item_as_evaluable

Type_array_item_as_evaluable = _
  e:Evaluable
    { return e }
Type_array_item_as_spread_operation =
  token1:(_ "..")
  spread:( Evaluable )
  multiplier:Multiplier_symbol?
    { return { type: "spread on array", spread, multiplier } }

Type_array_item_other = _ "," _ v:Type_array_item_first { return v }

Multiplier_symbol = "?" / "*" / "+"

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

Type_identifier = _ expr:Variable_expression { return expr }

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

Variable_expression = Variable_name Variable_accessors* { return text() }

Variable_name = Property_chars / Singlequoted_expression

// Variable_name = Unforbidden_tokens { return text() }

Singlequoted_expression = "'" chars:Singlequoted_token* "'"
  { return chars.join(""); }

Singlequoted_token = Singlequoted_char / Singlequoted_escaped_char
Singlequoted_escaped_char = "\\" char:. { return char }
Singlequoted_char = [^'\\\n\r] 

Variable_accessors = Variable_accessor_by_dot+

Variable_accessor_by_dot = "." name:Variable_name { return name }

Comment = Comment_oneline / Comment_multiline
Comment_oneline = "//" (!(___/EOF).)* {}
Comment_multiline = "/*" (!("*/").)* "*/" {}

EOF = !.

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
  / "'"
  / '"'
  / '*'
  / "//"
  / "~>"
  / "\n" {}

_ = one_space*
one_space = __ / ___ / Comment
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