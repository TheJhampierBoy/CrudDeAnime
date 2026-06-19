import './styles.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type AnimeStatus = 'airing' | 'finished' | 'upcoming' | 'cancelled' | 'hiatus';
type ViewName =
  | 'dashboard'
  | 'animes'
  | 'form'
  | 'rankings'
  | 'genres'
  | 'seasons'
  | 'episodes'
  | 'reviews'
  | 'tags'
  | 'platforms'
  | 'statuses';

type Genre = {
  id: number;
  name: string;
};

type Anime = {
  id: number;
  title: string;
  synopsis?: string | null;
  status: AnimeStatus;
  year?: number | null;
  cover_url?: string | null;
  avg_score: number;
  ratings_count: number;
  created_at: string;
  updated_at: string;
  genres: Genre[];
};

type AnimePayload = {
  title: string;
  synopsis?: string;
  status: AnimeStatus;
  year?: number;
  cover_url?: string;
  genreIds?: number[];
};

type Season = {
  id: number;
  anime_id: number;
  number: number;
  title: string | null;
  year: number | null;
  avg_score: number;
  ratings_count: number;
  created_at: string;
};

type Episode = {
  id: number;
  season_id: number;
  number: number;
  title: string | null;
  synopsis: string | null;
  aired_at: string | null;
  duration_sec: number | null;
  avg_score: number;
  ratings_count: number;
  created_at: string;
};

type Rating = {
  id: number;
  episode_id: number;
  user_id: number;
  score_story: number;
  score_animation: number;
  score_music: number;
  score_characters: number;
  final_score: number;
  created_at: string;
  updated_at: string;
};

type AnimeComment = {
  id: number;
  anime_id: number;
  user_id: number;
  body: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
};

type EpisodeComment = {
  id: number;
  episode_id: number;
  user_id: number;
  body: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
};

type State = {
  view: ViewName;
  animes: Anime[];
  genres: Genre[];
  seasons: Season[];
  allSeasons: Season[];
  episodes: Episode[];
  ratings: Rating[];
  animeComments: AnimeComment[];
  episodeComments: EpisodeComment[];
  search: string;
  status: 'all' | AnimeStatus;
  genreId: 'all' | number;
  editingAnimeId: number | null;
  selectedAnimeId: number | null;
  loading: boolean;
  notice: string;
};

const statusOptions: AnimeStatus[] = ['airing', 'finished', 'upcoming', 'cancelled', 'hiatus'];
const statusLabels: Record<AnimeStatus, string> = {
  airing: 'En emision',
  finished: 'Finalizado',
  upcoming: 'Proximo',
  cancelled: 'Cancelado',
  hiatus: 'Pausado',
};

const coverTones = ['t-purple', 't-teal', 't-coral', 't-blue', 't-green'];

const state: State = {
  view: 'dashboard',
  animes: [],
  genres: [],
  seasons: [],
  allSeasons: [],
  episodes: [],
  ratings: [],
  animeComments: [],
  episodeComments: [],
  search: '',
  status: 'all',
  genreId: 'all',
  editingAnimeId: null,
  selectedAnimeId: null,
  loading: true,
  notice: '',
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

const root = app;

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function html(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return entities[char];
  });
}

function score(anime: Anime): string {
  return Number(anime.avg_score ?? 0).toFixed(1);
}

function primaryGenre(anime: Anime): Genre | undefined {
  return anime.genres[0];
}

function filteredAnimes(): Anime[] {
  const term = state.search.trim().toLowerCase();

  return state.animes
    .filter((anime) => state.status === 'all' || anime.status === state.status)
    .filter((anime) => state.genreId === 'all' || anime.genres.some((genre) => genre.id === state.genreId))
    .filter((anime) => {
      const searchable = [anime.title, anime.synopsis ?? '', anime.year?.toString() ?? '', ...anime.genres.map((genre) => genre.name)]
        .join(' ')
        .toLowerCase();
      return searchable.includes(term);
    })
    .sort((a, b) => Number(b.avg_score ?? 0) - Number(a.avg_score ?? 0) || a.title.localeCompare(b.title));
}

function topAnimes(limit = 5): Anime[] {
  return state.animes
    .slice()
    .sort((a, b) => Number(b.avg_score ?? 0) - Number(a.avg_score ?? 0))
    .slice(0, limit);
}

function editingAnime(): Anime | undefined {
  return state.animes.find((anime) => anime.id === state.editingAnimeId);
}

function activeNav(view: ViewName): string {
  return state.view === view ? 'active' : '';
}

function statusClass(statusValue: AnimeStatus): string {
  if (statusValue === 'finished') return 'st-done';
  if (statusValue === 'airing') return 'st-airing';
  return 'st-pause';
}

function tone(index: number): string {
  return coverTones[index % coverTones.length];
}

function initials(title: string): string {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function asNumber(value: FormDataEntryValue | null): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function animePayload(form: HTMLFormElement): AnimePayload {
  const data = new FormData(form);
  const genreIds = data
    .getAll('genreIds')
    .map(Number)
    .filter((id) => Number.isInteger(id));

  return {
    title: String(data.get('title') ?? '').trim(),
    synopsis: String(data.get('synopsis') ?? '').trim() || undefined,
    status: String(data.get('status') ?? 'upcoming') as AnimeStatus,
    year: asNumber(data.get('year')),
    cover_url: String(data.get('cover_url') ?? '').trim() || undefined,
    genreIds,
  };
}

async function loadData(): Promise<void> {
  state.loading = true;
  render();

  try {
    const [animes, genres, seasons] = await Promise.all([api<Anime[]>('/animes'), api<Genre[]>('/genres'), api<Season[]>('/seasons')]);
    state.animes = animes;
    state.genres = genres;
    state.allSeasons = seasons;
    state.selectedAnimeId = state.selectedAnimeId ?? animes[0]?.id ?? null;
    await loadSeasons();
    state.notice = 'Datos sincronizados';
  } catch (error) {
    state.notice = `No se pudo conectar con el API: ${(error as Error).message}`;
  } finally {
    state.loading = false;
    render();
  }
}

async function refreshAnimes(): Promise<void> {
  state.animes = await api<Anime[]>('/animes');
  if (!state.selectedAnimeId && state.animes.length) {
    state.selectedAnimeId = state.animes[0].id;
  }
  await loadSeasons();
  render();
}

async function refreshGenres(): Promise<void> {
  state.genres = await api<Genre[]>('/genres');
  render();
}

async function refreshSeasons(): Promise<void> {
  state.allSeasons = await api<Season[]>('/seasons');
  await loadSeasons();
  render();
}

async function loadSeasons(): Promise<void> {
  if (!state.selectedAnimeId) {
    state.seasons = [];
    return;
  }

  state.seasons = await api<Season[]>(`/seasons/anime/${state.selectedAnimeId}`);
}

async function saveAnime(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const payload = animePayload(form);

  if (!payload.title) {
    state.notice = 'El titulo es obligatorio';
    render();
    return;
  }

  try {
    if (state.editingAnimeId) {
      await api<Anime>(`/animes/${state.editingAnimeId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      state.notice = 'Anime actualizado';
    } else {
      const created = await api<Anime>('/animes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      state.selectedAnimeId = created.id;
      state.notice = 'Anime creado';
    }

    state.editingAnimeId = null;
    state.view = 'animes';
    await refreshAnimes();
  } catch (error) {
    state.notice = `No se pudo guardar: ${(error as Error).message}`;
    render();
  }
}

async function removeAnime(id: number): Promise<void> {
  const anime = state.animes.find((item) => item.id === id);
  const confirmed = window.confirm(`Eliminar ${anime?.title ?? 'este anime'}?`);
  if (!confirmed) return;

  try {
    await api<void>(`/animes/${id}`, { method: 'DELETE' });
    if (state.selectedAnimeId === id) state.selectedAnimeId = null;
    state.notice = 'Anime eliminado';
    await refreshAnimes();
  } catch (error) {
    state.notice = `No se pudo eliminar: ${(error as Error).message}`;
    render();
  }
}

async function createGenre(name: string): Promise<void> {
  if (!name.trim()) return;

  try {
    await api<Genre>('/genres', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    state.genres = await api<Genre[]>('/genres');
    state.notice = 'Genero creado';
    render();
  } catch (error) {
    state.notice = `No se pudo crear el genero: ${(error as Error).message}`;
    render();
  }
}

async function updateGenre(id: number, name: string): Promise<void> {
  if (!name.trim()) return;

  try {
    await api<Genre>(`/genres/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    state.notice = 'Genero actualizado';
    await refreshGenres();
  } catch (error) {
    state.notice = `No se pudo actualizar el genero: ${(error as Error).message}`;
    render();
  }
}

async function removeGenre(id: number): Promise<void> {
  const genre = state.genres.find((item) => item.id === id);
  const confirmed = window.confirm(`Eliminar ${genre?.name ?? 'este genero'}?`);
  if (!confirmed) return;

  try {
    await api<void>(`/genres/${id}`, { method: 'DELETE' });
    state.notice = 'Genero eliminado';
    await refreshGenres();
  } catch (error) {
    state.notice = `No se pudo eliminar el genero: ${(error as Error).message}`;
    render();
  }
}

async function saveSeason(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const animeId = asNumber(data.get('anime_id')) ?? state.editingAnimeId ?? state.selectedAnimeId;

  if (!animeId) {
    state.notice = 'Primero guarda o selecciona un anime';
    render();
    return;
  }

  try {
    await api<Season>('/seasons', {
      method: 'POST',
      body: JSON.stringify({
        anime_id: animeId,
        number: Number(data.get('number')),
        title: String(data.get('title') ?? '').trim() || undefined,
        year: asNumber(data.get('year')),
      }),
    });

    form.reset();
    state.selectedAnimeId = animeId;
    await refreshSeasons();
    state.notice = 'Temporada creada';
    render();
  } catch (error) {
    state.notice = `No se pudo crear la temporada: ${(error as Error).message}`;
    render();
  }
}

async function removeSeason(id: number): Promise<void> {
  const confirmed = window.confirm('Eliminar esta temporada?');
  if (!confirmed) return;

  try {
    await api<void>(`/seasons/${id}`, { method: 'DELETE' });
    state.notice = 'Temporada eliminada';
    await refreshSeasons();
  } catch (error) {
    state.notice = `No se pudo eliminar la temporada: ${(error as Error).message}`;
    render();
  }
}

function renderSidebar(): string {
  return `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-title"><span class="logo-mark">TV</span>AniBase</div>
        <div class="logo-sub">Anime Ranking v1.0</div>
      </div>
      <div class="nav-section">Principal</div>
      <button class="nav-item ${activeNav('dashboard')}" data-view="dashboard"><span>DB</span>Dashboard</button>
      <button class="nav-item ${activeNav('animes')}" data-view="animes"><span>AN</span>Animes</button>
      <button class="nav-item ${activeNav('rankings')}" data-view="rankings"><span>RK</span>Rankings</button>
      <div class="nav-section">Catalogo</div>
      <button class="nav-item ${activeNav('genres')}" data-view="genres"><span>GE</span>Generos</button>
      <button class="nav-item ${activeNav('episodes')}" data-view="episodes"><span>EP</span>Episodios</button>
      <button class="nav-item ${activeNav('seasons')}" data-view="seasons"><span>TE</span>Temporadas</button>
      <button class="nav-item ${activeNav('reviews')}" data-view="reviews"><span>RS</span>Resenas</button>
      <div class="nav-section">Sistema</div>
      <button class="nav-item ${activeNav('tags')}" data-view="tags"><span>TA</span>Tags</button>
      <button class="nav-item ${activeNav('platforms')}" data-view="platforms"><span>PL</span>Plataformas</button>
      <button class="nav-item ${activeNav('statuses')}" data-view="statuses"><span>ST</span>Estados</button>
    </aside>
  `;
}

function renderLayout(title: string, actions: string, content: string): string {
  return `
    <main class="app-shell">
      ${renderSidebar()}
      <section class="main">
        <header class="topbar">
          <div class="topbar-title">${title}</div>
          <div class="topbar-actions">${actions}</div>
        </header>
        <div class="content">
          ${content}
        </div>
        <div class="notice">${html(state.notice)}</div>
      </section>
    </main>
  `;
}

function renderDashboard(): string {
  const recent = state.animes.slice(-3).reverse();
  const ranked = topAnimes(5);
  const averageScore =
    state.animes.length > 0
      ? (state.animes.reduce((total, anime) => total + Number(anime.avg_score ?? 0), 0) / state.animes.length).toFixed(1)
      : '0.0';

  const actions = `
    <div class="search-box small">
      <span class="mini-icon">/</span>
      <input id="search" type="text" value="${html(state.search)}" placeholder="Buscar anime..." />
    </div>
    <button class="btn-primary" data-new-anime><span>+</span>Nuevo anime</button>
  `;

  const content = `
    <div class="stats-row">
      <div class="stat-card"><div class="stat-label">Total animes</div><div class="stat-val">${state.animes.length}</div><div class="stat-sub">CRUD activo</div></div>
      <div class="stat-card"><div class="stat-label">Generos</div><div class="stat-val">${state.genres.length}</div><div class="stat-sub">Catalogo disponible</div></div>
      <div class="stat-card"><div class="stat-label">Resenas</div><div class="stat-val">${state.animes.reduce((sum, anime) => sum + Number(anime.ratings_count ?? 0), 0)}</div><div class="stat-sub">Promedio: ${averageScore}</div></div>
      <div class="stat-card"><div class="stat-label">Estados</div><div class="stat-val">${statusOptions.length}</div><div class="stat-sub">Emision, finalizado...</div></div>
    </div>

    <div class="section-header">
      <div class="section-title">Animes recientes</div>
      <button class="act-btn" data-view="animes">Ver todos <span>></span></button>
    </div>

    <div class="anime-grid">
      ${
        recent.length
          ? recent.map(renderAnimeCard).join('')
          : '<div class="empty wide">Aun no hay animes registrados.</div>'
      }
    </div>

    <div class="section-header">
      <div class="section-title">Top ranking</div>
      <button class="act-btn" data-view="rankings">Ver ranking completo <span>></span></button>
    </div>

    <div class="ranking-table">
      <div class="rt-head">
        <div>#</div><div>Anime</div><div>Temporadas</div><div>Ano</div><div>Resenas</div><div>Score</div>
      </div>
      ${
        ranked.length
          ? ranked
              .map(
                (anime, index) => `
                <div class="rt-row">
                  <div class="rank-num ${index < 3 ? `rank-${index + 1}` : ''}">${index + 1}</div>
                  <div>${html(anime.title)}</div>
                  <div>${anime.id === state.selectedAnimeId ? state.seasons.length : '-'}</div>
                  <div>${anime.year ?? '-'}</div>
                  <div>${anime.ratings_count ?? 0}</div>
                  <div><span class="score-pill">${score(anime)}</span></div>
                </div>
              `,
              )
              .join('')
          : '<div class="empty">Sin datos para ranking.</div>'
      }
    </div>
  `;

  return renderLayout('Dashboard', actions, content);
}

function renderAnimeCard(anime: Anime, index = 0): string {
  const genre = primaryGenre(anime);
  return `
    <article class="anime-card">
      <div class="anime-cover ${tone(index)}">${anime.cover_url ? `<img src="${html(anime.cover_url)}" alt="${html(anime.title)}" />` : initials(anime.title)}</div>
      <div class="anime-info">
        <div class="anime-name">${html(anime.title)}</div>
        <div class="anime-meta">
          ${genre ? `<span class="badge badge-genre">${html(genre.name)}</span>` : '<span class="badge badge-muted">Sin genero</span>'}
          <span class="badge badge-status">${statusLabels[anime.status]}</span>
        </div>
        <div class="anime-score"><span>*</span>${score(anime)} · ${anime.year ?? 'Sin ano'}</div>
      </div>
      <div class="anime-actions">
        <button class="act-btn" data-select-anime="${anime.id}">Ver</button>
        <button class="act-btn" data-edit-anime="${anime.id}">Editar</button>
        <button class="act-btn danger" data-delete-anime="${anime.id}">Eliminar</button>
      </div>
    </article>
  `;
}

function renderAnimeList(): string {
  const animes = filteredAnimes();
  const actions = `
    <button class="btn-primary" data-new-anime><span>+</span>Nuevo anime</button>
  `;

  const rows = state.loading
    ? '<div class="empty">Cargando animes...</div>'
    : animes.length
      ? animes
          .map((anime, index) => {
            const genre = primaryGenre(anime);
            return `
              <div class="td-row" data-select-anime="${anime.id}">
                <div class="anime-thumb ${tone(index)}">${anime.cover_url ? `<img src="${html(anime.cover_url)}" alt="${html(anime.title)}" />` : initials(anime.title)}</div>
                <div class="anime-title-cell">
                  <span class="anime-title-main">${html(anime.title)}</span>
                  <span class="anime-title-sub">${html(anime.synopsis || 'Sin sinopsis registrada')}</span>
                </div>
                <div>${genre ? `<span class="badge badge-action">${html(genre.name)}</span>` : '<span class="badge badge-muted">Sin genero</span>'}</div>
                <div><span class="status-pill ${statusClass(anime.status)}">${statusLabels[anime.status]}</span></div>
                <div>${anime.year ?? '-'}</div>
                <div class="score-val"><span>*</span>${score(anime)}</div>
                <div class="td-actions">
                  <button class="icon-btn" data-select-anime="${anime.id}" aria-label="Ver detalle">Ver</button>
                  <button class="icon-btn" data-edit-anime="${anime.id}" aria-label="Editar">Ed</button>
                  <button class="icon-btn danger" data-delete-anime="${anime.id}" aria-label="Eliminar">X</button>
                </div>
              </div>
            `;
          })
          .join('')
      : '<div class="empty">No hay animes para estos filtros.</div>';

  const content = `
    <div class="filters-bar">
      <div class="search-box">
        <span class="mini-icon">/</span>
        <input id="search" type="text" value="${html(state.search)}" placeholder="Buscar por titulo..." />
      </div>
      <select id="genre-filter" class="filter-select">
        <option value="all">Todos los generos</option>
        ${state.genres.map((genre) => `<option value="${genre.id}" ${state.genreId === genre.id ? 'selected' : ''}>${html(genre.name)}</option>`).join('')}
      </select>
      <select id="status-filter" class="filter-select">
        <option value="all">Todos los estados</option>
        ${statusOptions.map((status) => `<option value="${status}" ${state.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('')}
      </select>
      <select class="filter-select" disabled>
        <option>Plataforma</option>
      </select>
      <div class="view-toggle">
        <button class="vt-btn active" title="Vista de tabla">=</button>
        <button class="vt-btn" title="Vista de grilla">#</button>
      </div>
    </div>

    <div class="results-info">Mostrando ${animes.length} de ${state.animes.length} animes</div>

    <div class="anime-table">
      <div class="th-row">
        <div></div><div>Titulo</div><div>Genero</div><div>Estado</div><div>Ano</div><div>Score</div><div>Acciones</div>
      </div>
      ${rows}
    </div>

    <div class="pagination">
      <div class="pg-info">Pagina 1 de 1</div>
      <div class="pg-btns">
        <button class="pg-btn active">1</button>
      </div>
    </div>
  `;

  return renderLayout('Animes', actions, content);
}

function renderRankings(): string {
  const ranked = topAnimes(state.animes.length || 10);
  const actions = `
    <button class="btn-ghost" data-view="dashboard">Dashboard</button>
    <button class="btn-primary" data-view="animes"><span>></span>Ver animes</button>
  `;

  const content = `
    <div class="section-header">
      <div>
        <div class="section-title">Ranking general</div>
        <div class="results-info">Ordenado por score promedio y votos registrados.</div>
      </div>
    </div>
    <div class="ranking-table">
      <div class="rt-head">
        <div>#</div><div>Anime</div><div>Generos</div><div>Ano</div><div>Resenas</div><div>Score</div>
      </div>
      ${
        ranked.length
          ? ranked
              .map(
                (anime, index) => `
                  <div class="rt-row">
                    <div class="rank-num ${index < 3 ? `rank-${index + 1}` : ''}">${index + 1}</div>
                    <div>${html(anime.title)}</div>
                    <div>${anime.genres.length || '-'}</div>
                    <div>${anime.year ?? '-'}</div>
                    <div>${anime.ratings_count ?? 0}</div>
                    <div><span class="score-pill">${score(anime)}</span></div>
                  </div>
                `,
              )
              .join('')
          : '<div class="empty">No hay animes para rankear.</div>'
      }
    </div>
  `;

  return renderLayout('Rankings', actions, content);
}

function renderGenres(): string {
  const actions = '<button class="btn-primary" data-view="form"><span>+</span>Nuevo anime</button>';
  const content = `
    <form class="management-form" id="genre-create-form">
      <input name="name" maxlength="100" placeholder="Nuevo genero" required />
      <button type="submit">Crear genero</button>
    </form>

    <div class="management-grid">
      ${
        state.genres.length
          ? state.genres
              .map((genre) => {
                const count = state.animes.filter((anime) => anime.genres.some((item) => item.id === genre.id)).length;
                return `
                  <article class="management-card">
                    <form class="genre-update-form" data-genre-id="${genre.id}">
                      <input name="name" maxlength="100" value="${html(genre.name)}" />
                      <button type="submit">Guardar</button>
                    </form>
                    <div class="card-meta">${count} animes asociados</div>
                    <button class="act-btn danger" data-delete-genre="${genre.id}">Eliminar</button>
                  </article>
                `;
              })
              .join('')
          : '<div class="empty wide">No hay generos registrados.</div>'
      }
    </div>
  `;

  return renderLayout('Generos', actions, content);
}

function renderSeasons(): string {
  const actions = '<button class="btn-primary" data-view="form"><span>+</span>Nuevo anime</button>';
  const content = `
    <form class="management-form" id="season-form">
      <select name="anime_id" required>
        <option value="">Anime</option>
        ${state.animes.map((anime) => `<option value="${anime.id}" ${state.selectedAnimeId === anime.id ? 'selected' : ''}>${html(anime.title)}</option>`).join('')}
      </select>
      <input name="number" type="number" min="1" placeholder="Temporada" required />
      <input name="title" placeholder="Titulo" />
      <input name="year" type="number" min="1900" max="2100" placeholder="Ano" />
      <button type="submit">Crear temporada</button>
    </form>

    <div class="anime-table">
      <div class="season-head">
        <div>Anime</div><div>Temporada</div><div>Titulo</div><div>Ano</div><div>Score</div><div>Acciones</div>
      </div>
      ${
        state.allSeasons.length
          ? state.allSeasons
              .map((season) => {
                const anime = state.animes.find((item) => item.id === season.anime_id);
                return `
                  <div class="season-row">
                    <div>${html(anime?.title ?? `Anime ${season.anime_id}`)}</div>
                    <div>${season.number}</div>
                    <div>${html(season.title ?? 'Sin titulo')}</div>
                    <div>${season.year ?? '-'}</div>
                    <div>${Number(season.avg_score ?? 0).toFixed(1)}</div>
                    <div><button class="icon-btn danger" data-delete-season="${season.id}">X</button></div>
                  </div>
                `;
              })
              .join('')
          : '<div class="empty">No hay temporadas registradas.</div>'
      }
    </div>
  `;

  return renderLayout('Temporadas', actions, content);
}

function renderStatuses(): string {
  const actions = '<button class="btn-primary" data-new-anime><span>+</span>Nuevo anime</button>';
  const content = `
    <div class="stats-row">
      ${statusOptions
        .map((status) => {
          const count = state.animes.filter((anime) => anime.status === status).length;
          return `<button class="stat-card stat-button" data-status-shortcut="${status}"><div class="stat-label">${statusLabels[status]}</div><div class="stat-val">${count}</div><div class="stat-sub">Ver filtrados</div></button>`;
        })
        .join('')}
    </div>
  `;

  return renderLayout('Estados', actions, content);
}

function renderPreparedModule(view: ViewName, title: string, description: string): string {
  const actions = '<button class="btn-primary" data-view="form"><span>+</span>Nuevo anime</button>';
  const content = `
    <section class="prepared-panel">
      <div class="section-title">${title}</div>
      <p>${description}</p>
      <div class="prepared-grid">
        <div class="stat-card"><div class="stat-label">Backend</div><div class="stat-val">Pendiente</div><div class="stat-sub">Agregar modulo ${view}</div></div>
        <div class="stat-card"><div class="stat-label">Datos base</div><div class="stat-val">${state.animes.length}</div><div class="stat-sub">Animes disponibles</div></div>
        <div class="stat-card"><div class="stat-label">UI</div><div class="stat-val">Lista</div><div class="stat-sub">Vista ya navegable</div></div>
      </div>
    </section>
  `;

  return renderLayout(title, actions, content);
}

function renderForm(): string {
  const anime = editingAnime();
  const genreIds = new Set(anime?.genres.map((genre) => genre.id) ?? []);
  const relatedSeasons = state.seasons.filter((season) => season.anime_id === (anime?.id ?? state.selectedAnimeId));

  const actions = `
    <button class="btn-ghost" data-view="animes">Cancelar</button>
    <button class="btn-primary" form="anime-form"><span>+</span>Guardar</button>
  `;

  const content = `
    <form class="form-layout" id="anime-form">
      <div>
        <section class="form-card">
          <div class="form-card-title"><span>i</span>Informacion basica</div>
          <div class="field">
            <label class="field-label" for="title">Titulo <span class="required">*</span></label>
            <input id="title" name="title" maxlength="255" value="${html(anime?.title ?? '')}" placeholder="Ej: Attack on Titan" required />
          </div>
          <div class="field">
            <label class="field-label" for="synopsis">Sinopsis</label>
            <textarea id="synopsis" name="synopsis" placeholder="Describe la historia, tono o premisa...">${html(anime?.synopsis ?? '')}</textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field-label" for="year">Ano</label>
              <input id="year" name="year" type="number" min="1900" max="2100" value="${anime?.year ?? ''}" placeholder="Ej: 2013" />
            </div>
            <div class="field">
              <label class="field-label" for="status">Estado <span class="required">*</span></label>
              <select id="status" name="status">
                ${statusOptions.map((status) => `<option value="${status}" ${anime?.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="cover_url">URL de portada</label>
            <input id="cover_url" name="cover_url" maxlength="500" value="${html(anime?.cover_url ?? '')}" placeholder="https://..." />
            <div class="field-hint">JPG, PNG o WebP desde una URL publica.</div>
          </div>
        </section>

        <section class="form-card">
          <div class="form-card-title"><span>#</span>Generos</div>
          <div class="field-label">Selecciona uno o mas generos</div>
          <div class="genre-grid">
            ${
              state.genres.length
                ? state.genres
                    .map(
                      (genre) => `
                        <label class="genre-chip ${genreIds.has(genre.id) ? 'selected' : ''}">
                          <input type="checkbox" name="genreIds" value="${genre.id}" ${genreIds.has(genre.id) ? 'checked' : ''} />
                          ${html(genre.name)}
                        </label>
                      `,
                    )
                    .join('')
                : '<div class="muted">Crea generos desde el panel lateral.</div>'
            }
          </div>
        </section>

        <section class="form-card">
          <div class="form-card-title"><span>PL</span>Plataformas de streaming</div>
          <div class="platform-list">
            <label class="platform-item"><input type="checkbox" disabled /> Crunchyroll</label>
            <label class="platform-item"><input type="checkbox" disabled /> Netflix</label>
            <label class="platform-item"><input type="checkbox" disabled /> Funimation</label>
            <label class="platform-item"><input type="checkbox" disabled /> Amazon Prime</label>
          </div>
        </section>
      </div>

      <aside>
        <section class="form-card">
          <div class="form-card-title"><span>IMG</span>Imagen</div>
          <div class="image-preview">${anime?.cover_url ? `<img src="${html(anime.cover_url)}" alt="${html(anime.title)}" />` : 'AN'}</div>
          <div class="preview-actions">
            <button class="preview-btn" type="button">Subir</button>
            <button class="preview-btn" type="button">URL</button>
            <button class="preview-btn danger" type="button">Quitar</button>
          </div>
        </section>

        <section class="form-card">
          <div class="form-card-title"><span>TE</span>Temporadas</div>
          <div class="season-stack">
            ${
              relatedSeasons.length
                ? relatedSeasons.map((season) => `<div class="season-pill"><span>Temporada ${season.number}</span><small>${html(season.title ?? 'Sin titulo')}</small></div>`).join('')
                : '<div class="muted">Sin temporadas registradas.</div>'
            }
          </div>
          <div class="field-hint">Guarda el anime antes de agregar temporadas nuevas.</div>
        </section>

        <section class="form-card">
          <div class="form-card-title"><span>GE</span>Nuevo genero</div>
          <div class="inline-form" id="genre-panel">
            <input name="name" maxlength="100" placeholder="Ej: Fantasia" />
            <button type="button" id="create-genre">Crear</button>
          </div>
        </section>

        <section class="form-card info-card">
          Los episodios y resenas se pueden agregar desde el detalle del anime una vez guardado.
        </section>
      </aside>
    </form>

    <form class="floating-season-form" id="season-form">
      <input name="number" type="number" min="1" placeholder="Temporada" required />
      <input name="title" placeholder="Titulo" />
      <input name="year" type="number" min="1900" max="2100" placeholder="Ano" />
      <button type="submit">Agregar temporada</button>
    </form>
  `;

  return renderLayout(anime ? 'Editar anime' : 'Nuevo anime', actions, content);
}

function render(): void {
  if (state.view === 'dashboard') {
    root.innerHTML = renderDashboard();
  } else if (state.view === 'animes') {
    root.innerHTML = renderAnimeList();
  } else if (state.view === 'form') {
    root.innerHTML = renderForm();
  } else if (state.view === 'rankings') {
    root.innerHTML = renderRankings();
  } else if (state.view === 'genres') {
    root.innerHTML = renderGenres();
  } else if (state.view === 'seasons') {
    root.innerHTML = renderSeasons();
  } else if (state.view === 'statuses') {
    root.innerHTML = renderStatuses();
  } else if (state.view === 'episodes') {
    root.innerHTML = renderPreparedModule('episodes', 'Episodios', 'Pantalla preparada para listar episodios cuando exista el modulo en el backend.');
  } else if (state.view === 'reviews') {
    root.innerHTML = renderPreparedModule('reviews', 'Resenas', 'Pantalla preparada para administrar resenas cuando exista el modulo en el backend.');
  } else if (state.view === 'tags') {
    root.innerHTML = renderPreparedModule('tags', 'Tags', 'Pantalla preparada para etiquetas cuando exista el catalogo en el backend.');
  } else {
    root.innerHTML = renderPreparedModule('platforms', 'Plataformas', 'Pantalla preparada para plataformas de streaming cuando exista el catalogo en el backend.');
  }

  wireEvents();
}

function wireEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      state.view = button.dataset.view as ViewName;
      if (state.view !== 'form') state.editingAnimeId = null;
      render();
    });
  });

  document.querySelectorAll<HTMLElement>('[data-new-anime]').forEach((button) => {
    button.addEventListener('click', () => {
      state.editingAnimeId = null;
      state.view = 'form';
      render();
    });
  });

  document.querySelectorAll<HTMLElement>('[data-edit-anime]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      state.editingAnimeId = Number(button.dataset.editAnime);
      state.selectedAnimeId = state.editingAnimeId;
      await loadSeasons();
      state.view = 'form';
      render();
    });
  });

  document.querySelectorAll<HTMLElement>('[data-delete-anime]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      void removeAnime(Number(button.dataset.deleteAnime));
    });
  });

  document.querySelectorAll<HTMLElement>('[data-select-anime]').forEach((element) => {
    element.addEventListener('click', async () => {
      state.selectedAnimeId = Number(element.dataset.selectAnime);
      await loadSeasons();
      state.notice = 'Anime seleccionado';
      render();
    });
  });

  document.querySelector('#search')?.addEventListener('input', (event) => {
    state.search = (event.target as HTMLInputElement).value;
    render();
  });

  document.querySelector('#status-filter')?.addEventListener('change', (event) => {
    state.status = (event.target as HTMLSelectElement).value as State['status'];
    render();
  });

  document.querySelector('#genre-filter')?.addEventListener('change', (event) => {
    const value = (event.target as HTMLSelectElement).value;
    state.genreId = value === 'all' ? 'all' : Number(value);
    render();
  });

  document.querySelector('#anime-form')?.addEventListener('submit', (event) => void saveAnime(event as SubmitEvent));
  document.querySelector('#season-form')?.addEventListener('submit', (event) => void saveSeason(event as SubmitEvent));
  document.querySelector('#genre-create-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    void createGenre(String(data.get('name') ?? '').trim());
  });

  document.querySelectorAll<HTMLFormElement>('.genre-update-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      void updateGenre(Number(form.dataset.genreId), String(data.get('name') ?? '').trim());
    });
  });

  document.querySelectorAll<HTMLElement>('[data-delete-genre]').forEach((button) => {
    button.addEventListener('click', () => void removeGenre(Number(button.dataset.deleteGenre)));
  });

  document.querySelectorAll<HTMLElement>('[data-delete-season]').forEach((button) => {
    button.addEventListener('click', () => void removeSeason(Number(button.dataset.deleteSeason)));
  });

  document.querySelectorAll<HTMLElement>('[data-status-shortcut]').forEach((button) => {
    button.addEventListener('click', () => {
      state.status = button.dataset.statusShortcut as AnimeStatus;
      state.view = 'animes';
      render();
    });
  });
  document.querySelector('#create-genre')?.addEventListener('click', () => {
    const panel = document.querySelector<HTMLDivElement>('#genre-panel');
    const input = panel?.querySelector<HTMLInputElement>('input[name="name"]');
    if (!panel || !input) return;

    const name = input.value.trim();
    input.value = '';
    void createGenre(name);
  });
}

void loadData();
