import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sound-wave.b.goit.study/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    // iziToast.error або alert на вибір
    alert('Сталася помилка при запиті до сервера. Спробуйте ще раз.');
    return Promise.reject(error);
  }
);

export async function fetchArtists() {
  try {
    const response = await api.get('/artists');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchArtistById(id) {
  try {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchReviews() {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    throw error;
  }
}