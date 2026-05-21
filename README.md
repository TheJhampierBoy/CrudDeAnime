# Anime Ranking

## English

Anime Ranking is a web application designed to manage anime rankings through a basic CRUD system.

The project allows users to register anime information, rankings, genres, episodes, reviews, and related data using a relational database structure.

---

### Features

- Create anime records
- View anime rankings
- Update anime information
- Delete anime entries
- Genre management
- Episode management
- Review system
- Season registration
- Tag management
- Streaming platform registration

---

### Architecture

The project follows the **MVC (Model - View - Controller)** architecture.

```text
Angular Frontend
        │
        ▼
Controllers
        │
        ▼
Services
        │
        ▼
Models
        │
        ▼
PostgreSQL Database
```

---

### Technologies

#### Backend

- Node.js
- Express.js
- Sequelize ORM
- REST API

#### Frontend

- Angular
- TypeScript
- HTML
- CSS

#### Database

- PostgreSQL

#### Documentation

- Swagger / OpenAPI

---

### Database Model

#### Normal Tables (9)

1. anime
2. genre
3. episode
4. review
5. ranking
6. season
7. status
8. tag
9. platform

#### Pivot Table (1)

10. anime_genre

---

### Relationships

```text
Anime ----< Episode
Anime ----< Review
Anime ----< Ranking
Anime ----< Season
Anime ----< Status
Anime ----< Tag
Anime ----< Platform

Anime >----< Genre
          anime_genre
```

---

### Installation

#### Backend

```bash
cd backend
npm install
npm run dev
```

Backend URL:

```text
http://localhost:3000
```

#### Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend URL:

```text
http://localhost:4200
```

---

### API Endpoints

```http
GET    /api/anime
POST   /api/anime
PUT    /api/anime/:id
DELETE /api/anime/:id
```

---

## Español

Anime Ranking es una aplicación web diseñada para administrar rankings de anime mediante un sistema CRUD básico.

El proyecto permite registrar información de animes, clasificaciones, géneros, episodios, reseñas y datos relacionados utilizando una estructura de base de datos relacional.

---

### Características

- Crear registros de animes
- Visualizar ranking de animes
- Actualizar información
- Eliminar registros
- Gestión de géneros
- Gestión de episodios
- Sistema de reseñas
- Registro de temporadas
- Gestión de etiquetas
- Registro de plataformas de streaming

---

### Arquitectura

El proyecto sigue la arquitectura **MVC (Model - View - Controller)**.

```text
Frontend Angular
        │
        ▼
Controladores
        │
        ▼
Servicios
        │
        ▼
Modelos
        │
        ▼
Base de Datos PostgreSQL
```

---

### Tecnologías

#### Backend

- Node.js
- Express.js
- Sequelize ORM
- API REST

#### Frontend

- Angular
- TypeScript
- HTML
- CSS

#### Base de Datos

- PostgreSQL

#### Documentación

- Swagger / OpenAPI

---

### Modelo de Base de Datos

#### Tablas normales (9)

1. anime
2. genre
3. episode
4. review
5. ranking
6. season
7. status
8. tag
9. platform

#### Tabla pivote (1)

10. anime_genre

---

### Relaciones

```text
Anime ----< Episode
Anime ----< Review
Anime ----< Ranking
Anime ----< Season
Anime ----< Status
Anime ----< Tag
Anime ----< Platform

Anime >----< Genre
          anime_genre
```

---

### Instalación

#### Backend

```bash
cd backend
npm install
npm run dev
```

Servidor:

```text
http://localhost:3000
```

#### Frontend

```bash
cd frontend
npm install
ng serve
```

Cliente:

```text
http://localhost:4200
```

---

### Endpoints API

```http
GET    /api/anime
POST   /api/anime
PUT    /api/anime/:id
DELETE /api/anime/:id
```

---

## Team / Equipo

Anime Ranking Team