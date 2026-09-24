↑←    = ┘
↑→    = └
↑↓    = │
←→    = ─
←↓    = ┐
→↓    = ┌
↑←→   = ┴
↑←↓   = ┤
↑→↓   = ├
←→↓   = ┬
↑←→↓  = ┼

└ arriba-derecha 
├ arriba-derecha-abajo
─ derecha

├─
└─

└─┐

┌[ Database ]───────···
├┬─· Errors API
│├─· Error.normalize
│├─· Error.normalize
│└─· Error.toObject
└──· Tester API


┌  ESTE EMPIEZA EL ESQUEMA

├  ESTE ES SUBSECCIÓN (NO FINAL)

└  ESTE ES SUBSECCIÓN (SÍ FINAL)

┐·  ESTE ES TÍTULO (NO FINAL)

└·  ESTE ES TÍTULO (SÍ FINAL)

|  ESTE ES SUPERSECCIÓN CONTINUANDO




Pues querría pasar de esto:

+ Database
 + Errors API
  + Error.normalize
  + Error.toObject
  + Error.tools.formatError
  + Error.tools.formatFrames
  + Error.tools.formatList
 + Tester API

A esto:

┌[ Database ]───────···
├┬· Errors API
│├─· Error.normalize
│├─· Error.toObject
│├─· Error.tools.formatError
│├─· Error.tools.formatFrames
│└─· Error.tools.formatList
└─· Tester API

Y tendría que poder hacerlo de forma recursiva, que si quisiera poner más elementos debajo de Error.normalize, que los cogiera bien.

Tú sabrías hacer una función js para hacer esto?