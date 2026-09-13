
- Cuando sí corresponde al directorio entero:
   - *.entry.js: el que importa
   - *.class.js: cuando el directorio corresponde a una clase
      - este conecta con el `splittable.<Clase>.class.js`
   - *.object.js: cuando el directorio corresponde a un objeto
   - *.function.js: cuando el directorio corresponde a una función
   - *.trait.js: cuando el directorio corresponde a un trait
      - un trait es un objeto normal, con propiedades, getters y setters
   - *.interface.js: cuando el directorio corresponde a un interfaz
      - una interface es un objeto con «static» y/o «prototype» solamente
   - *.fact.js: cuando el directorio corresponde a un fact
      - un fact es una immediatelly called function
   - *.part.js: cuando el directorio corresponde a un part
      - un part es un script parcial, de una función
- Cuando no corresponde al directorio entero:
   - prototype.*.js: cuando es un miembro prototipo
   - static.*.js: cuando es un miembro estático
   - class.*.js: cuando es una clase
   - function.*.js: cuando es una función
   - object.*.js: cuando es una función
   - trait.*.js: cuando es una función
   - interface.*.js: cuando es una función
   - fact.*.js: cuando es una función
   - part.*.js: cuando es una función
   - member.*.js: cuando es otro tipo de miembro
   - getter.*.js: cuando es un getter
   - setter.*.js: cuando es un setter

Std.object.js
objects/
functions/
classes/
traits/
interfaces/

prototype.member.events.js
prototype.function.on.js

EventListener.trait.js