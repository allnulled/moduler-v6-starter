{

}

Types_script= _ ast:Evaluables? _ {return { grammar: "script", ast: ast }; }

Evaluables= first:Evaluable rest:Evaluable_other* ";"? {return [first, ...rest].filter(it => it !== null);}

Evaluable_other= _ ";" _ value:Evaluable {return value;}


// ------------------------------------------------------------
// 1. EXPRESIONES
// ------------------------------------------------------------

Evaluable=Labeled_evaluable/Or

Labeled_evaluable= 
  token1:_
  label:Type_label
  token2:_
  core:Or
    { return Object.assign(core, {label}); }
Or= left:And right:Or_right* {return right.length? { grammar: "or operation", left, right }: left;}
Or_right= _ "|" _ right:And {return right;}
And= left:Unary right:And_right* {return right.length? { grammar: "and operation", left, right }: left;}
And_right= _ "&" _ right:Unary {return right;}
Unary= negation:Type_negation? value:Type_expression {return negation? { ...value, negation }: value;}

// ------------------------------------------------------------
// 2. TYPE EXPRESSION
// ------------------------------------------------------------

Type_expression= Type_expression_as_labeled_name / Type_expression_as_label / Type_expression_as_name

Type_expression_as_labeled_name = 
  label:Type_label _
  type:Primary _
  parameters:Type_parameters?
  defaults:Type_defaults? 
    {
      return Object.assign(type, {
        label,
        parameters: parameters || undefined,
        defaults: defaults !== null ? defaults : undefined
      });
    }

Type_expression_as_label = 
  label:Type_label _
  parameters:Type_parameters?
  defaults:Type_defaults?
    {
      return Object.assign({ grammar: "type label" }, {
        label,
        parameters: parameters || undefined,
        defaults: defaults !== null ? defaults : undefined
      });
    }

Type_expression_as_name =
  type:Primary
  parameters:Type_parameters?
  defaults:Type_defaults?
    {
      return Object.assign(type, {
        parameters: parameters || undefined,
        defaults: defaults !== null ? defaults : undefined
      });
    }

// ------------------------------------------------------------
// 3. PRIMARY
// ------------------------------------------------------------

Primary = Type_group / Type_factory / Type_object / Type_class / Type_array / Type_import / Type_identifier

// ------------------------------------------------------------
// 4. GROUP
// ------------------------------------------------------------

Type_group = _ "(" _ value:Evaluable _ ")" _ { return value; }

// ------------------------------------------------------------
// 5. FACTORY
// ------------------------------------------------------------

Type_factory = _
  synchrony:(("async" / "sync") _)?
  token1:("function" _ "(" _)
  input:Type_array_items? ")" _
  throwables:Throwables? "=>" _
  output:Evaluable { return { grammar: "factory type", input, output, throwables, synchrony: synchrony && synchrony.length ? synchrony[0] : true }; }

Throwables = first:Throwable rest:Throwable* { return [first, ...rest]; }

Throwable = _ "~>" _ value:Evaluable { return value; }


// ------------------------------------------------------------
// 6. OBJECT
// ------------------------------------------------------------

Type_class = _ "class" _ content:Type_object { return Object.assign(content, {grammar:"class type"}) }

Type_object = _ "{" _ properties:Type_object_properties? _ "}" { return { grammar: "object type", properties: properties || {} }; }

Type_object_properties = first:Type_object_property rest:Type_object_property_other* { return Object.fromEntries([first, ...rest]); }

Type_object_property_other = _ "," _ property:Type_object_property { return property; }

Type_object_property = Object_property_as_name / Object_property_as_label
  
Object_property_as_name =
  name:Property_name
  optional:Optional_sign? _ ":" _
  value:Evaluable { return [ name, { ...value, optional: optional || undefined } ]; }

Object_property_as_label =
  label:Type_label
  optional:Optional_sign? { return [ label, { grammar: "type label", label, optional: optional || undefined } ]; }


// ------------------------------------------------------------
// 7. ARRAY
// ------------------------------------------------------------

Type_array = _ "[" _ items:Type_array_items? _ "]" { return { grammar: "array type", items: items || [] }; }

Type_array_items = first:Type_array_item rest:Type_array_item_other* { return [first, ...rest]; }

Type_array_item_other = _ "," _ item:Type_array_item { return item; }

Type_array_item = Spreaded_evaluable / Multiplicable

Spreaded_evaluable = _ "..." _
  list:Spreadable
  multiplier:Multiplier_symbol?
    { return { grammar: "spreaded list", list, multiplier }; }

Multiplier_symbol = "?" / "*" / "+"

Spreadable = Type_array / Type_label

Multiplicable =
  e:Evaluable _
  multiplier:Multiplier_symbol?
    { return { ...e, multiplier: multiplier || undefined } }

// ------------------------------------------------------------
// 8. IDENTIFIERS
// ------------------------------------------------------------

Type_identifier = _ id:Variable_expression { return { grammar: "type id", id }; }
Type_negation = _ "!" _ { return "!"; }
Type_label = _ "@" id:Variable_expression { return id;}

// ------------------------------------------------------------
// 9. PARAMETERS / DEFAULTS
// ------------------------------------------------------------

Type_parameters = _ "(" _ parameters:Type_array_items? _ ")" { return parameters; }
Type_defaults = _ "=" _ value:Default_value { return value; }
Default_value = Hardcoded_value / Type_identifier

// ------------------------------------------------------------
// 10. VARIABLES
// ------------------------------------------------------------

Property_name = Property_chars / json_string
Property_chars = [A-Za-z_$] [A-Za-z0-9_$]* { return text(); }
Variable_expression = Variable_name Variable_accessor_by_dot* { return text(); }
Variable_name = Property_chars / Singlequoted_expression
Variable_accessor_by_dot = "." Variable_name

// ------------------------------------------------------------
// 11. OPTIONAL / STRINGS
// ------------------------------------------------------------

Optional_sign = _ "?" { return true; }
Singlequoted_expression = "'" chars:Singlequoted_token* "'" { return chars.join(""); }
Singlequoted_token = Singlequoted_char / Singlequoted_escaped_char
Singlequoted_escaped_char = "\\" char:. { return char; }
Singlequoted_char = [^'\\\n\r]

// ------------------------------------------------------------
// 12. WHITESPACE / COMMENTS
// ------------------------------------------------------------

_ = (one_space)*
one_space = __ / ___ / Comment
__ = "\t" / " "
___ = "\r\n" / "\r" / "\n"
Comment = Comment_oneline / Comment_multiline
Comment_oneline = "//" (!(___ / EOF) .)*
Comment_multiline = "/*" (!"*/" .)* "*/"
EOF = !.

// ------------------------------------------------------------
// 13. IMPORT
// ------------------------------------------------------------

Type_import = "^" resource:("file:"/"url:"/"path:")? target:json_string
  { return { grammar: "import", resource: resource ? resource.slice(0,-1) : resource, target } }

// ------------------------------------------------------------
// 14. JSON
// ------------------------------------------------------------

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