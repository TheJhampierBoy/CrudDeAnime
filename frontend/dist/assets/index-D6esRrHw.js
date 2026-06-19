(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function s(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(a){if(a.ep)return;a.ep=!0;const l=s(a);fetch(a.href,l)}})();const $="http://localhost:3000",v=["airing","finished","upcoming","cancelled","hiatus"],g={airing:"En emision",finished:"Finalizado",upcoming:"Proximo",cancelled:"Cancelado",hiatus:"En pausa"},n={animes:[],genres:[],seasons:[],selectedAnimeId:null,editingAnimeId:null,search:"",status:"all",loading:!0,notice:""},f=document.querySelector("#app");if(!f)throw new Error("App root not found");const A=f;async function c(t,e={}){const s=await fetch(`${$}${t}`,{...e,headers:{"Content-Type":"application/json",...e.headers}});if(!s.ok){const i=await s.text();throw new Error(i||`HTTP ${s.status}`)}if(s.status!==204)return s.json()}function S(){const t=n.search.trim().toLowerCase();return n.animes.filter(e=>n.status==="all"||e.status===n.status).filter(e=>{var i;return[e.title,e.synopsis??"",((i=e.year)==null?void 0:i.toString())??"",...e.genres.map(a=>a.name)].join(" ").toLowerCase().includes(t)}).sort((e,s)=>s.avg_score-e.avg_score||e.title.localeCompare(s.title))}function w(){return n.animes.find(t=>t.id===n.selectedAnimeId)}function E(){return n.animes.find(t=>t.id===n.editingAnimeId)}function o(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function y(t){const e=Number(t);return Number.isFinite(e)&&e>0?e:void 0}function I(t){const e=new FormData(t),s=e.getAll("genreIds").map(Number).filter(i=>Number.isInteger(i));return{title:String(e.get("title")??"").trim(),synopsis:String(e.get("synopsis")??"").trim()||void 0,status:String(e.get("status")??"upcoming"),year:y(e.get("year")),cover_url:String(e.get("cover_url")??"").trim()||void 0,genreIds:s}}async function h(){var t;n.loading=!0,d();try{const[e,s]=await Promise.all([c("/animes"),c("/genres")]);n.animes=e,n.genres=s,n.selectedAnimeId=((t=e[0])==null?void 0:t.id)??null,await m(),n.notice="Datos sincronizados"}catch(e){n.notice=`No se pudo conectar con el API: ${e.message}`}finally{n.loading=!1,d()}}async function m(){if(!n.selectedAnimeId){n.seasons=[];return}n.seasons=await c(`/seasons/anime/${n.selectedAnimeId}`)}async function N(t){t.preventDefault();const e=t.currentTarget,s=I(e);if(!s.title){n.notice="El titulo es obligatorio",d();return}try{if(n.editingAnimeId)await c(`/animes/${n.editingAnimeId}`,{method:"PUT",body:JSON.stringify(s)}),n.notice="Anime actualizado";else{const i=await c("/animes",{method:"POST",body:JSON.stringify(s)});n.selectedAnimeId=i.id,n.notice="Anime creado"}n.editingAnimeId=null,await b()}catch(i){n.notice=`No se pudo guardar: ${i.message}`,d()}}async function b(){n.animes=await c("/animes"),!n.selectedAnimeId&&n.animes.length&&(n.selectedAnimeId=n.animes[0].id),await m(),d()}async function L(t){const e=n.animes.find(i=>i.id===t);if(window.confirm(`Eliminar ${(e==null?void 0:e.title)??"este anime"}?`))try{await c(`/animes/${t}`,{method:"DELETE"}),n.selectedAnimeId===t&&(n.selectedAnimeId=null),n.notice="Anime eliminado",await b()}catch(i){n.notice=`No se pudo eliminar: ${i.message}`,d()}}async function T(t){t.preventDefault();const e=t.currentTarget,s=new FormData(e),i=String(s.get("name")??"").trim();if(i)try{await c("/genres",{method:"POST",body:JSON.stringify({name:i})}),e.reset(),n.genres=await c("/genres"),n.notice="Genero creado",d()}catch(a){n.notice=`No se pudo crear el genero: ${a.message}`,d()}}async function P(t){t.preventDefault();const e=t.currentTarget,s=new FormData(e);if(!n.selectedAnimeId)return;const i={anime_id:n.selectedAnimeId,number:Number(s.get("number")),title:String(s.get("title")??"").trim()||void 0,year:y(s.get("year"))};try{await c("/seasons",{method:"POST",body:JSON.stringify(i)}),e.reset(),await m(),n.notice="Temporada creada",d()}catch(a){n.notice=`No se pudo crear la temporada: ${a.message}`,d()}}function _(t){return n.loading?'<div class="empty">Cargando animes...</div>':t.length?t.map(e=>{const s=e.id===n.selectedAnimeId,i=e.cover_url?`<img src="${o(e.cover_url)}" alt="${o(e.title)}" />`:`<div class="cover-placeholder">${o(e.title.slice(0,2).toUpperCase())}</div>`;return`
        <article class="anime-row ${s?"is-selected":""}" data-select-anime="${e.id}">
          <div class="cover">${i}</div>
          <div class="anime-main">
            <div class="anime-title-line">
              <h3>${o(e.title)}</h3>
              <span class="score">${Number(e.avg_score??0).toFixed(1)}</span>
            </div>
            <p>${o(e.synopsis||"Sin sinopsis registrada.")}</p>
            <div class="meta">
              <span>${g[e.status]}</span>
              <span>${e.year??"Sin ano"}</span>
              <span>${e.ratings_count??0} votos</span>
            </div>
            <div class="chips">
              ${e.genres.map(a=>`<span>${o(a.name)}</span>`).join("")}
            </div>
          </div>
          <div class="row-actions">
            <button type="button" title="Editar" data-edit-anime="${e.id}">Editar</button>
            <button type="button" title="Eliminar" data-delete-anime="${e.id}">Eliminar</button>
          </div>
        </article>
      `}).join(""):'<div class="empty">No hay animes para estos filtros.</div>'}function q(){const t=E(),e=new Set((t==null?void 0:t.genres.map(s=>s.id))??[]);return`
    <form class="panel form-panel" id="anime-form">
      <div class="panel-title">
        <div>
          <span>Anime</span>
          <h2>${t?"Editar registro":"Nuevo registro"}</h2>
        </div>
        ${t?'<button class="ghost" type="button" id="cancel-edit">Cancelar</button>':""}
      </div>

      <label>
        Titulo
        <input name="title" maxlength="255" value="${o((t==null?void 0:t.title)??"")}" required />
      </label>

      <label>
        Sinopsis
        <textarea name="synopsis" rows="4">${o((t==null?void 0:t.synopsis)??"")}</textarea>
      </label>

      <div class="form-grid">
        <label>
          Estado
          <select name="status">
            ${v.map(s=>`<option value="${s}" ${(t==null?void 0:t.status)===s?"selected":""}>${g[s]}</option>`).join("")}
          </select>
        </label>
        <label>
          Ano
          <input name="year" type="number" min="1900" max="2100" value="${(t==null?void 0:t.year)??""}" />
        </label>
      </div>

      <label>
        URL de portada
        <input name="cover_url" maxlength="500" value="${o((t==null?void 0:t.cover_url)??"")}" />
      </label>

      <fieldset>
        <legend>Generos</legend>
        <div class="genre-options">
          ${n.genres.length?n.genres.map(s=>`
                    <label class="check">
                      <input type="checkbox" name="genreIds" value="${s.id}" ${e.has(s.id)?"checked":""} />
                      <span>${o(s.name)}</span>
                    </label>
                  `).join(""):'<p class="muted">Crea generos para asignarlos.</p>'}
        </div>
      </fieldset>

      <button class="primary" type="submit">${t?"Guardar cambios":"Crear anime"}</button>
    </form>
  `}function O(){const t=w();return`
    <section class="panel detail-panel">
      <div class="panel-title">
        <div>
          <span>Detalle</span>
          <h2>${t?o(t.title):"Selecciona un anime"}</h2>
        </div>
      </div>
      ${t?`
          <dl class="stats">
            <div><dt>Puntaje</dt><dd>${Number(t.avg_score??0).toFixed(2)}</dd></div>
            <div><dt>Votos</dt><dd>${t.ratings_count??0}</dd></div>
            <div><dt>Temporadas</dt><dd>${n.seasons.length}</dd></div>
          </dl>

          <form class="mini-form" id="season-form">
            <input name="number" type="number" min="1" placeholder="Temporada" required />
            <input name="title" placeholder="Titulo" />
            <input name="year" type="number" min="1900" max="2100" placeholder="Ano" />
            <button type="submit">Agregar</button>
          </form>

          <div class="season-list">
            ${n.seasons.length?n.seasons.map(e=>`
                      <div class="season-item">
                        <strong>T${e.number}</strong>
                        <span>${o(e.title??"Sin titulo")}</span>
                        <small>${e.year??"Sin ano"} · ${Number(e.avg_score??0).toFixed(1)}</small>
                      </div>
                    `).join(""):'<p class="muted">Sin temporadas registradas.</p>'}
          </div>
        `:'<p class="muted">Elige un registro del listado para ver temporadas y metricas.</p>'}
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
  `}function d(){var s;const t=S(),e=n.animes.slice().sort((i,a)=>a.avg_score-i.avg_score).slice(0,3);A.innerHTML=`
    <main class="shell">
      <header class="topbar">
        <div>
          <span class="eyebrow">Anime Ranking</span>
          <h1>Panel CRUD de anime</h1>
        </div>
        <button class="primary" type="button" id="refresh">Sincronizar</button>
      </header>

      <section class="summary">
        <div><span>Total</span><strong>${n.animes.length}</strong></div>
        <div><span>Generos</span><strong>${n.genres.length}</strong></div>
        <div><span>Top</span><strong>${(s=e[0])!=null&&s.title?o(e[0].title):"-"}</strong></div>
      </section>

      <section class="workspace">
        <div class="content-column">
          <section class="toolbar">
            <input id="search" value="${o(n.search)}" placeholder="Buscar por titulo, genero o ano" />
            <select id="status-filter">
              <option value="all">Todos los estados</option>
              ${v.map(i=>`<option value="${i}" ${n.status===i?"selected":""}>${g[i]}</option>`).join("")}
            </select>
          </section>

          <section class="list">
            ${_(t)}
          </section>
        </div>

        <aside class="side-column">
          ${q()}
          ${O()}
        </aside>
      </section>

      <div class="notice">${o(n.notice)}</div>
    </main>
  `,x()}function x(){var t,e,s,i,a,l,u;(t=document.querySelector("#refresh"))==null||t.addEventListener("click",()=>void h()),(e=document.querySelector("#anime-form"))==null||e.addEventListener("submit",r=>void N(r)),(s=document.querySelector("#genre-form"))==null||s.addEventListener("submit",r=>void T(r)),(i=document.querySelector("#season-form"))==null||i.addEventListener("submit",r=>void P(r)),(a=document.querySelector("#cancel-edit"))==null||a.addEventListener("click",()=>{n.editingAnimeId=null,d()}),(l=document.querySelector("#search"))==null||l.addEventListener("input",r=>{n.search=r.target.value,d()}),(u=document.querySelector("#status-filter"))==null||u.addEventListener("change",r=>{n.status=r.target.value,d()}),document.querySelectorAll("[data-select-anime]").forEach(r=>{r.addEventListener("click",async()=>{n.selectedAnimeId=Number(r.dataset.selectAnime),await m(),d()})}),document.querySelectorAll("[data-edit-anime]").forEach(r=>{r.addEventListener("click",p=>{p.stopPropagation(),n.editingAnimeId=Number(r.dataset.editAnime),d()})}),document.querySelectorAll("[data-delete-anime]").forEach(r=>{r.addEventListener("click",p=>{p.stopPropagation(),L(Number(r.dataset.deleteAnime))})})}h();
