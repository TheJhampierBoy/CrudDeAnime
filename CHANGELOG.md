# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-06-05

### Added

- TypeORM + PostgreSQL connection via ConfigModule
- Liquibase changelog scaffold with 10 changesets (genre, user, anime, season, episode, anime_genre, episode_rating, anime_comment, episode_comment, comment_like)
- `.env` and `.env.example`

## [0.2.0] - 2026-06-05

### Added

- Genre module: entity, request/response DTOs, mapper, service interface, service impl, controller
- ValidationPipe (global, whitelist + transform)
- Swagger setup at /api/docs

## [0.1.1] - 2026-06-05

### Changed

- Replaced Liquibase with TypeORM migrations
- Added `data-source.ts` for CLI usage
- Added `migration:generate`, `migration:run`, `migration:revert` scripts
- Generated and ran `InitialSchema` migration (`genre` table created)

## [0.3.0] - 2026-06-05

### Added

- User module: entity, DTOs, mapper, service interface + impl, controller
- Migration: AddUserTable

## [0.4.0] - 2026-06-05

### Added

- Anime module: entity, DTOs, mapper, service interface + impl, controller
- ManyToMany relation anime ↔ genre via `anime_genre` pivot table (no controller)
- Migration: AddAnimeTable (creates `anime` + `anime_genre` tables)
