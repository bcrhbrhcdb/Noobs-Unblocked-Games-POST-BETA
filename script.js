document.addEventListener('DOMContentLoaded', () => {
    // Generate game elements
    function generateGameElements() {
        const gameContainer = document.getElementById('game-container');
        
        games.forEach(game => {
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
    }

    generateGameElements();

    const searchInput = document.getElementById('query');
    const games = document.querySelectorAll('.content');
    const resultsContainer = document.getElementById('search-results');

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const offset = 400; // Offset in pixels (2px from the edge of the screen)
        return (
            rect.top >= -offset &&
            rect.left >= -offset &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
        );
    }

    function checkPosition() {
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

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
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
            resultsContainer.innerHTML = ''; // Clear "No results found" message when there are results
        }

        // Recheck the position after filtering
        checkPosition();
    });

    // Initial check to see which games are in view
    checkPosition();
});

// Fullscreen button functionality
document.addEventListener('DOMContentLoaded', (event) => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const iframe = document.getElementById('screen'); // Get the iframe by its ID

    if (fullscreenButton && iframe) {
        fullscreenButton.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                // Request fullscreen for the iframe
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen().catch((err) => {
                        alert(`Error attempting to enable fullscreen mode for the iframe: ${err.message} (${err.name})`);
                    });
                } else {
                    alert('Fullscreen API is not supported by your browser.');
                }
            } else {
                // Exit fullscreen mode
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
});

// Time and date display
window.addEventListener('DOMContentLoaded', function() {
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

    updateTime();
    setInterval(updateTime, 1000);
});
function generateGameElements() {
    const gameContainer = document.getElementById('game-container');
    
    if (gameContainer) {
        Object.entries(games).forEach(([id, game]) => {
            const gameElement = document.createElement('div');
            gameElement.className = 'content';
            gameElement.innerHTML = `
                <a href="game-template.html?id=${id}">
                    <h3>${game.title}</h3>
                    <img src="${game.image}" class='img' />
                    <p>${game.description}</p>
                </a>
            `;
            gameContainer.appendChild(gameElement);
        });
    }
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', generateGameElements);