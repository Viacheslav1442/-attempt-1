import { fetchArtists, fetchArtistById } from './soundwave-api.js';

let currentPage = 1;
const limit = 8;

let artistsContainer;
let loadMoreBtn;

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
}

// Оновлена функція getGenres
function getGenres(artist) {
    const genres = [
        artist.strGenre,
        artist.strStyle,
        artist.strMood,
        artist.strGenre2,
        artist.strGenre3,
        artist.strMood2,
        artist.strMood3,
    ].filter(Boolean);

    return genres.length > 0 ? genres.join(', ') : 'N/A';
}

function createCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';

    const img = document.createElement('img');
    img.src =
        artist.strArtistThumb ||
        'https://placehold.co/150x150/cccccc/333333?text=No+Image';
    img.alt = artist.strArtist || 'No Image';
    img.addEventListener('error', function () {
        if (!this.src.includes('placehold.co')) {
            this.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
            this.alt = 'No Image Available';
        }
    });
    card.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = artist.strArtist || 'Unknown Artist';
    card.appendChild(h3);

    const genresP = document.createElement('p');
    const genresStrong = document.createElement('strong');
    genresStrong.textContent = 'Genres: ';
    genresP.appendChild(genresStrong);
    genresP.append(getGenres(artist));
    card.appendChild(genresP);

    const shortInfoP = document.createElement('p');
    shortInfoP.className = 'artist-description';
    const bio = artist.strBiographyEN || 'No short info available.';
    shortInfoP.textContent = bio.length > 200 ? bio.slice(0, 200) + '...' : bio;
    card.appendChild(shortInfoP);

    const learnMoreButton = document.createElement('button');
    learnMoreButton.className = 'learn-more-btn';
    learnMoreButton.textContent = 'Learn More';
    learnMoreButton.dataset.artistId = artist.idArtist;
    card.appendChild(learnMoreButton);

    return card;
}

async function loadArtistsDataAndDisplay() {
    try {
        showLoader();

        if (offset === 0) {
            const data = await fetchArtists();

            const artistsArray = Array.isArray(data)
                ? data
                : Array.isArray(data.artists)
                    ? data.artists
                    : null;

            if (!artistsArray) {
                alert('Error: Received invalid data from server.');
                loadMoreBtn?.classList.add('hidden');
                loadMoreBtn?.setAttribute('disabled', true);
                return;
            }

            allArtists = artistsArray;
        }

        const artistsToDisplay = allArtists.slice(offset, offset + limit);
        artistsToDisplay.forEach(artist => {
            const card = createCard(artist);
            artistsContainer.appendChild(card);
        });

        offset += limit;

        console.log(`Loaded ${offset} of ${allArtists.length} artists`);

        if (offset >= allArtists.length) {
            loadMoreBtn?.classList.add('hidden');
            loadMoreBtn?.setAttribute('disabled', true);
        } else {
            loadMoreBtn?.classList.remove('hidden');
            loadMoreBtn?.removeAttribute('disabled');
        }
    } catch (error) {
        alert('Failed to load artists. Please try again later.');
        loadMoreBtn?.classList.add('hidden');
        loadMoreBtn?.setAttribute('disabled', true);
    } finally {
        hideLoader();
    }
}

function initArtistSection() {
    artistsContainer = document.getElementById('artistsContainer');
    loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!artistsContainer || !loadMoreBtn) return;

    loadMoreBtn.onclick = loadArtistsDataAndDisplay;
    loadArtistsDataAndDisplay();

    artistsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('learn-more-btn')) {
            const artistId = e.target.dataset.artistId;
            try {
                const artistData = await fetchArtistById(artistId);
                if (!artistData || !artistData.artists || !artistData.artists[0]) {
                    alert('Artist details not found.');
                    return;
                }
                // Тут лишається виклик без створення модалки
                console.log('Artist details:', artistData.artists[0]);
            } catch (error) {
                alert('Failed to load artist details.');
            }
        }
    });
}

export { initArtistSection };
