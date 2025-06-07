const API_URL = 'https://sound-wave.b.goit.study/api';
// Початкове зміщення для завантаження даних (для клієнтської пагінації)
let offset = 0;
// Кількість елементів, що відображаються за один раз
const limit = 8;
// Масив для зберігання всіх завантажених артистів з API
let allArtists = [];

// Посилання на елементи DOM (будуть ініціалізовані в initArtistSection)
let artistsContainer;
let loadMoreBtn;
let modal;
let modalContent;
let closeModal;

/**
 * Створює та повертає DOM-елемент картки виконавця.
 * Ця функція повністю уникає використання innerHTML для динамічного контенту,
 * створюючи всі елементи програмно.
 * @param {object} artist - Об'єкт з даними виконавця (фото, ім'я, жанри, коротка інформація, опис).
 * @returns {HTMLElement} - Створений елемент 'div' для картки.
 */
function createCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';

    const img = document.createElement('img');
    img.src = artist.photo;
    img.alt = artist.name;
    img.addEventListener('error', function () {
        this.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
        this.alt = 'No Image Available';
    });
    card.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = artist.name;
    card.appendChild(h3);

    const genresP = document.createElement('p');
    const genresStrong = document.createElement('strong');
    genresStrong.textContent = 'Genres: ';
    genresP.appendChild(genresStrong);
    genresP.append(artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'N/A');
    card.appendChild(genresP);

    const shortInfoP = document.createElement('p');
    shortInfoP.textContent = artist.shortInfo || 'No short info available.';
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

/**
 * Відображає модальне вікно з детальною інформацією про виконавця.
 * Ця функція повністю уникає innerHTML для очищення та додавання контенту.
 * @param {object} artist - Об'єкт з даними виконавця для відображення.
 */
function showModal(artist) {
    // Очищаємо вміст перед додаванням нового, повністю уникаючи innerHTML
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = artist.name;
    modalContent.appendChild(modalTitle);

    const genresP = document.createElement('p');
    const genresStrong = document.createElement('strong');
    genresStrong.textContent = 'Genres: ';
    genresP.appendChild(genresStrong);
    genresP.append(artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'N/A');
    modalContent.appendChild(genresP);

    const descriptionP = document.createElement('p');
    descriptionP.textContent = artist.description || 'No detailed description available.';
    modalContent.appendChild(descriptionP);

    modal.style.display = 'flex'; // Робимо модальне вікно видимим
}

/**
 * Асинхронна функція для завантаження артистів з API та відображення їх.
 * Тепер API викликається лише один раз, а пагінація відбувається на клієнтській стороні.
 */
async function loadArtistsDataAndDisplay() {
    try {
        if (offset === 0) { // Виконуємо запит до API тільки при першому завантаженні
            console.log(`Sending initial request to: ${API_URL}/artists`);
            // *** КЛЮЧОВЕ ВИПРАВЛЕННЯ: ЗАПИТ БЕЗ ПАРАМЕТРІВ OFFSET/LIMIT ***
            const response = await axios.get(`${API_URL}/artists`);

            // Доступ до масиву артистів через .artists
            const data = response.data.artists;

            // Перевіряємо, чи отримані дані є масивом
            if (!Array.isArray(data)) {
                console.error('API response is not an array (after accessing .artists):', data);
                loadMoreBtn.style.display = 'none';
                return;
            }
            allArtists = data; // Зберігаємо всіх отриманих артистів
        }

        // Відображаємо артистів з масиву allArtists, використовуючи slice для пагінації на клієнті
        const artistsToDisplay = allArtists.slice(offset, offset + limit);

        // Додаємо кожну картку артиста до DOM
        artistsToDisplay.forEach((artist) => {
            const card = createCard(artist);
            artistsContainer.appendChild(card);
        });

        // Збільшуємо зміщення для наступної порції
        offset += limit;

        // Приховуємо кнопку "Load More", якщо всі артисти були відображені
        if (offset >= allArtists.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block'; // Робимо кнопку видимою, якщо є ще артисти
        }

    } catch (error) {
        console.error('Axios error during artist loading:', error);

        // Логуємо деталі відповіді на помилку, якщо вони доступні
        if (axios.isAxiosError(error) && error.response) {
            console.error('API Error Response Details:');
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // Запит був зроблений, але відповіді не було отримано
            console.error('No response received from API for the request.');
        } else {
            // Щось пішло не так при налаштуванні запиту
            console.error('Error setting up the request:', error.message);
        }

        loadMoreBtn.style.display = 'none'; // Приховуємо кнопку при помилці
    }
}

/**
 * Ініціалізує секцію артистів: отримує елементи DOM та встановлює обробники подій.
 * Ця функція є точкою входу для модуля.
 */
function initArtistSection() {
    // Отримання посилань на елементи DOM за їх ID
    artistsContainer = document.getElementById('artistsContainer');
    loadMoreBtn = document.getElementById('loadMoreBtn');
    modal = document.getElementById('modal');
    modalContent = document.getElementById('modalContent');
    closeModal = document.getElementById('closeModal');

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

    // Прив'язуємо функцію loadArtistsDataAndDisplay до події 'click' на кнопці "Load More"
    loadMoreBtn.onclick = loadArtistsDataAndDisplay;

    // Завантажуємо першу порцію артистів при завантаженні сторінки
    loadArtistsDataAndDisplay();
}

// Експортуємо функцію ініціалізації для використання в main.js
export { initArtistSection };
