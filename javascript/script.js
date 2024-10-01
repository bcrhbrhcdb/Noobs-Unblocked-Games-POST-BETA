document.addEventListener('DOMContentLoaded', () => {
    generateGameElements();
    
    const searchInput = document.getElementById('query');
    const resultsContainer = document.getElementById('search-results');

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const offset = 400;
        return (
            rect.top >= -offset &&
            rect.left >= -offset &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
        );
    }

    function checkPosition() {
        const games = document.querySelectorAll('.content');
        for (let game of games) {
            if (isElementInViewport(game)) {
                game.classList.add('in-view');
            } else {
                game.classList.remove('in-view');
            }
        }
    }

    window.addEventListener('scroll', checkPosition);
    window.addEventListener('load', checkPosition);

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase();
            const games = document.querySelectorAll('.content');
            let hasResults = false;
            resultsContainer.innerHTML = '';

            games.forEach(game => {
                const gameTitle = game.querySelector('h3').textContent.toLowerCase();
                if (gameTitle.includes(searchText)) {
                    game.classList.remove('hidden');
                    hasResults = true;
                } else {
                    game.classList.add('hidden');
                }
            });

            if (!hasResults) {
                resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
            } else {
                resultsContainer.innerHTML = '';
            }

            checkPosition();
        });
    }

    checkPosition();
});

function generateGameElements() {
    const gameContainer = document.getElementById('game-container');
    
    if (gameContainer && typeof games !== 'undefined') {
        Object.entries(games).forEach(([id, game]) => {
            const gameElement = document.createElement('div');
            gameElement.className = 'content';
            gameElement.innerHTML = `
                <a href="${game.url}">
                    <h3>${game.title}</h3>
                    <img src="${game.image}" class='img' />
                    <p>${game.description}</p>
                </a>
            `;
            gameContainer.appendChild(gameElement);
        });
    } else {
        console.error('Game container or games data not found');
    }
}

const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const dayElement = document.getElementById('day');

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    if (timeElement) timeElement.textContent = timeString;

    const dateString = now.toDateString();
    if (dateElement) dateElement.textContent = dateString;

    const dayString = now.toLocaleString('default', { weekday: 'long' });
    if (dayElement) dayElement.textContent = dayString;
}

if (timeElement || dateElement || dayElement) {
    updateTime();
    setInterval(updateTime, 1000);
}