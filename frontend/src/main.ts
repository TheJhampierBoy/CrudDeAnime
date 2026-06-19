import './styles.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type AnimeStatus = 'airing' | 'finished' | 'upcoming' | 'cancelled' | 'hiatus';

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

type ViewState = {
  animes: Anime[];
  genres: Genre[];
  seasons: Season[];
  selectedAnimeId: number | null;
  editingAnimeId: number | null;
  search: string;
  status: 'all' | AnimeStatus;
  loading: boolean;
  notice: string;
};

const statusOptions: AnimeStatus[] = ['airing', 'finished', 'upcoming', 'cancelled', 'hiatus'];
const statusLabels: Record<AnimeStatus, string> = {
  airing: 'En emision',
  finished: 'Finalizado',
  upcoming: 'Proximo',
  cancelled: 'Cancelado',
  hiatus: 'En pausa',
};

const state: ViewState = {
  animes: [],
  genres: [],
  seasons: [],
  selectedAnimeId: null,
  editingAnimeId: null,
  search: '',
  status: 'all',
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

function getFilteredAnimes(): Anime[] {
  const term = state.search.trim().toLowerCase();

  return state.animes
    .filter((anime) => state.status === 'all' || anime.status === state.status)
    .filter((anime) => {
      const searchable = [
        anime.title,
        anime.synopsis ?? '',
        anime.year?.toString() ?? '',
        ...anime.genres.map((genre) => genre.name),
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(term);
    })
    .sort((a, b) => b.avg_score - a.avg_score || a.title.localeCompare(b.title));
}

function selectedAnime(): Anime | undefined {
  return state.animes.find((anime) => anime.id === state.selectedAnimeId);
}

function editingAnime(): Anime | undefined {
  return state.animes.find((anime) => anime.id === state.editingAnimeId);
}

function escapeHtml(value: string): string {
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
    const [animes, genres] = await Promise.all([
      api<Anime[]>('/animes'),
      api<Genre[]>('/genres'),
    ]);

    state.animes = animes;
    state.genres = genres;
    state.selectedAnimeId = animes[0]?.id ?? null;
    await loadSeasons();
    state.notice = 'Datos sincronizados';
  } catch (error) {
    state.notice = `No se pudo conectar con el API: ${(error as Error).message}`;
  } finally {
    state.loading = false;
    render();
  }
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
    await refreshAnimes();
  } catch (error) {
    state.notice = `No se pudo guardar: ${(error as Error).message}`;
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

async function removeAnime(id: number): Promise<void> {
  const anime = state.animes.find((item) => item.id === id);
  const confirmed = window.confirm(`Eliminar ${anime?.title ?? 'este anime'}?`);
  if (!confirmed) return;

  try {
    await api<void>(`/animes/${id}`, { method: 'DELETE' });
    if (state.selectedAnimeId === id) {
      state.selectedAnimeId = null;
    }
    state.notice = 'Anime eliminado';
    await refreshAnimes();
  } catch (error) {
    state.notice = `No se pudo eliminar: ${(error as Error).message}`;
    render();
  }
}

async function saveGenre(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();

  if (!name) return;

  try {
    await api<Genre>('/genres', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    form.reset();
    state.genres = await api<Genre[]>('/genres');
    state.notice = 'Genero creado';
    render();
  } catch (error) {
    state.notice = `No se pudo crear el genero: ${(error as Error).message}`;
    render();
  }
}

async function saveSeason(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);

  if (!state.selectedAnimeId) return;

  const payload = {
    anime_id: state.selectedAnimeId,
    number: Number(data.get('number')),
    title: String(data.get('title') ?? '').trim() || undefined,
    year: asNumber(data.get('year')),
  };

  try {
    await api<Season>('/seasons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    form.reset();
    await loadSeasons();
    state.notice = 'Temporada creada';
    render();
  } catch (error) {
    state.notice = `No se pudo crear la temporada: ${(error as Error).message}`;
    render();
  }
}

function renderAnimeList(animes: Anime[]): string {
  if (state.loading) {
    return '<div class="empty">Cargando animes...</div>';
  }

  if (!animes.length) {
    return '<div class="empty">No hay animes para estos filtros.</div>';
  }

  return animes
    .map((anime) => {
      const isSelected = anime.id === state.selectedAnimeId;
      const cover = anime.cover_url
        ? `<img src="${escapeHtml(anime.cover_url)}" alt="${escapeHtml(anime.title)}" />`
        : `<div class="cover-placeholder">${escapeHtml(anime.title.slice(0, 2).toUpperCase())}</div>`;

      return `
        <article class="anime-row ${isSelected ? 'is-selected' : ''}" data-select-anime="${anime.id}">
          <div class="cover">${cover}</div>
          <div class="anime-main">
            <div class="anime-title-line">
              <h3>${escapeHtml(anime.title)}</h3>
              <span class="score">${Number(anime.avg_score ?? 0).toFixed(1)}</span>
            </div>
            <p>${escapeHtml(anime.synopsis || 'Sin sinopsis registrada.')}</p>
            <div class="meta">
              <span>${statusLabels[anime.status]}</span>
              <span>${anime.year ?? 'Sin ano'}</span>
              <span>${anime.ratings_count ?? 0} votos</span>
            </div>
            <div class="chips">
              ${anime.genres.map((genre) => `<span>${escapeHtml(genre.name)}</span>`).join('')}
            </div>
          </div>
          <div class="row-actions">
            <button type="button" title="Editar" data-edit-anime="${anime.id}">Editar</button>
            <button type="button" title="Eliminar" data-delete-anime="${anime.id}">Eliminar</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderForm(): string {
  const anime = editingAnime();
  const genreIds = new Set(anime?.genres.map((genre) => genre.id) ?? []);

  return `
    <form class="panel form-panel" id="anime-form">
      <div class="panel-title">
        <div>
          <span>Anime</span>
          <h2>${anime ? 'Editar registro' : 'Nuevo registro'}</h2>
        </div>
        ${
          anime
            ? '<button class="ghost" type="button" id="cancel-edit">Cancelar</button>'
            : ''
        }
      </div>

      <label>
        Titulo
        <input name="title" maxlength="255" value="${escapeHtml(anime?.title ?? '')}" required />
      </label>

      <label>
        Sinopsis
        <textarea name="synopsis" rows="4">${escapeHtml(anime?.synopsis ?? '')}</textarea>
      </label>

      <div class="form-grid">
        <label>
          Estado
          <select name="status">
            ${statusOptions
              .map(
                (status) =>
                  `<option value="${status}" ${anime?.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`,
              )
              .join('')}
          </select>
        </label>
        <label>
          Ano
          <input name="year" type="number" min="1900" max="2100" value="${anime?.year ?? ''}" />
        </label>
      </div>

      <label>
        URL de portada
        <input name="cover_url" maxlength="500" value="${escapeHtml(anime?.cover_url ?? '')}" />
      </label>

      <fieldset>
        <legend>Generos</legend>
        <div class="genre-options">
          ${
            state.genres.length
              ? state.genres
                  .map(
                    (genre) => `
                    <label class="check">
                      <input type="checkbox" name="genreIds" value="${genre.id}" ${genreIds.has(genre.id) ? 'checked' : ''} />
                      <span>${escapeHtml(genre.name)}</span>
                    </label>
                  `,
                  )
                  .join('')
              : '<p class="muted">Crea generos para asignarlos.</p>'
          }
        </div>
      </fieldset>

      <button class="primary" type="submit">${anime ? 'Guardar cambios' : 'Crear anime'}</button>
    </form>
  `;
}

function renderSidePanel(): string {
  const anime = selectedAnime();

  return `
    <section class="panel detail-panel">
      <div class="panel-title">
        <div>
          <span>Detalle</span>
          <h2>${anime ? escapeHtml(anime.title) : 'Selecciona un anime'}</h2>
        </div>
      </div>
      ${
        anime
          ? `
          <dl class="stats">
            <div><dt>Puntaje</dt><dd>${Number(anime.avg_score ?? 0).toFixed(2)}</dd></div>
            <div><dt>Votos</dt><dd>${anime.ratings_count ?? 0}</dd></div>
            <div><dt>Temporadas</dt><dd>${state.seasons.length}</dd></div>
          </dl>

          <form class="mini-form" id="season-form">
            <input name="number" type="number" min="1" placeholder="Temporada" required />
            <input name="title" placeholder="Titulo" />
            <input name="year" type="number" min="1900" max="2100" placeholder="Ano" />
            <button type="submit">Agregar</button>
          </form>

          <div class="season-list">
            ${
              state.seasons.length
                ? state.seasons
                    .map(
                      (season) => `
                      <div class="season-item">
                        <strong>T${season.number}</strong>
                        <span>${escapeHtml(season.title ?? 'Sin titulo')}</span>
                        <small>${season.year ?? 'Sin ano'} · ${Number(season.avg_score ?? 0).toFixed(1)}</small>
                      </div>
                    `,
                    )
                    .join('')
                : '<p class="muted">Sin temporadas registradas.</p>'
            }
          </div>
        `
          : '<p class="muted">Elige un registro del listado para ver temporadas y metricas.</p>'
      }
    </section>

    <form class="panel mini-form stacked" id="genre-form">
      <div class="panel-title compact">
        <div>
          <span>Catalogo</span>
          <h2>Generos</h2>
        </div>
      </div>
      <input name="name" maxlength="100" placeholder="Nuevo genero" />
      <button type="submit">Crear genero</button>
    </form>
  `;
}

function render(): void {
  const filtered = getFilteredAnimes();
  const ranking = state.animes
    .slice()
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 3);

  root.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <span class="eyebrow">Anime Ranking</span>
          <h1>Panel CRUD de anime</h1>
        </div>
        <button class="primary" type="button" id="refresh">Sincronizar</button>
      </header>

      <section class="summary">
        <div><span>Total</span><strong>${state.animes.length}</strong></div>
        <div><span>Generos</span><strong>${state.genres.length}</strong></div>
        <div><span>Top</span><strong>${ranking[0]?.title ? escapeHtml(ranking[0].title) : '-'}</strong></div>
      </section>

      <section class="workspace">
        <div class="content-column">
          <section class="toolbar">
            <input id="search" value="${escapeHtml(state.search)}" placeholder="Buscar por titulo, genero o ano" />
            <select id="status-filter">
              <option value="all">Todos los estados</option>
              ${statusOptions
                .map(
                  (status) =>
                    `<option value="${status}" ${state.status === status ? 'selected' : ''}>${statusLabels[status]}</option>`,
                )
                .join('')}
            </select>
          </section>

          <section class="list">
            ${renderAnimeList(filtered)}
          </section>
        </div>

        <aside class="side-column">
          ${renderForm()}
          ${renderSidePanel()}
        </aside>
      </section>

      <div class="notice">${escapeHtml(state.notice)}</div>
    </main>
  `;

  wireEvents();
}

function wireEvents(): void {
  document.querySelector('#refresh')?.addEventListener('click', () => void loadData());
  document.querySelector('#anime-form')?.addEventListener('submit', (event) => void saveAnime(event as SubmitEvent));
  document.querySelector('#genre-form')?.addEventListener('submit', (event) => void saveGenre(event as SubmitEvent));
  document.querySelector('#season-form')?.addEventListener('submit', (event) => void saveSeason(event as SubmitEvent));
  document.querySelector('#cancel-edit')?.addEventListener('click', () => {
    state.editingAnimeId = null;
    render();
  });

  document.querySelector('#search')?.addEventListener('input', (event) => {
    state.search = (event.target as HTMLInputElement).value;
    render();
  });

  document.querySelector('#status-filter')?.addEventListener('change', (event) => {
    state.status = (event.target as HTMLSelectElement).value as ViewState['status'];
    render();
  });

  document.querySelectorAll<HTMLElement>('[data-select-anime]').forEach((item) => {
    item.addEventListener('click', async () => {
      state.selectedAnimeId = Number(item.dataset.selectAnime);
      await loadSeasons();
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-edit-anime]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      state.editingAnimeId = Number(button.dataset.editAnime);
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-delete-anime]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      void removeAnime(Number(button.dataset.deleteAnime));
    });
  });
}

void loadData();
