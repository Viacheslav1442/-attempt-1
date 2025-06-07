let offset = 0;
const limit = 8;
const API_URL = 'https://sound-wave.b.goit.study/api';
const artistsContainer = document.getElementById('artistsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

function createCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `
    <img src="${artist.photo}" alt="${artist.name}" />
    <h3>${artist.name}</h3>
    <p>${artist.genres.join(', ')}</p>
    <p>${artist.shortInfo}</p>
    <button onclick='showModal(${JSON.stringify(artist)})'>Learn More</button>
  `;
    return card;
}

function showModal(artist) {
    modalContent.innerHTML = `
    <h2>${artist.name}</h2>
    <p><strong>Genres:</strong> ${artist.genres.join(', ')}</p>
    <p>${artist.description}</p>
  `;
    modal.style.display = 'flex';
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

async function loadArtists() {
    try {
        const res = await fetch(`${API_URL}/artists?offset=${offset}&limit=${limit}`);
        const data = await res.json();
        data.forEach(artist => {
            const card = createCard(artist);
            artistsContainer.appendChild(card);
        });
        offset += limit;
        if (data.length < limit) loadMoreBtn.style.display = 'none';
    } catch (error) {
        console.error('Failed to load artists:', error);
    }
}

loadMoreBtn.onclick = loadArtists;
loadArtists();