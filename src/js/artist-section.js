import { fetchArtists, fetchArtistById } from './soundwave-api.js';

let offset = 0;
const limit = 8;
let allArtists = [];

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
  if (!artist) return 'N/A';

  // Якщо є масив жанрів у форматі [{ genre: "Rock" }, ...]
  if (Array.isArray(artist.genres) && artist.genres.length > 0) {
    const genres = artist.genres
      .map(g => g.genre)
      .filter(Boolean)
      .map(g => g.trim())
      .filter((val, idx, arr) => arr.indexOf(val) === idx);

    if (genres.length) return genres.join(', ');
  }

  // Якщо немає масиву genres, використовуємо старі поля
  const genresFromFields = [
    artist.strGenre,
    artist.strGenre2,
    artist.strGenre3,
    artist.strStyle,
    artist.strMood,
    artist.strMood2,
    artist.strMood3,
  ]
    .filter(val => typeof val === 'string' && val.trim())
    .map(val => val.trim())
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  return genresFromFields.length ? genresFromFields.join(', ') : 'N/A';
}

async function createCard(artist) {
  const card = document.createElement('div');
  card.className = 'artist-card';

  // Завантажити детальні дані, якщо є id
  let fullArtist = artist;
  if (artist.idArtist) {
    try {
      const details = await fetchArtistById(artist.idArtist);
      if (details?.artists?.[0]) {
        fullArtist = details.artists[0];
      }
    } catch {
      // Якщо помилка — залишаємо початкові дані
    }
  }

  const img = document.createElement('img');
  img.src =
    fullArtist.strArtistThumb ||
    'https://placehold.co/150x150/cccccc/333333?text=No+Image';
  img.alt = fullArtist.strArtist || 'No Image';
  img.addEventListener('error', function () {
    if (!this.src.includes('placehold.co')) {
      this.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
      this.alt = 'No Image Available';
    }
  });
  card.appendChild(img);

  const h3 = document.createElement('h3');
  h3.textContent = fullArtist.strArtist || 'Unknown Artist';
  card.appendChild(h3);

  const genresP = document.createElement('p');
  const genresStrong = document.createElement('strong');
  genresStrong.textContent = 'Genres: ';
  genresP.appendChild(genresStrong);

  const genresText = document.createTextNode(getGenres(fullArtist));
  genresP.appendChild(genresText);
  card.appendChild(genresP);

  const shortInfoP = document.createElement('p');
  shortInfoP.className = 'artist-description';
  const bio = fullArtist.strBiographyEN || 'No short info available.';
  shortInfoP.textContent = bio.length > 200 ? bio.slice(0, 200) + '...' : bio;
  card.appendChild(shortInfoP);

  const learnMoreButton = document.createElement('button');
  learnMoreButton.className = 'learn-more-btn';
  learnMoreButton.textContent = 'Learn More';

  if (fullArtist.idArtist) {
    learnMoreButton.dataset.artistId = fullArtist.idArtist;
  } else {
    learnMoreButton.disabled = true;
  }

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
      artistsContainer.innerHTML = '';
    }

    const artistsToDisplay = allArtists.slice(offset, offset + limit);
    for (const artist of artistsToDisplay) {
      const card = await createCard(artist);
      artistsContainer.appendChild(card);
    }

    offset += limit;

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

      if (!artistId) {
        alert('Невідомий артист. Ідентифікатор відсутній.');
        return;
      }

      try {
        const artistData = await fetchArtistById(artistId);
        if (!artistData || !artistData.artists || !artistData.artists[0]) {
          alert('Artist details not found.');
          return;
        }

        // Тут можна відкривати модальне вікно або інші дії з детальною інформацією
        // console.log('Artist details:', artistData.artists[0]); // ← закоментовано
      } catch (error) {
        alert('Failed to load artist details.');
      }
    }
  });
}

export { initArtistSection };
