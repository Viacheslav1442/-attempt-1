import{a as H}from"./assets/vendor-B2YOV0tR.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const b=H.create({baseURL:"https://sound-wave.b.goit.study/api",timeout:5e3,headers:{"Content-Type":"application/json"}});b.interceptors.response.use(t=>t,t=>(alert("Сталася помилка при запиті до сервера. Спробуйте ще раз."),Promise.reject(t)));async function q(){try{return(await b.get("/artists")).data}catch(t){throw t}}async function F(t){try{return(await b.get(`/artists/${t}`)).data}catch(e){throw e}}const L=document.querySelector("[data-modal]"),I=document.getElementById("modal-inner-content"),M=document.querySelector("[data-modal-backdrop]"),T=document.getElementById("loader");function Y(){T.classList.remove("is-hidden")}function $(){T.classList.add("is-hidden")}function G(){L.classList.remove("is-hidden"),document.body.style.overflow="hidden",document.addEventListener("keydown",x)}function A(){L.classList.add("is-hidden"),document.body.style.overflow="",document.removeEventListener("keydown",x),I.innerHTML=""}function x(t){t.key==="Escape"&&A()}function K(t){t.target===M&&A()}L.addEventListener("click",t=>{t.target.closest("[data-modal-close]")&&A()});M.addEventListener("click",K);function R(t){const e=Math.floor(t/1e3),n=Math.floor(e/60),i=e%60;return`${n}:${i.toString().padStart(2,"0")}`}async function U(t){try{Y();const e=await F(t);$(),_(e)}catch(e){$(),console.error("Error fetching artist:",e),alert("Не вдалося завантажити інформацію про виконавця.")}}function _(t){const{strArtist:e,strArtistThumb:n,intFormedYear:i,intDiedYear:s,strGender:o,intMembers:a,strCountry:c,strBiographyEN:l,genres:u,albumsList:d}=t,m=a===1?`<li><strong>Sex:</strong> ${o||"—"}</li>`:`<li><strong>Members:</strong> ${a||"—"}</li>`,k=`
    <ul class="artist-meta-list">
      <li><strong>Years active:</strong> ${i&&s?`${i}–${s}`:i?`${i}–present`:"information missing"}</li>
      ${m}
      <li><strong>Country:</strong> ${c||"—"}</li>
    </ul>`,S=(u==null?void 0:u.map(g=>`<li>${g}</li>`).join(""))||"",D=(d==null?void 0:d.map(g=>{const{strAlbum:O,tracks:P}=g,B=P.map(p=>{const j=p.movie&&p.movie!=="null"?`<a href="${p.movie}" target="_blank" rel="noopener">
              <svg class="icon" width="24" height="24" fill="white">
                <use href="/-attempt-1/img/icons.svg#icon-youtube"></use>
              </svg>
            </a>`:"";return`<li><span>${p.strTrack}</span><span>${R(p.intDuration)}</span>${j}</li>`}).join("");return`
      <div class="album-card">
        <h4>${O}</h4>
        <div class="track-header">
          <span>Track</span><span>Time</span><span>Link</span>
        </div>
        <ul class="track-list">${B}</ul>
      </div>`}).join(""))||"";I.innerHTML=`
    <button class="artist-modal-close" type="button" data-modal-close>
      <svg class="icon" width="14" height="14" fill="white">
        <use href="/-attempt-1/img/icons.svg#icon-close"></use>
      </svg>
    </button>
    <h2 class="artist-modal-title">${e}</h2>
    <div class="artist-modal-info">
      <img src="${n||"https://placehold.co/300x300"}" alt="${e}" class="artist-modal-img" />
      <div class="artist-modal-bio">
        ${k}
        <div class="artist-bio">
          <h3 class="bio-title">Biography</h3>
          <p>${l||"—"}</p>
        </div>
        <ul class="artist-tags">${S}</ul>
      </div>
    </div>
    <div class="artist-albums">
      <h3>Albums</h3>
      <div class="album-grid">${D}</div>
    </div>
  `,G()}let f=0;const C=8;let y=[],h,r;function z(){document.body.classList.add("loading")}function J(){document.body.classList.remove("loading")}function v(){r==null||r.classList.add("hidden"),r==null||r.setAttribute("disabled",!0)}function Q(){r==null||r.classList.remove("hidden"),r==null||r.removeAttribute("disabled")}function V(t){return!t||typeof t!="object"?[]:Array.isArray(t.genres)&&t.genres.length>0?t.genres.filter(Boolean):[]}async function W(t){const e=document.createElement("li");e.className="artist-card";const n=document.createElement("img");n.src=t.strArtistThumb||"https://placehold.co/150x150/cccccc/333333?text=No+Image",n.alt=t.strArtist||"No Image",n.addEventListener("error",function(){this.src="https://placehold.co/150x150/cccccc/333333?text=No+Image",this.alt="No Image Available"}),e.appendChild(n);const i=document.createElement("h3");i.textContent=t.strArtist||"Unknown Artist",e.appendChild(i);const s=document.createElement("p");s.className="artist-description";const o=t.strBiographyEN||"No short info available.";s.textContent=o.length>200?o.slice(0,200)+"...":o,e.appendChild(s);const a=V(t);if(a.length>0){const d=document.createElement("ul");d.classList.add("artist-genres-list"),a.forEach(E=>{const m=document.createElement("li");m.classList.add("genres-list-item"),m.textContent=E,d.appendChild(m)}),e.appendChild(d)}const c=document.createElement("button");c.className="learn-more-btn",c.textContent="Learn More",c.dataset.artistId=t._id;const l=document.createElement("svg");l.setAttribute("class","learn-more-icon"),l.setAttribute("width","8"),l.setAttribute("height","16");const u=document.createElement("use");return u.setAttribute("href","/-attempt-1/img/icons.svg#icon-filled-arrow"),l.appendChild(u),c.appendChild(l),e.appendChild(c),e}async function w(){z();try{if(f===0){const e=await q(),n=Array.isArray(e==null?void 0:e.artists)?e.artists:null;if(!n){alert("Error: Received invalid data from server."),v();return}y=n,h.innerHTML=""}const t=y.slice(f,f+C);for(const e of t){const n=await W(e);h.appendChild(n)}f+=C,f>=y.length?v():Q()}catch{alert("Failed to load artists. Please try again later."),v()}finally{J()}}function N(){h=document.getElementById("artistsContainer"),r=document.getElementById("loadMoreBtn"),!(!h||!r)&&(r.onclick=w,w(),h.addEventListener("click",t=>{const e=t.target.closest(".learn-more-btn");if(e){const n=e.dataset.artistId;n&&U(n)}}))}document.addEventListener("DOMContentLoaded",()=>{N()});document.addEventListener("DOMContentLoaded",()=>{N()});
//# sourceMappingURL=index.js.map
