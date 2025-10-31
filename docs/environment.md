# Configuración de entorno y credenciales (Google Sheets)

## 1) Habilitar API de Google Sheets
1. Crea un proyecto en Google Cloud Console.
2. Habilita "Google Sheets API" y (opcionalmente) "Google Drive API" si necesitas listar archivos.
3. Crea credenciales:
   - Opción A: Cuenta de servicio (recomendado para backend).
   - Opción B: OAuth Client (si habrá interacción del usuario con permisos de su cuenta).

Para empezar, usa Cuenta de Servicio y comparte la hoja con el email de la cuenta de servicio (permiso Editor).

## 2) Variables de entorno
Crea un archivo `.env` en la raíz cuando iniciemos el backend/webapp con las siguientes variables:

- `GOOGLE_SHEETS_PROJECT_ID=`
- `GOOGLE_SHEETS_CLIENT_EMAIL=`
- `GOOGLE_SHEETS_PRIVATE_KEY=` (escapar saltos de línea como `\n`)
- `GOOGLE_SHEETS_SPREADSHEET_ID=` (ID del documento principal)
- `DISCORD_WEBHOOK_URL=` (para notificaciones)
- `INVITE_SECRET=` (para firmar/validar códigos de invitación)

## 3) Seguridad
- No subas la clave privada a repositorios públicos.
- Usa secretos de entorno en CI/CD y en tu hosting.
- Limita el acceso de la cuenta de servicio al documento concreto.

## 4) Estructura de documentos
- Un único Spreadsheet con múltiples pestañas es suficiente al comienzo.
- Si el volumen crece, se puede segmentar por temporadas (un documento por temporada) y versionar esquemas.
