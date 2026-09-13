# Herencia con la API ClassSkiller de Std

## Índice

- [Herencia con la API ClassSkiller de Std](#herencia-con-la-api-classskiller-de-std)
  - [Índice](#índice)
  - [Ventajas](#ventajas)
  - [Uso](#uso)

## Ventajas

- Herencia 100% horizontal con `interfaces`
   - Una interfaz puede absorver a otra interfaz
- Herencia 100% modulable
   - Una interfaz puede dividirse en partes con forma de interfaces gracias a `mixInterface`
- Seguro 100% con revisión automática de colisión de nombres
   - Permite sobreescribir espacios de nombres pero solo expresamente con `overridables`

## Uso

```js
const CanFilesystem = ClassSkiller.mixInterfaces([
    CanReadFile,
    CanReadDirectory,
    CanWriteFile,
    CanWriteDirectory,
    CanDeleteFile,
    CanDeleteDirectory,
    CanCopyFile,
    CanCopyDirectory,
    CanExists,
    CanExistsFile,
    CanExistsDirectory,
]);
const CanAuthorization = ClassSkiller.mixInterfaces([
    ClassSkiller.mixInterfaces([
        CanLogin,
        CanLogout,
        CanRenewSession,
        CanRegister,
        CanUnregister,
        CanConfirmEmail,
        CanSendRecoveryEmail,
        CanRecoverAccount,
    ]),
    ClassSkiller.mixInterfaces([
        CanAuthenticate,
        CanAuthorizate,
        CanIsUser,
        CanIsInGroup,
        CanHasPermission,
        CanIsAuthorizedTo,
    ]),
]);

class Files {
    static {
        ClassSkiller.addInterfaces(this, [
            CanFilesystem,
        ]);
    }
}
```