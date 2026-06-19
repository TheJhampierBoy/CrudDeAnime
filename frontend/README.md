# Anime Ranking Frontend

Boceto en TypeScript para consumir el backend NestJS del proyecto.

## Ejecutar

```bash
cd frontend
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

El backend debe estar corriendo en:

```text
http://localhost:3000
```

Si el API cambia de puerto, crea un archivo `.env` dentro de `frontend`:

```text
VITE_API_URL=http://localhost:3000
```

## Pantallas incluidas

- Listado y busqueda de animes.
- Filtro por estado.
- Formulario de crear y editar anime.
- Eliminacion con confirmacion.
- Creacion rapida de generos.
- Panel de detalle con temporadas por anime.
