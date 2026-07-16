# LMS Frontend

Base del frontend construida con React, Vite, React Router DOM y Atomic Design.

## Ejecución

```bash
npm install
npm run dev
```

Vite se inicia en `http://localhost:5173` y redirige las peticiones `/api` al backend Django en `http://localhost:8000`.

Para usar otra URL, copia `.env.example` como `.env.local` y cambia `VITE_API_URL`.

## Estructura

- `components/atoms`: controles básicos.
- `components/molecules`: combinaciones pequeñas de átomos.
- `components/organisms`: secciones funcionales completas.
- `components/templates`: distribución visual de una pantalla.
- `pages`: páginas conectadas a rutas y lógica.
- `apiCalls`: cliente HTTP y servicios de acceso a la API.
- `routes`: definición y protección de rutas.
- `hooks`: lógica reutilizable de React.
- `utils`: utilidades independientes de React.
