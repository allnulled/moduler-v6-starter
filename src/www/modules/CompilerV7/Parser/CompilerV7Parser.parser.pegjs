{
  const tokens = [];
  const getLocation = function(loc) {
  	return [loc.start.offset,loc.end.offset];
  };
  const getTokens = function(txt) {
  	return tokens;
  	tokens.forEach(token => {
    	Object.assign(token, {
        	innerText: txt.slice(...token.innerLocation),
            outerText: txt.slice(...token.outerLocation),
            expressionText: txt.slice(...token.expressionLocation),
        });
    });
    return tokens;
  };
}
cv7_language = cv7_expressions { return getTokens(text()) }
cv7_expressions = cv7_expression*
cv7_expression = cv7_valid_expression / cv7_ignored_char
cv7_ignored_char = .
cv7_valid_expression = cv7_valid_expression_commented / cv7_valid_expression_uncommented
cv7_valid_expression_commented = 
	token1:("/*" _*)
    exp:cv7_valid_expression_uncommented
    closer:(_* "*/")
    	{ return Object.assign(exp, { outerLocation: getLocation(location()) }) }
cv7_valid_expression_uncommented =
	exp:cv7_expression_1 { tokens.push(exp); return exp }
cv7_expression_1 =
	grammar:"$compiler.inject"
    channel:cv7_particle_to_output?
    action:cv7_particle_inject_object
    closer:cv7_close_parenthesys
    	{
        	const loc = location();
            const expressionLocation = getLocation(loc);
        	return {
            	grammar,
                operation: action.name,
                channel: channel || null,
                outerLocation: expressionLocation,
                expressionLocation: [...expressionLocation],
                innerLocation: [action.end, loc.end.offset-1]
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
_ = " " / "\t" / "\r\n" / "\r" / "\n"