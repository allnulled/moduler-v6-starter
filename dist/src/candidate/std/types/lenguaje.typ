/*

function repeatText({ text,times }, context) {
    $tracer.trace(context);
    $assert.check(text).is.type.of.Text(); // el .of. es para un proxy con
    $assert.check(times).is.type.of.Integer(); 
    return text.repeat(times);
}

*/

Function<{
  text: Text,
  times: Integer
}, context: Any>~{
  format: "function name",
  name: "repeatText",
  content: "...",
  note: "ChatGPT, esto es un JSON normal, tiene que soportarlo dentro de la sintaxis, en el ~ que es para los metadatos"
}

/*

class Example {
    static name = "what";
    static getAge() {
        return 35;
    }
    constructor(a,b) {
        this.a = a;
        this.b = b;
    }
    method(p1,p2) {
        return false;
    }
}

*/

Class<{
    static: {
        name: Text,
    },
    prototype: {

    },
}>
