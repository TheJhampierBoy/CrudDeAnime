# Anime Ranking

Anime Ranking is a web application designed to manage anime rankings through a basic CRUD system.

The project allows users to register anime information, rankings, genres, episodes, reviews, and related data using a relational database structure.

---

# Features

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

# Architecture

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

# Technologies

## Backend

- Node.js
- Express.js
- Sequelize ORM
- REST API

## Frontend

- Angular
- TypeScript
- HTML
- CSS

## Database

- PostgreSQL

## Documentation

- Swagger / OpenAPI

---

# Project Structure

```text
AnimeRanking
│
├── backend
│   ├── controllers
│   ├── services
│   ├── models
│   ├── routes
│   ├── config
│   └── middleware
│
└── frontend
    ├── components
    ├── pages
    ├── services
    ├── models
    └── shared
```

---

# Database Model

## Normal Tables (9)

1. anime
2. genre
3. episode
4. review
5. ranking
6. season
7. status
8. tag
9. platform

## Pivot Table (1)

10. anime_genre

---

# Relationships

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

# CRUD Operations

## Create

Register anime.

Example:

```json
{
   "title":"Attack on Titan",
   "episodes":89
}
```

## Read

Display anime ranking list.

## Update

Modify anime information.

## Delete

Remove anime entries.

---

# Installation

## Clone repository

```bash
git clone https://github.com/username/anime-ranking.git
```

---

## Backend Setup

Move to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

---

## Frontend Setup

Move to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run Angular:

```bash
ng serve
```

Frontend:

```text
http://localhost:4200
```

---

# API Endpoints

## Anime

```http
GET    /api/anime
POST   /api/anime
PUT    /api/anime/:id
DELETE /api/anime/:id
```

## Genre

```http
GET    /api/genre
POST   /api/genre
```

## Ranking

```http
GET    /api/ranking
POST   /api/ranking
```

## Review

```http
GET    /api/review
POST   /api/review
```

---

# Project Goal

Develop a CRUD application for anime ranking management using Node.js, Angular, PostgreSQL, and MVC architecture.

---

# Team

Anime Ranking Team