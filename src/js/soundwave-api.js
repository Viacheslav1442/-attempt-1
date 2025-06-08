import axios from 'axios';


const api = axios.create({
    baseURL: 'https://sound-wave.b.goit.study/api-docs/', // 
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
    try {
        const response = await api.get('/artists');
        return response.data;
    } catch (error) {
        console.error('❌ Помилка при отриманні артистів:', error);
        throw error;
    }
}

/**
 * Отримання одного артиста за ID (для модального вікна)
 * @param {string|number} id — ID артиста
 * @returns {Promise<Object>} дані артиста
 */
export async function fetchArtistById(id) {
    try {
        const response = await api.get(`/artists/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Помилка при отриманні артиста з ID = ${id}:`, error);
        throw error;
    }
}

/**
 * Отримання відгуків користувачів
 * @returns {Promise<Array>} масив відгуків
 */
export async function fetchReviews() {
    try {
        const response = await api.get('/reviews');
        return response.data;
    } catch (error) {
        console.error('❌ Помилка при отриманні відгуків:', error);
        throw error;
    }
}