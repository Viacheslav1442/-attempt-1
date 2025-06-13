import { fetchArtistById } from './soundwave-api.js';

const modal = document.querySelector('[data-modal]');
const modalContent = document.getElementById('modal-inner-content');
const backdrop = document.querySelector('[data-modal-backdrop]');
const loader = document.getElementById('loader');

// ==== Лоадер ====
function showLoader() {
    loader.classList.remove('is-hidden');
}
function hideLoader() {
    loader.classList.add('is-hidden');
}

// ==== Модалка ====
function openModal() {
    modal.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEscKeyPress);
}

function closeModal() {
    modal.classList.add('is-hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onEscKeyPress);
    modalContent.innerHTML = '';
}

function onEscKeyPress(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function onBackdropClick(e) {
    if (e.target === backdrop) {
        closeModal();
    }
}

modal.addEventListener('click', e => {
    if (e.target.closest('[data-modal-close]')) {
        closeModal();
    }
});

backdrop.addEventListener('click', onBackdropClick);

// ==== Формат часу ====
function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

// ==== Відкрити модалку по id артиста ====
export async function openArtistModal(artistId) {
    try {
        showLoader();
        const data = await fetchArtistById(artistId);
        hideLoader();
        renderArtistModal(data);
    } catch (error) {
        hideLoader();
        console.error('Error fetching artist:', error);
        alert('Не вдалося завантажити інформацію про виконавця.');
    }
}

// ==== Рендер модалки ====
function renderArtistModal(data) {
    const {
        strArtist: name,
        strArtistThumb: image,
        intFormedYear,
        intDiedYear,
        strGender: sex,
        intMembers: members,
        strCountry: country,
        strBiographyEN: biography,
        genres,
        albumsList,
    } = data;

    const isSoloArtist = members === 1;
    const artistTypeInfo = isSoloArtist
        ? `<li><strong>Sex:</strong> ${sex || '—'}</li>`
        : `<li><strong>Members:</strong> ${members || '—'}</li>`;

    const yearsText =
        intFormedYear && intDiedYear
            ? `${intFormedYear}–${intDiedYear}`
            : intFormedYear
                ? `${intFormedYear}–present`
                : 'information missing';

    const metaHTML = `
    <ul class="artist-meta-list">
      <li><strong>Years active:</strong> ${yearsText}</li>
      ${artistTypeInfo}
      <li><strong>Country:</strong> ${country || '—'}</li>
    </ul>`;

    const tagsHTML = genres?.map(tag => `<li>${tag}</li>`).join('') || '';

    const albumsHTML =
        albumsList
            ?.map(album => {
                const { strAlbum, tracks } = album;
                const trackItems = tracks
                    .map(track => {
                        const link =
                            track.movie && track.movie !== 'null'
                                ? `<a href="${track.movie}" target="_blank" rel="noopener">
              <svg class="icon" width="24" height="24" fill="white">
                <use href="${import.meta.env.BASE_URL
                                }img/icons.svg#icon-youtube"></use>
              </svg>
            </a>`
                                : '';
                        return `<li><span>${track.strTrack}</span><span>${formatDuration(
                            track.intDuration
                        )}</span>${link}</li>`;
                    })
                    .join('');

                return `
      <div class="album-card">
        <h4>${strAlbum}</h4>
        <div class="track-header">
          <span>Track</span><span>Time</span><span>Link</span>
        </div>
        <ul class="track-list">${trackItems}</ul>
      </div>`;
            })
            .join('') || '';

    modalContent.innerHTML = `
    <button class="artist-modal-close" type="button" data-modal-close>
      <svg class="icon" width="14" height="14" fill="white">
        <use href="${import.meta.env.BASE_URL}img/icons.svg#icon-close"></use>
      </svg>
    </button>
    <h2 class="artist-modal-title">${name}</h2>
    <div class="artist-modal-info">
      <img src="${image || 'https://placehold.co/300x300'
        }" alt="${name}" class="artist-modal-img" />
      <div class="artist-modal-bio">
        ${metaHTML}
        <div class="artist-bio">
          <h3 class="bio-title">Biography</h3>
          <p>${biography || '—'}</p>
        </div>
        <ul class="artist-tags">${tagsHTML}</ul>
      </div>
    </div>
    <div class="artist-albums">
      <h3>Albums</h3>
      <div class="album-grid">${albumsHTML}</div>
    </div>
  `;

    openModal();
}