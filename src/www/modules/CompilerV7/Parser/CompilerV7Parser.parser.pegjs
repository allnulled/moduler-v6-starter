{
  const tokens = [];
  const getLocation = function(loc) {
  	return [loc.start.offset,loc.end.offset];
  };
  const getTokens = function(txt) {
    const result = [];
    Expand_tokens: {
        break Expand_tokens;
        for(let index=0; index<tokens.length; index++) {
            const token = tokens[index];
            Object.assign(token, {
                innerText: txt.slice(...token.innerLocation),
                outerText: txt.slice(...token.outerLocation),
                expressionText: txt.slice(...token.expressionLocation),
            });
        }
    }
    Fulfill_with_plain_text_tokens: {
        let textIndex = 0;
        for(let index=0; index<tokens.length; index++) {
            const token = tokens[index];
            const [start, end] = token.outerLocation;
            if (start > textIndex) {
                result.push({
                    grammar: "plain",
                    outerLocation: [textIndex, start],
                });
            }
            result.push(token);
            textIndex = end;
        }
        if(tokens.length === 0) {
            result.push({
                grammar: "plain",
                outerLocation: [0, txt.length],
            });
        } else if (textIndex < txt.length) {
            result.push({
                grammar: "plain",
                outerLocation: [textIndex, txt.length],
            });
        }
    }
    return result;
  };
}
cv7_main_language = cv7_main_expressions { return getTokens(text()) }
cv7_main_expressions = cv7_main_expression*
cv7_main_expression = cv7_valid_main_expression / cv7_ignored_char

cv7_templates_language = cv7_templates_expressions { return getTokens(text()) }
cv7_templates_expressions = cv7_templates_expression*
cv7_templates_expression = cv7_valid_template_expression / cv7_ignored_char

cv7_forms_language = cv7_forms_expressions { return getTokens(text()) }
cv7_forms_expressions = cv7_forms_expression*
cv7_forms_expression = cv7_valid_forms_expression / cv7_ignored_char

cv7_ignored_char = .

cv7_valid_forms_expression = it:cv7_expression_for_forms { tokens.push(it); return it; }
cv7_valid_template_expression = it:cv7_expression_for_templates { tokens.push(it); return it; }
cv7_valid_main_expression = it:cv7_expression_for_main { tokens.push(it); return it; }

cv7_expression_for_main = cv7_basic_expression_commented / cv7_basic_expression_uncommented

cv7_basic_expression_commented = 
	token1:("/*")
    exp:cv7_basic_expression_uncommented
    closer:("*/")
    	{ return Object.assign(exp, { outerLocation: getLocation(location()) }) }
cv7_basic_expression_uncommented = exp:cv7_basic_expression { return exp }
cv7_basic_expression =
	grammar:"$compiler.inject"
    channel:cv7_particle_to_output?
    action:cv7_particle_inject_object
    closer:cv7_close_parenthesys
    	{
        	const loc = location();
            const expressionLocation = getLocation(loc);
        	return {
            	grammar: "inject",
                operation: action.name,
                channel: channel || null,
                outerLocation: expressionLocation,
                expressionLocation: [...expressionLocation],
                innerLocation: [action.end, loc.end.offset-1]
			};
		}

cv7_expression_for_templates = cv7_expression_for_template_value / cv7_expression_for_template_block
cv7_template_opener_1 = "/*%="
cv7_template_closer_1 = ("%")? "*/" { return text() }
cv7_template_opener_2 = "/*%"
cv7_template_closer_2 = ("%")? "*/" { return text() }
cv7_expression_for_template_value = 
    token1:cv7_template_opener_1
    content:((!cv7_template_closer_1).)+
    tokenZ:cv7_template_closer_1
        {
            const loc = getLocation(location());
            return {
                grammar: "template",
                operation: "value",
                outerLocation: loc,
                innerLocation: [loc[0] + token1.length, loc[1] - tokenZ.length],
            };
        }
cv7_expression_for_template_block = 
    token1:cv7_template_opener_2
    content:((!cv7_template_closer_2).)+
    tokenZ:cv7_template_closer_2
        {
            const loc = getLocation(location());
            return {
                grammar: "template",
                operation: "block",
                outerLocation: loc,
                innerLocation: [loc[0] + token1.length, loc[1] - tokenZ.length],
            };
        }

cv7_form_opener_1 = "/*=¿"
cv7_form_closer_1 = "/*?*/"
cv7_expression_for_forms = cv7_expression_for_forms_control
cv7_expression_for_forms_control =
    token1:cv7_form_opener_1
    content:(!(cv7_form_closer_1).)+
    tokenZ:cv7_form_closer_1
        {
            const loc = getLocation(location());
            return {
                grammar: "form",
                operation: "control",
                outerLocation: loc,
                innerLocation: [loc[0] + token1.length, loc[1] - tokenZ.length],
            };
        } 

cv7_particle_to_output = ".to." channel:cv7_js_varname { return channel }
cv7_particle_inject_object = 
	token1:"."
    action:cv7_particle_inject_object_option
    	{ return action }
cv7_close_parenthesys = ")" / cv7_inner_parenthesys / . cv7_close_parenthesys {}
cv7_inner_parenthesys = "(" cv7_close_parenthesys {}
cv7_particle_inject_object_option = (
    "code(" /
    "string(" /
    "plain(" /
    "template(" /
    "action(" )
    	{ return { name: text().slice(0,-1), end: location().end.offset } }
cv7_js_varname = [A-Za-z$_] [A-Za-z0-9$_]* { return text(); }
/*
_ = __+
__ = " " / "\t" / "\r\n" / "\r" / "\n"
*/