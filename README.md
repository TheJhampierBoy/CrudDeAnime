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

#### Catalog Tables (1)

1. genre

#### Core Tables (4)

2. user
3. anime
4. season
5. episode

#### Rating Tables (1)

6. episode_rating

#### Comment Tables (3)

7. anime_comment
8. episode_comment
9. comment_like

#### Pivot Tables (1)

10. anime_genre

---

### Key Fields

| Table | Notable columns |
|---|---|
| `anime` | title, synopsis, status, year, cover_url, avg_score, ratings_count |
| `season` | anime_id, number, title, year, avg_score, ratings_count |
| `episode` | season_id, number, title, synopsis, aired_at, duration_sec, avg_score, ratings_count |
| `episode_rating` | episode_id, user_id, score_story (30%), score_animation (25%), score_music (20%), score_characters (25%), final_score |
| `anime_comment` | anime_id, user_id, body, likes_count |
| `episode_comment` | episode_id, user_id, body, likes_count |
| `comment_like` | user_id, target_type (anime_comment \| episode_comment), target_id |

---

### Relationships

```text
Anime ----< Season ----< Episode ----< episode_rating
                                  ----< episode_comment

Anime ----< anime_comment
Anime >----< Genre
           anime_genre

User ----< episode_rating
User ----< anime_comment
User ----< episode_comment
User ----< comment_like
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

#### Tablas de catálogo (1)

1. genre

#### Tablas principales (4)

2. user
3. anime
4. season
5. episode

#### Tablas de puntuación (1)

6. episode_rating

#### Tablas de comentarios (3)

7. anime_comment
8. episode_comment
9. comment_like

#### Tabla pivote (1)

10. anime_genre

---

### Campos destacados

| Tabla | Columnas relevantes |
|---|---|
| `anime` | title, synopsis, status, year, cover_url, avg_score, ratings_count |
| `season` | anime_id, number, title, year, avg_score, ratings_count |
| `episode` | season_id, number, title, synopsis, aired_at, duration_sec, avg_score, ratings_count |
| `episode_rating` | episode_id, user_id, score_story (30%), score_animation (25%), score_music (20%), score_characters (25%), final_score |
| `anime_comment` | anime_id, user_id, body, likes_count |
| `episode_comment` | episode_id, user_id, body, likes_count |
| `comment_like` | user_id, target_type (anime_comment \| episode_comment), target_id |

---

### Relaciones

```text
Anime ----< Season ----< Episode ----< episode_rating
                                  ----< episode_comment

Anime ----< anime_comment
Anime >----< Genre
           anime_genre

User ----< episode_rating
User ----< anime_comment
User ----< episode_comment
User ----< comment_like
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