# GradientWorks

Sitio corporativo de GradientWorks para servicios de Data, AI y Business Intelligence en Chile.

## Sitio publicado

https://crmoran01.github.io/gradientworks/

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Desarrollo local

```bash
npm ci
npm run dev
```

El sitio queda disponible en `http://localhost:3000` por defecto. Las variables admitidas están documentadas en `.env.example`.

## Verificación

```bash
npm test
```

La validación comprueba sintaxis JavaScript, archivos públicos obligatorios y configuración de los formularios.

## Estructura

```text
public/             Sitio, páginas legales y recursos estáticos
public/css/         Sistema visual compartido
public/js/          Interacciones de navegación, formularios y accesibilidad
public/img/         Video optimizado del hero
scripts/            Validaciones del proyecto
server.js           Servidor Express y encabezados de seguridad
```

## Formularios

Los formularios utilizan FormSubmit y actualmente envían a un buzón temporal de pruebas. La primera solicitud puede requerir activar el destinatario. Antes de producción se debe reemplazar por un correo corporativo y revisar el proveedor encargado del tratamiento.

## Protección de datos

Las páginas legales están redactadas para el régimen chileno vigente en julio de 2026 y consideran la entrada en vigor de la Ley N.º 21.719 el 1 de diciembre de 2026. Deben revisarse ante cambios de servicios, proveedores o normativa y validarse con asesoría jurídica antes de iniciar operaciones comerciales.

## Licencia

Código y contenido reservados. Consulta `LICENSE`.
