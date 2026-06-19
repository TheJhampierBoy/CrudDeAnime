(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();const x="http://localhost:3000",y=["airing","finished","upcoming","cancelled","hiatus"],f={airing:"En emision",finished:"Finalizado",upcoming:"Proximo",cancelled:"Cancelado",hiatus:"Pausado"},S=["t-purple","t-teal","t-coral","t-blue","t-green"],e={view:"dashboard",animes:[],genres:[],seasons:[],allSeasons:[],search:"",status:"all",genreId:"all",editingAnimeId:null,selectedAnimeId:null,loading:!0,notice:""},N=document.querySelector("#app");if(!N)throw new Error("App root not found");const m=N;async function v(a,t={}){const s=await fetch(`${x}${a}`,{...t,headers:{"Content-Type":"application/json",...t.headers}});if(!s.ok){const n=await s.text();throw new Error(n||`HTTP ${s.status}`)}if(s.status!==204)return s.json()}function d(a){return a.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[t])}function w(a){return Number(a.avg_score??0).toFixed(1)}function T(a){return a.genres[0]}function G(){const a=e.search.trim().toLowerCase();return e.animes.filter(t=>e.status==="all"||t.status===e.status).filter(t=>e.genreId==="all"||t.genres.some(s=>s.id===e.genreId)).filter(t=>{var n;return[t.title,t.synopsis??"",((n=t.year)==null?void 0:n.toString())??"",...t.genres.map(i=>i.name)].join(" ").toLowerCase().includes(a)}).sort((t,s)=>Number(s.avg_score??0)-Number(t.avg_score??0)||t.title.localeCompare(s.title))}function L(a=5){return e.animes.slice().sort((t,s)=>Number(s.avg_score??0)-Number(t.avg_score??0)).slice(0,a)}function D(){return e.animes.find(a=>a.id===e.editingAnimeId)}function p(a){return e.view===a?"active":""}function j(a){return a==="finished"?"st-done":a==="airing"?"st-airing":"st-pause"}function I(a){return S[a%S.length]}function k(a){return a.split(" ").filter(Boolean).slice(0,2).map(t=>t[0]).join("").toUpperCase()}function A(a){const t=Number(a);return Number.isFinite(t)&&t>0?t:void 0}function C(a){const t=new FormData(a),s=t.getAll("genreIds").map(Number).filter(n=>Number.isInteger(n));return{title:String(t.get("title")??"").trim(),synopsis:String(t.get("synopsis")??"").trim()||void 0,status:String(t.get("status")??"upcoming"),year:A(t.get("year")),cover_url:String(t.get("cover_url")??"").trim()||void 0,genreIds:s}}async function R(){var a;e.loading=!0,l();try{const[t,s,n]=await Promise.all([v("/animes"),v("/genres"),v("/seasons")]);e.animes=t,e.genres=s,e.allSeasons=n,e.selectedAnimeId=e.selectedAnimeId??((a=t[0])==null?void 0:a.id)??null,await h(),e.notice="Datos sincronizados"}catch(t){e.notice=`No se pudo conectar con el API: ${t.message}`}finally{e.loading=!1,l()}}async function P(){e.animes=await v("/animes"),!e.selectedAnimeId&&e.animes.length&&(e.selectedAnimeId=e.animes[0].id),await h(),l()}async function q(){e.genres=await v("/genres"),l()}async function _(){e.allSeasons=await v("/seasons"),await h(),l()}async function h(){if(!e.selectedAnimeId){e.seasons=[];return}e.seasons=await v(`/seasons/anime/${e.selectedAnimeId}`)}async function O(a){a.preventDefault();const t=a.currentTarget,s=C(t);if(!s.title){e.notice="El titulo es obligatorio",l();return}try{if(e.editingAnimeId)await v(`/animes/${e.editingAnimeId}`,{method:"PUT",body:JSON.stringify(s)}),e.notice="Anime actualizado";else{const n=await v("/animes",{method:"POST",body:JSON.stringify(s)});e.selectedAnimeId=n.id,e.notice="Anime creado"}e.editingAnimeId=null,e.view="animes",await P()}catch(n){e.notice=`No se pudo guardar: ${n.message}`,l()}}async function M(a){const t=e.animes.find(n=>n.id===a);if(window.confirm(`Eliminar ${(t==null?void 0:t.title)??"este anime"}?`))try{await v(`/animes/${a}`,{method:"DELETE"}),e.selectedAnimeId===a&&(e.selectedAnimeId=null),e.notice="Anime eliminado",await P()}catch(n){e.notice=`No se pudo eliminar: ${n.message}`,l()}}async function E(a){if(a.trim())try{await v("/genres",{method:"POST",body:JSON.stringify({name:a})}),e.genres=await v("/genres"),e.notice="Genero creado",l()}catch(t){e.notice=`No se pudo crear el genero: ${t.message}`,l()}}async function F(a,t){if(t.trim())try{await v(`/genres/${a}`,{method:"PUT",body:JSON.stringify({name:t})}),e.notice="Genero actualizado",await q()}catch(s){e.notice=`No se pudo actualizar el genero: ${s.message}`,l()}}async function H(a){const t=e.genres.find(n=>n.id===a);if(window.confirm(`Eliminar ${(t==null?void 0:t.name)??"este genero"}?`))try{await v(`/genres/${a}`,{method:"DELETE"}),e.notice="Genero eliminado",await q()}catch(n){e.notice=`No se pudo eliminar el genero: ${n.message}`,l()}}async function V(a){a.preventDefault();const t=a.currentTarget,s=new FormData(t),n=A(s.get("anime_id"))??e.editingAnimeId??e.selectedAnimeId;if(!n){e.notice="Primero guarda o selecciona un anime",l();return}try{await v("/seasons",{method:"POST",body:JSON.stringify({anime_id:n,number:Number(s.get("number")),title:String(s.get("title")??"").trim()||void 0,year:A(s.get("year"))})}),t.reset(),e.selectedAnimeId=n,await _(),e.notice="Temporada creada",l()}catch(i){e.notice=`No se pudo crear la temporada: ${i.message}`,l()}}async function U(a){if(window.confirm("Eliminar esta temporada?"))try{await v(`/seasons/${a}`,{method:"DELETE"}),e.notice="Temporada eliminada",await _()}catch(s){e.notice=`No se pudo eliminar la temporada: ${s.message}`,l()}}function z(){return`
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-title"><span class="logo-mark">TV</span>AniBase</div>
        <div class="logo-sub">Anime Ranking v1.0</div>
      </div>
      <div class="nav-section">Principal</div>
      <button class="nav-item ${p("dashboard")}" data-view="dashboard"><span>DB</span>Dashboard</button>
      <button class="nav-item ${p("animes")}" data-view="animes"><span>AN</span>Animes</button>
      <button class="nav-item ${p("rankings")}" data-view="rankings"><span>RK</span>Rankings</button>
      <div class="nav-section">Catalogo</div>
      <button class="nav-item ${p("genres")}" data-view="genres"><span>GE</span>Generos</button>
      <button class="nav-item ${p("episodes")}" data-view="episodes"><span>EP</span>Episodios</button>
      <button class="nav-item ${p("seasons")}" data-view="seasons"><span>TE</span>Temporadas</button>
      <button class="nav-item ${p("reviews")}" data-view="reviews"><span>RS</span>Resenas</button>
      <div class="nav-section">Sistema</div>
      <button class="nav-item ${p("tags")}" data-view="tags"><span>TA</span>Tags</button>
      <button class="nav-item ${p("platforms")}" data-view="platforms"><span>PL</span>Plataformas</button>
      <button class="nav-item ${p("statuses")}" data-view="statuses"><span>ST</span>Estados</button>
    </aside>
  `}function b(a,t,s){return`
    <main class="app-shell">
      ${z()}
      <section class="main">
        <header class="topbar">
          <div class="topbar-title">${a}</div>
          <div class="topbar-actions">${t}</div>
        </header>
        <div class="content">
          ${s}
        </div>
        <div class="notice">${d(e.notice)}</div>
      </section>
    </main>
  `}function B(){const a=e.animes.slice(-3).reverse(),t=L(5),s=e.animes.length>0?(e.animes.reduce((r,c)=>r+Number(c.avg_score??0),0)/e.animes.length).toFixed(1):"0.0",n=`
    <div class="search-box small">
      <span class="mini-icon">/</span>
      <input id="search" type="text" value="${d(e.search)}" placeholder="Buscar anime..." />
    </div>
    <button class="btn-primary" data-new-anime><span>+</span>Nuevo anime</button>
  `,i=`
    <div class="stats-row">
      <div class="stat-card"><div class="stat-label">Total animes</div><div class="stat-val">${e.animes.length}</div><div class="stat-sub">CRUD activo</div></div>
      <div class="stat-card"><div class="stat-label">Generos</div><div class="stat-val">${e.genres.length}</div><div class="stat-sub">Catalogo disponible</div></div>
      <div class="stat-card"><div class="stat-label">Resenas</div><div class="stat-val">${e.animes.reduce((r,c)=>r+Number(c.ratings_count??0),0)}</div><div class="stat-sub">Promedio: ${s}</div></div>
      <div class="stat-card"><div class="stat-label">Estados</div><div class="stat-val">${y.length}</div><div class="stat-sub">Emision, finalizado...</div></div>
    </div>

    <div class="section-header">
      <div class="section-title">Animes recientes</div>
      <button class="act-btn" data-view="animes">Ver todos <span>></span></button>
    </div>

    <div class="anime-grid">
      ${a.length?a.map(J).join(""):'<div class="empty wide">Aun no hay animes registrados.</div>'}
    </div>

    <div class="section-header">
      <div class="section-title">Top ranking</div>
      <button class="act-btn" data-view="rankings">Ver ranking completo <span>></span></button>
    </div>

    <div class="ranking-table">
      <div class="rt-head">
        <div>#</div><div>Anime</div><div>Temporadas</div><div>Ano</div><div>Resenas</div><div>Score</div>
      </div>
      ${t.length?t.map((r,c)=>`
                <div class="rt-row">
                  <div class="rank-num ${c<3?`rank-${c+1}`:""}">${c+1}</div>
                  <div>${d(r.title)}</div>
                  <div>${r.id===e.selectedAnimeId?e.seasons.length:"-"}</div>
                  <div>${r.year??"-"}</div>
                  <div>${r.ratings_count??0}</div>
                  <div><span class="score-pill">${w(r)}</span></div>
                </div>
              `).join(""):'<div class="empty">Sin datos para ranking.</div>'}
    </div>
  `;return b("Dashboard",n,i)}function J(a,t=0){const s=T(a);return`
    <article class="anime-card">
      <div class="anime-cover ${I(t)}">${a.cover_url?`<img src="${d(a.cover_url)}" alt="${d(a.title)}" />`:k(a.title)}</div>
      <div class="anime-info">
        <div class="anime-name">${d(a.title)}</div>
        <div class="anime-meta">
          ${s?`<span class="badge badge-genre">${d(s.name)}</span>`:'<span class="badge badge-muted">Sin genero</span>'}
          <span class="badge badge-status">${f[a.status]}</span>
        </div>
        <div class="anime-score"><span>*</span>${w(a)} · ${a.year??"Sin ano"}</div>
      </div>
      <div class="anime-actions">
        <button class="act-btn" data-select-anime="${a.id}">Ver</button>
        <button class="act-btn" data-edit-anime="${a.id}">Editar</button>
        <button class="act-btn danger" data-delete-anime="${a.id}">Eliminar</button>
      </div>
    </article>
  `}function K(){const a=G(),t=`
    <button class="btn-primary" data-new-anime><span>+</span>Nuevo anime</button>
  `,s=e.loading?'<div class="empty">Cargando animes...</div>':a.length?a.map((i,r)=>{const c=T(i);return`
              <div class="td-row" data-select-anime="${i.id}">
                <div class="anime-thumb ${I(r)}">${i.cover_url?`<img src="${d(i.cover_url)}" alt="${d(i.title)}" />`:k(i.title)}</div>
                <div class="anime-title-cell">
                  <span class="anime-title-main">${d(i.title)}</span>
                  <span class="anime-title-sub">${d(i.synopsis||"Sin sinopsis registrada")}</span>
                </div>
                <div>${c?`<span class="badge badge-action">${d(c.name)}</span>`:'<span class="badge badge-muted">Sin genero</span>'}</div>
                <div><span class="status-pill ${j(i.status)}">${f[i.status]}</span></div>
                <div>${i.year??"-"}</div>
                <div class="score-val"><span>*</span>${w(i)}</div>
                <div class="td-actions">
                  <button class="icon-btn" data-select-anime="${i.id}" aria-label="Ver detalle">Ver</button>
                  <button class="icon-btn" data-edit-anime="${i.id}" aria-label="Editar">Ed</button>
                  <button class="icon-btn danger" data-delete-anime="${i.id}" aria-label="Eliminar">X</button>
                </div>
              </div>
            `}).join(""):'<div class="empty">No hay animes para estos filtros.</div>',n=`
    <div class="filters-bar">
      <div class="search-box">
        <span class="mini-icon">/</span>
        <input id="search" type="text" value="${d(e.search)}" placeholder="Buscar por titulo..." />
      </div>
      <select id="genre-filter" class="filter-select">
        <option value="all">Todos los generos</option>
        ${e.genres.map(i=>`<option value="${i.id}" ${e.genreId===i.id?"selected":""}>${d(i.name)}</option>`).join("")}
      </select>
      <select id="status-filter" class="filter-select">
        <option value="all">Todos los estados</option>
        ${y.map(i=>`<option value="${i}" ${e.status===i?"selected":""}>${f[i]}</option>`).join("")}
      </select>
      <select class="filter-select" disabled>
        <option>Plataforma</option>
      </select>
      <div class="view-toggle">
        <button class="vt-btn active" title="Vista de tabla">=</button>
        <button class="vt-btn" title="Vista de grilla">#</button>
      </div>
    </div>

    <div class="results-info">Mostrando ${a.length} de ${e.animes.length} animes</div>

    <div class="anime-table">
      <div class="th-row">
        <div></div><div>Titulo</div><div>Genero</div><div>Estado</div><div>Ano</div><div>Score</div><div>Acciones</div>
      </div>
      ${s}
    </div>

    <div class="pagination">
      <div class="pg-info">Pagina 1 de 1</div>
      <div class="pg-btns">
        <button class="pg-btn active">1</button>
      </div>
    </div>
  `;return b("Animes",t,n)}function X(){const a=L(e.animes.length||10),t=`
    <button class="btn-ghost" data-view="dashboard">Dashboard</button>
    <button class="btn-primary" data-view="animes"><span>></span>Ver animes</button>
  `,s=`
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
      ${a.length?a.map((n,i)=>`
                  <div class="rt-row">
                    <div class="rank-num ${i<3?`rank-${i+1}`:""}">${i+1}</div>
                    <div>${d(n.title)}</div>
                    <div>${n.genres.length||"-"}</div>
                    <div>${n.year??"-"}</div>
                    <div>${n.ratings_count??0}</div>
                    <div><span class="score-pill">${w(n)}</span></div>
                  </div>
                `).join(""):'<div class="empty">No hay animes para rankear.</div>'}
    </div>
  `;return b("Rankings",t,s)}function Q(){const a='<button class="btn-primary" data-view="form"><span>+</span>Nuevo anime</button>',t=`
    <form class="management-form" id="genre-create-form">
      <input name="name" maxlength="100" placeholder="Nuevo genero" required />
      <button type="submit">Crear genero</button>
    </form>

    <div class="management-grid">
      ${e.genres.length?e.genres.map(s=>{const n=e.animes.filter(i=>i.genres.some(r=>r.id===s.id)).length;return`
                  <article class="management-card">
                    <form class="genre-update-form" data-genre-id="${s.id}">
                      <input name="name" maxlength="100" value="${d(s.name)}" />
                      <button type="submit">Guardar</button>
                    </form>
                    <div class="card-meta">${n} animes asociados</div>
                    <button class="act-btn danger" data-delete-genre="${s.id}">Eliminar</button>
                  </article>
                `}).join(""):'<div class="empty wide">No hay generos registrados.</div>'}
    </div>
  `;return b("Generos",a,t)}function W(){const a='<button class="btn-primary" data-view="form"><span>+</span>Nuevo anime</button>',t=`
    <form class="management-form" id="season-form">
      <select name="anime_id" required>
        <option value="">Anime</option>
        ${e.animes.map(s=>`<option value="${s.id}" ${e.selectedAnimeId===s.id?"selected":""}>${d(s.title)}</option>`).join("")}
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
      ${e.allSeasons.length?e.allSeasons.map(s=>{const n=e.animes.find(i=>i.id===s.anime_id);return`
                  <div class="season-row">
                    <div>${d((n==null?void 0:n.title)??`Anime ${s.anime_id}`)}</div>
                    <div>${s.number}</div>
                    <div>${d(s.title??"Sin titulo")}</div>
                    <div>${s.year??"-"}</div>
                    <div>${Number(s.avg_score??0).toFixed(1)}</div>
                    <div><button class="icon-btn danger" data-delete-season="${s.id}">X</button></div>
                  </div>
                `}).join(""):'<div class="empty">No hay temporadas registradas.</div>'}
    </div>
  `;return b("Temporadas",a,t)}function Y(){const a='<button class="btn-primary" data-new-anime><span>+</span>Nuevo anime</button>',t=`
    <div class="stats-row">
      ${y.map(s=>{const n=e.animes.filter(i=>i.status===s).length;return`<button class="stat-card stat-button" data-status-shortcut="${s}"><div class="stat-label">${f[s]}</div><div class="stat-val">${n}</div><div class="stat-sub">Ver filtrados</div></button>`}).join("")}
    </div>
  `;return b("Estados",a,t)}function $(a,t,s){const n='<button class="btn-primary" data-view="form"><span>+</span>Nuevo anime</button>',i=`
    <section class="prepared-panel">
      <div class="section-title">${t}</div>
      <p>${s}</p>
      <div class="prepared-grid">
        <div class="stat-card"><div class="stat-label">Backend</div><div class="stat-val">Pendiente</div><div class="stat-sub">Agregar modulo ${a}</div></div>
        <div class="stat-card"><div class="stat-label">Datos base</div><div class="stat-val">${e.animes.length}</div><div class="stat-sub">Animes disponibles</div></div>
        <div class="stat-card"><div class="stat-label">UI</div><div class="stat-val">Lista</div><div class="stat-sub">Vista ya navegable</div></div>
      </div>
    </section>
  `;return b(t,n,i)}function Z(){const a=D(),t=new Set((a==null?void 0:a.genres.map(r=>r.id))??[]),s=e.seasons.filter(r=>r.anime_id===((a==null?void 0:a.id)??e.selectedAnimeId)),n=`
    <button class="btn-ghost" data-view="animes">Cancelar</button>
    <button class="btn-primary" form="anime-form"><span>+</span>Guardar</button>
  `,i=`
    <form class="form-layout" id="anime-form">
      <div>
        <section class="form-card">
          <div class="form-card-title"><span>i</span>Informacion basica</div>
          <div class="field">
            <label class="field-label" for="title">Titulo <span class="required">*</span></label>
            <input id="title" name="title" maxlength="255" value="${d((a==null?void 0:a.title)??"")}" placeholder="Ej: Attack on Titan" required />
          </div>
          <div class="field">
            <label class="field-label" for="synopsis">Sinopsis</label>
            <textarea id="synopsis" name="synopsis" placeholder="Describe la historia, tono o premisa...">${d((a==null?void 0:a.synopsis)??"")}</textarea>
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field-label" for="year">Ano</label>
              <input id="year" name="year" type="number" min="1900" max="2100" value="${(a==null?void 0:a.year)??""}" placeholder="Ej: 2013" />
            </div>
            <div class="field">
              <label class="field-label" for="status">Estado <span class="required">*</span></label>
              <select id="status" name="status">
                ${y.map(r=>`<option value="${r}" ${(a==null?void 0:a.status)===r?"selected":""}>${f[r]}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="cover_url">URL de portada</label>
            <input id="cover_url" name="cover_url" maxlength="500" value="${d((a==null?void 0:a.cover_url)??"")}" placeholder="https://..." />
            <div class="field-hint">JPG, PNG o WebP desde una URL publica.</div>
          </div>
        </section>

        <section class="form-card">
          <div class="form-card-title"><span>#</span>Generos</div>
          <div class="field-label">Selecciona uno o mas generos</div>
          <div class="genre-grid">
            ${e.genres.length?e.genres.map(r=>`
                        <label class="genre-chip ${t.has(r.id)?"selected":""}">
                          <input type="checkbox" name="genreIds" value="${r.id}" ${t.has(r.id)?"checked":""} />
                          ${d(r.name)}
                        </label>
                      `).join(""):'<div class="muted">Crea generos desde el panel lateral.</div>'}
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
          <div class="image-preview">${a!=null&&a.cover_url?`<img src="${d(a.cover_url)}" alt="${d(a.title)}" />`:"AN"}</div>
          <div class="preview-actions">
            <button class="preview-btn" type="button">Subir</button>
            <button class="preview-btn" type="button">URL</button>
            <button class="preview-btn danger" type="button">Quitar</button>
          </div>
        </section>

        <section class="form-card">
          <div class="form-card-title"><span>TE</span>Temporadas</div>
          <div class="season-stack">
            ${s.length?s.map(r=>`<div class="season-pill"><span>Temporada ${r.number}</span><small>${d(r.title??"Sin titulo")}</small></div>`).join(""):'<div class="muted">Sin temporadas registradas.</div>'}
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
  `;return b(a?"Editar anime":"Nuevo anime",n,i)}function l(){e.view==="dashboard"?m.innerHTML=B():e.view==="animes"?m.innerHTML=K():e.view==="form"?m.innerHTML=Z():e.view==="rankings"?m.innerHTML=X():e.view==="genres"?m.innerHTML=Q():e.view==="seasons"?m.innerHTML=W():e.view==="statuses"?m.innerHTML=Y():e.view==="episodes"?m.innerHTML=$("episodes","Episodios","Pantalla preparada para listar episodios cuando exista el modulo en el backend."):e.view==="reviews"?m.innerHTML=$("reviews","Resenas","Pantalla preparada para administrar resenas cuando exista el modulo en el backend."):e.view==="tags"?m.innerHTML=$("tags","Tags","Pantalla preparada para etiquetas cuando exista el catalogo en el backend."):m.innerHTML=$("platforms","Plataformas","Pantalla preparada para plataformas de streaming cuando exista el catalogo en el backend."),ee()}function ee(){var a,t,s,n,i,r,c;document.querySelectorAll("[data-view]").forEach(o=>{o.addEventListener("click",()=>{e.view=o.dataset.view,e.view!=="form"&&(e.editingAnimeId=null),l()})}),document.querySelectorAll("[data-new-anime]").forEach(o=>{o.addEventListener("click",()=>{e.editingAnimeId=null,e.view="form",l()})}),document.querySelectorAll("[data-edit-anime]").forEach(o=>{o.addEventListener("click",async u=>{u.stopPropagation(),e.editingAnimeId=Number(o.dataset.editAnime),e.selectedAnimeId=e.editingAnimeId,await h(),e.view="form",l()})}),document.querySelectorAll("[data-delete-anime]").forEach(o=>{o.addEventListener("click",u=>{u.stopPropagation(),M(Number(o.dataset.deleteAnime))})}),document.querySelectorAll("[data-select-anime]").forEach(o=>{o.addEventListener("click",async()=>{e.selectedAnimeId=Number(o.dataset.selectAnime),await h(),e.notice="Anime seleccionado",l()})}),(a=document.querySelector("#search"))==null||a.addEventListener("input",o=>{e.search=o.target.value,l()}),(t=document.querySelector("#status-filter"))==null||t.addEventListener("change",o=>{e.status=o.target.value,l()}),(s=document.querySelector("#genre-filter"))==null||s.addEventListener("change",o=>{const u=o.target.value;e.genreId=u==="all"?"all":Number(u),l()}),(n=document.querySelector("#anime-form"))==null||n.addEventListener("submit",o=>void O(o)),(i=document.querySelector("#season-form"))==null||i.addEventListener("submit",o=>void V(o)),(r=document.querySelector("#genre-create-form"))==null||r.addEventListener("submit",o=>{o.preventDefault();const u=o.currentTarget,g=new FormData(u);E(String(g.get("name")??"").trim())}),document.querySelectorAll(".genre-update-form").forEach(o=>{o.addEventListener("submit",u=>{u.preventDefault();const g=new FormData(o);F(Number(o.dataset.genreId),String(g.get("name")??"").trim())})}),document.querySelectorAll("[data-delete-genre]").forEach(o=>{o.addEventListener("click",()=>void H(Number(o.dataset.deleteGenre)))}),document.querySelectorAll("[data-delete-season]").forEach(o=>{o.addEventListener("click",()=>void U(Number(o.dataset.deleteSeason)))}),document.querySelectorAll("[data-status-shortcut]").forEach(o=>{o.addEventListener("click",()=>{e.status=o.dataset.statusShortcut,e.view="animes",l()})}),(c=document.querySelector("#create-genre"))==null||c.addEventListener("click",()=>{const o=document.querySelector("#genre-panel"),u=o==null?void 0:o.querySelector('input[name="name"]');if(!o||!u)return;const g=u.value.trim();u.value="",E(g)})}R();
