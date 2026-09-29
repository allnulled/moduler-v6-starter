# Std.classes.IdbFilesystem

## Definición

> Clase para gestionar instancias de sistema de ficheros basado en IndexedDB.

## Interfaces

- `Std.interfaces.InstantiableInterface`
- `Std.interfaces.TryableInterface`

## Propiedades

- `this.db = object`
- `this.crud = Std.classes.IdbCrud`

## Métodos prototipo más útiles

- `mount() = async Std.classes.IdbFilesystem`
   - sirve para iniciar la conexión con la base de datos de IndexedDB
   - necesario llamarse antes de empezar a usarla
- `readFile(@file string) => async @content string`
- `writeFile(@file string, content) => async void`
- `deleteFile(@file string) => async void`
- `hasFile(@file string) => async void`
- `readDirectory(@dir string) => async void`
- `writeDirectory(@dir string) => async void`
- `deleteDirectory(@dir string) => async void`
- `hasDirectory(@dir string) => async void`
- `copyFile(@src string, @dst string) => async void`
- `copyDirectory(@src string, @dst string) => async void`
- `moveFile(src, @dst string) => async void`
- `moveDirectory(src, @dst string) => async void`