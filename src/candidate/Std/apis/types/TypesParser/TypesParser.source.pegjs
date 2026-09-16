Types_script = ast:Evaluable { return ast }

Evaluable = 
  body:Prevaluable_2
  appendix:Type_appendixes*
    { return { ...body, grammar:"evaluable type", appendix: appendix?.length && appendix || undefined } }

Prevaluable_2 = 
  negation:Type_negation?
  core:Prevaluable
  parameters:Type_parameters?
  modifiers:Type_modifiers?
    { return { grammar:"evaluable type", negation: negation || undefined, core: core || undefined, parameters: parameters || undefined, modifiers: modifiers || undefined } }

Prevaluable = Type_group / Type_atom / Type_object / Type_array

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
  k:Property_name _ optional:"?"? _ ":" _
  property:Evaluable
    { return [k,{grammar: "object property",optional,property}] }
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

Question_mark = _ "?" { return "?" }

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

Property_chars = [A-Za-z_$] [A-Za-z0-9_$]* { return text() }

Variable_name = Unforbidden_tokens { return text() }

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
  / "//"
  / "\n" {}

_ = one_space*
one_space = __ / ___ / Comments
__ = "\t" / " "
New_line = ___
___ = "\r\n" / "\r" / "\n"