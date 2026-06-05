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
