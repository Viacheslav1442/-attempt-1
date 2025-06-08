import axios from 'axios';
const API_URL = 'https://sound-wave.b.goit.study/api';
let offset = 0;
const limit = 8;
let allArtists = [];

let artistsContainer;
let loadMoreBtn;
let modal;
let modalContent;
let closeModal;

function getGenres(artist) {
    const genres = [
        artist.strGenre,
        artist.strStyle,
        artist.strMood,
        artist.strGenre2,
        artist.strGenre3,
        artist.strMood2,
        artist.strMood3
    ].filter(Boolean);

    return genres.length > 0 ? genres.join(', ') : 'N/A';
}

function createCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';

    const img = document.createElement('img');
    img.src = artist.strArtistThumb || 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
    img.alt = artist.strArtist || 'No Image';
    img.addEventListener('error', function () {
        this.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
        this.alt = 'No Image Available';
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
    shortInfoP.textContent = artist.strBiographyEN || 'No short info available.';
    card.appendChild(shortInfoP);

    const learnMoreButton = document.createElement('button');
    learnMoreButton.className = 'learn-more-btn';
    learnMoreButton.textContent = 'Learn More';
    learnMoreButton.addEventListener('click', () => {
        showModal(artist);
    });
    card.appendChild(learnMoreButton);

    return card;
}

function showModal(artist) {
    modalContent.innerHTML = '';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = artist.strArtist || 'Unknown Artist';
    modalContent.appendChild(modalTitle);

    const genresP = document.createElement('p');
    const genresStrong = document.createElement('strong');
    genresStrong.textContent = 'Genres: ';
    genresP.appendChild(genresStrong);
    genresP.append(getGenres(artist));
    modalContent.appendChild(genresP);

    const descriptionP = document.createElement('p');
    descriptionP.textContent = artist.strBiographyEN || 'No detailed description available.';
    modalContent.appendChild(descriptionP);

    modal.style.display = 'flex';
}

async function loadArtistsDataAndDisplay() {
    try {
        if (offset === 0) {
            console.log(`Sending initial request to: ${API_URL}/artists`);
            const response = await axios.get(`${API_URL}/artists`);
            const data = response.data.artists;

            if (!Array.isArray(data)) {
                console.error('API response is not an array:', data);
                loadMoreBtn.style.display = 'none';
                return;
            }
            allArtists = data;
        }

        if (offset >= allArtists.length) {
            loadMoreBtn.style.display = 'none';
            return;
        }

        const artistsToDisplay = allArtists.slice(offset, offset + limit);
        artistsToDisplay.forEach((artist) => {
            const card = createCard(artist);
            artistsContainer.appendChild(card);
        });

        offset += limit;

        loadMoreBtn.style.display = offset < allArtists.length ? 'block' : 'none';

    } catch (error) {
        console.error('Axios error during artist loading:', error);

        if (axios.isAxiosError(error) && error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received from API for the request.');
        } else {
            console.error('Error setting up the request:', error.message);
        }

        loadMoreBtn.style.display = 'none';
    }
}

function initArtistSection() {
    artistsContainer = document.getElementById('artistsContainer');
    loadMoreBtn = document.getElementById('loadMoreBtn');
    modal = document.getElementById('modal');
    modalContent = document.getElementById('modalContent');
    closeModal = document.getElementById('closeModal');

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    loadMoreBtn.onclick = loadArtistsDataAndDisplay;
    loadArtistsDataAndDisplay();
}

export { initArtistSection };