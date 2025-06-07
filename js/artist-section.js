const API_URL = 'https://sound-wave.b.goit.study/api';
// Початкове зміщення для завантаження даних
let offset = 0;
// Кількість елементів, що завантажуються за один раз
const limit = 8;

// Отримання посилань на елементи DOM за їх ID
const artistsContainer = document.getElementById('artistsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

/**
 * Створює та повертає DOM-елемент картки виконавця.
 * Ця функція використовує addEventListener замість inline 'onclick' для обробки подій.
 * @param {object} artist - Об'єкт з даними виконавця (фото, ім'я, жанри, коротка інформація, опис).
 * @returns {HTMLElement} - Створений елемент 'div' для картки.
 */
function createCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `
        <img src="${artist.photo}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/cccccc/333333?text=No+Image';" alt="${artist.name}" />
        <h3>${artist.name}</h3>
        <p><strong>Genres:</strong> ${artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'N/A'}</p>
        <p>${artist.shortInfo || 'No short info available.'}</p>
        <button class="learn-more-btn">Learn More</button>
    `;

    // Знаходимо кнопку "Learn More" всередині щойно створеної картки
    const learnMoreButton = card.querySelector('.learn-more-btn');
    // Додаємо обробник події 'click' до цієї кнопки програмно
    learnMoreButton.addEventListener('click', () => {
        showModal(artist); // Викликаємо функцію showModal, передаючи об'єкт артиста
    });

    return card;
}

/**
 * Відображає модальне вікно з детальною інформацією про виконавця.
 * @param {object} artist - Об'єкт з даними виконавця для відображення.
 */
function showModal(artist) {
    modalContent.innerHTML = `
        <h2>${artist.name}</h2>
        <p><strong>Genres:</strong> ${artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'N/A'}</p>
        <p>${artist.description || 'No detailed description available.'}</p>
    `;
    modal.style.display = 'flex'; // Робимо модальне вікно видимим
}

// Обробник події для кнопки закриття модального вікна ('x')
closeModal.onclick = () => {
    modal.style.display = 'none'; // Приховуємо модальне вікно
};

// Обробник події для закриття модального вікна при кліку поза його межами
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'; // Приховуємо модальне вікно
    }
};

/**
 * Асинхронна функція для завантаження артистів з API.
 * Вона додає нові картки до контейнера та керує видимістю кнопки "Load More".
 */
async function loadArtists() {
    try {
        // Логуємо URL запиту для відладки
        console.log(`Requesting: ${API_URL}/artists`);
        // Виконуємо GET-запит до API без параметрів offset та limit
        const response = await axios.get(`${API_URL}/artists`);
        const data = response.data; // Отримуємо масив даних артистів з відповіді

        // Перевіряємо, чи отримані дані є масивом
        if (!Array.isArray(data)) {
            console.error('API response is not an array:', data);
            loadMoreBtn.style.display = 'none'; // Приховуємо кнопку, якщо дані невалідно
            return;
        }

        // Додаємо кожну картку артиста до DOM
        data.forEach((artist) => {
            const card = createCard(artist);
            artistsContainer.appendChild(card);
        });

        // Оскільки параметри пагінації прибрані, кнопка "Load More" буде прихована або не буде працювати
        // Якщо API повертає всі дані одразу, loadMoreBtn можна приховати
        loadMoreBtn.style.display = 'none'; // Приховую кнопку, оскільки пагінація тимчасово відключена

    } catch (error) {
        // Обробка помилок Axios (наприклад, помилки мережі, відповіді сервера з помилками)
        console.error('Axios error during artist loading:', error);
        // Приховуємо кнопку при помилці, щоб уникнути нескінченних спроб
        loadMoreBtn.style.display = 'none';
    }
}

// Прив'язуємо функцію loadArtists до події 'click' на кнопці "Load More"
// loadMoreBtn.onclick = loadArtists; // Закоментовано, оскільки пагінація тимчасово відключена

// Завантажуємо першу порцію артистів при завантаженні сторінки
loadArtists();