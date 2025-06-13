import { fetchArtists } from './soundwave-api.js';
import { openArtistModal } from './artist-details-modal.js';

let offset = 0;
const limit = 8;
let allArtists = [];

let artistsContainer;
let loadMoreBtn;

// ==== LOADER ====
function showLoader() {
    document.body.classList.add('loading');
}

function hideLoader() {
    document.body.classList.remove('loading');
}

// ==== HELPER ====
function disableLoadMoreButton() {
    loadMoreBtn?.classList.add('hidden');
    loadMoreBtn?.setAttribute('disabled', true);
}

function enableLoadMoreButton() {
    loadMoreBtn?.classList.remove('hidden');
    loadMoreBtn?.removeAttribute('disabled');
}

function getGenres(artist) {
    if (!artist || typeof artist !== 'object') return [];
    if (Array.isArray(artist.genres) && artist.genres.length > 0) {
        return artist.genres.filter(Boolean);
    }
    return [];
}

// ==== CARD GENERATION ====
async function createCard(artist) {
    const li = document.createElement('li');
    li.className = 'artist-card';

    const img = document.createElement('img');
    img.src =
        artist.strArtistThumb ||
        'https://placehold.co/150x150/cccccc/333333?text=No+Image';
    img.alt = artist.strArtist || 'No Image';
    img.addEventListener('error', function () {
        this.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
        this.alt = 'No Image Available';
    });
    li.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = artist.strArtist || 'Unknown Artist';
    li.appendChild(h3);

    const shortInfoP = document.createElement('p');
    shortInfoP.className = 'artist-description';
    const bio = artist.strBiographyEN || 'No short info available.';
    shortInfoP.textContent = bio.length > 200 ? bio.slice(0, 200) + '...' : bio;
    li.appendChild(shortInfoP);

    const genresList = getGenres(artist);
    if (genresList.length > 0) {
        const ul = document.createElement('ul');
        ul.classList.add('artist-genres-list');
        genresList.forEach(genre => {
            const genreLi = document.createElement('li');
            genreLi.classList.add('genres-list-item');
            genreLi.textContent = genre;
            ul.appendChild(genreLi);
        });
        li.appendChild(ul);
    }

    const learnMoreButton = document.createElement('button');
    learnMoreButton.className = 'learn-more-btn';
    learnMoreButton.textContent = 'Learn More';
    learnMoreButton.dataset.artistId = artist._id;

    const learnMoreIcon = document.createElement('svg');
    learnMoreIcon.setAttribute('class', 'learn-more-icon');
    learnMoreIcon.setAttribute('width', '8');
    learnMoreIcon.setAttribute('height', '16');

    const useElement = document.createElement('use');
    useElement.setAttribute(
        'href',
        `${import.meta.env.BASE_URL}img/icons.svg#icon-filled-arrow`
    );

    learnMoreIcon.appendChild(useElement);
    learnMoreButton.appendChild(learnMoreIcon);
    li.appendChild(learnMoreButton);

    return li;
}

// ==== MAIN FETCH AND DISPLAY ====
async function loadArtistsDataAndDisplay() {
    showLoader();
    try {
        if (offset === 0) {
            const data = await fetchArtists();
            const artistsArray = Array.isArray(data?.artists) ? data.artists : null;
            if (!artistsArray) {
                alert('Error: Received invalid data from server.');
                disableLoadMoreButton();
                return;
            }
            allArtists = artistsArray;
            artistsContainer.innerHTML = '';
        }

        const artistsToDisplay = allArtists.slice(offset, offset + limit);
        for (const artist of artistsToDisplay) {
            const card = await createCard(artist);
            artistsContainer.appendChild(card);
        }

        offset += limit;

        if (offset >= allArtists.length) {
            disableLoadMoreButton();
        } else {
            enableLoadMoreButton();
        }
    } catch (error) {
        alert('Failed to load artists. Please try again later.');
        disableLoadMoreButton();
    } finally {
        hideLoader();
    }
}

// ==== INIT ====
function initArtistSection() {
    artistsContainer = document.getElementById('artistsContainer');
    loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!artistsContainer || !loadMoreBtn) return;

    loadMoreBtn.onclick = loadArtistsDataAndDisplay;
    loadArtistsDataAndDisplay();

    artistsContainer.addEventListener('click', e => {
        const button = e.target.closest('.learn-more-btn');
        if (button) {
            const artistId = button.dataset.artistId;
            if (artistId) openArtistModal(artistId);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initArtistSection();
});

export { initArtistSection };
