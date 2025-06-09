import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sound-wave.b.goit.study/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Отримання всіх артистів для секції артистів
 * @returns {Promise<Array>} масив артистів
 */
export async function fetchArtists() {
    const response = await api.get('/artists');
    return response.data.artists;
}

/**
 * Отримання одного артиста за ID (для модального вікна)
 * @param {string|number} id — ID артиста
 * @returns {Promise<Object>} дані артиста
 */
export async function fetchArtistById(id) {
    const response = await api.get(`/artists/${id}`);
    return response.data;
}

/**
 * Отримання відгуків користувачів
 * @returns {Promise<Array>} масив відгуків
 */
export async function fetchReviews() {
    const response = await api.get('/reviews');
    return response.data.reviews;
}