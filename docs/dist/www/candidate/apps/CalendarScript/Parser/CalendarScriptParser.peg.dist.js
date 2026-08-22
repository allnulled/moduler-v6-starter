{
  
}
Inicio = json_value

json_value
  = json_object
  / json_array
  / json_string
  / json_number
  / json_true
  / json_false
  / json_null

json_object
  = "{"
    json_ws
    members:json_members?
    json_ws
    "}"
    { return members || {}; }

json_members
  = head:json_member tail:(json_ws "," json_ws json_member)* {
      var obj = {};
      obj[head[0]] = head[1];
      for (var i = 0; i < tail.length; i++) {
        obj[tail[i][3][0]] = tail[i][3][1];
      }
      return obj;
    }

json_member
  = key:json_string json_ws ":" json_ws value:json_value {
      return [key, value];
    }

json_array
  = "[" json_ws elements:json_elements? json_ws "]" {
      return elements || [];
    }

json_elements
  = head:json_value
    tail:(json_ws "," json_ws json_value)* {
      return [head].concat(tail.map(function (x) {
        return x[3];
      }));
    }

json_string
  = '"' chars:json_chars '"' {
      return chars.join("");
    }

json_chars
  = chars:(
      json_escape
      / json_unicode_escape
      / [^"\\\u0000-\u001F]
    )* {
      return chars;
    }

json_escape
  = "\\" c:[\\"\/bfnrt] {
      return {
        '"': '"',
        "\\": "\\",
        "/": "/",
        "b": "\b",
        "f": "\f",
        "n": "\n",
        "r": "\r",
        "t": "\t"
      }[c];
    }

json_unicode_escape
  = "\\u" h:json_hex_digit+ {
      return String.fromCharCode(parseInt(h, 16));
    }

json_number
  = sign:"-"?
    intg:json_integer
    frac:json_fraction?
    expo:json_exponent? {
      return parseInt((sign || "") + intg + (frac || "") + (expo || ""));
    }

json_integer
  = "0"
  / [1-9] [0-9]*

json_fraction
  = "." digits:[0-9]+ {
      return "." + digits.join("");
    }

json_exponent
  = e:[eE] sign:[+-]? digits:[0-9]+ {
      return e + (sign || "") + digits.join("");
    }

json_true
  = "true" { return true; }

json_false
  = "false" { return false; }

json_null
  = "null" { return null; }

json_hex_digit
  = [0-9a-fA-F]

json_ws
  = [ \t\n\r]*
Referencia_a_variable = "@"

