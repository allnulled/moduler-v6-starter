Cosa 1:

IdbFilesystem.new => {
   async mount() => Std.classes.IdbFilesystem,
   async readFile('file' string) => 'content' string,
   async writeFile('file' string, 'content' string) => void,
   async deleteFile('file' string) => void,
   async hasFile('file' string) => void,
   async readDirectory('dir' string) => void,
   async writeDirectory('dir' string) => void,
   async deleteDirectory('dir' string) => void,
   async hasDirectory('dir' string) => void,
   async copyFile('src' string, 'dst' string) => void,
   async copyDirectory('src' string, 'dst' string) => void,
   async moveFile('src' string, 'dst' string) => void,
   async moveDirectory('src' string, 'dst' string) => void
}

Cosa 2:

async IdbFilesystem.prototype.mount => void
async IdbFilesystem.prototype.readFile(string 'file') => void
async IdbFilesystem.prototype.writeFile(string 'file', string 'content') => string 'output'

Cosa 3: Poder escribir (en la documentación) las firmas de los métodos así:

async readFile(string 'file') => string 'content'
async writeFile(string 'file', string 'content') => void

----------------------------

Varias:

1. Las factory como:

async? nombre! ( parametros! ) => salida!

2. Las etiquetas delante siempre, o incluso en lugar de el tipo:

string
'src' string
'src'

3. Las propiedades como factories directamente:

{
   async install() => void,
   getName() => string 'nombre',
   getVersion() => string 'versión',
   setMessage() => boolean 'succcessfully',
}

4. Los valores por defecto, en cualquier parte:

'name' string = "Ron Hopkins"
'age' number = 0
'city' string = "Eleyecs"
{
   readFile: 'Std.Filesystem.prototype.readFile' async(string 'file') => string 'content' ¬ FileNotFoundError | PermissionsError | EncodingError,
   writeFile: async(string 'file', string 'content') => boolean 'success',
   deleteFile: async(string 'file') => boolean 'success',
}