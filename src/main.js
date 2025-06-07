// main.js

// Імпортуємо функцію ініціалізації секції артистів
import { initArtistSection } from './artist-section.js';

// Чекаємо, доки DOM буде повністю завантажений, перш ніж ініціалізувати додаток
document.addEventListener('DOMContentLoaded', () => {
    initArtistSection();
});
