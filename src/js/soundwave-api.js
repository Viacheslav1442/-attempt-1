import axios from 'axios';


const api = axios.create({
  baseURL: 'https://sound-wave.b.goit.study/api', // 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ➕ Interceptors — показ лоадера перед запитом
api.interceptors.request.use(
  config => {
    showLoader();
    return config;
  },
  error => {
    hideLoader();
    return Promise.reject(error);
  }
);

// ➖ Interceptors — приховування лоадера після відповіді/помилки
api.interceptors.response.use(
  response => {
    hideLoader();
    return response;
  },
  error => {
    hideLoader();
    iziToast.error({
      title: 'Помилка',
      message: 'Сталася помилка при запиті до сервера. Спробуйте ще раз.',
      position: 'topRight',
    });
    return Promise.reject(error);
  }
);

// ========== Функції запитів ==========

export async function fetchArtists() {
  try {
    const response = await api.get('/artists');
    return response.data;
  } catch (error) {
    console.error('❌ Помилка при отриманні артистів:', error);
    throw error;
  }
}

export async function fetchArtistById(id) {
  try {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Помилка при отриманні артиста з ID = ${id}:`, error);
    throw error;
  }
}

export async function fetchReviews() {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    console.error('❌ Помилка при отриманні відгуків:', error);
    throw error;
  }
}
