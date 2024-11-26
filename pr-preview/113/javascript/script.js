function generateFooter() {
    const footer = document.createElement('div');
    footer.className = 'box';
    footer.innerHTML = `
        <footer>
        <h3>Vistors (again)</h3>
            <div align='center'><a href='https://www.free-website-hit-counter.com'><img src='https://www.free-website-hit-counter.com/zc.php?d=9&id=1109&s=2' border='0' alt=''></a><br /><small><a href='https://www.free-website-hit-counter.com' title="Free Website Hit Counter"></a></small></div>
            <h4>Want to suggest an idea? Fill out the Google form!</h4>
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfjkzAiUEbMh634MSOc8yfWsP5_ZHVnF1EDE73dpTDw0Vz7SA/viewform?embedded=true" class='frame'>Loading…</iframe>   
            <a href="https://github.com/bcrhbrhcdb/Nooby" target="_blank"><button id="navBar">The Github</button></a>
        </footer>
    `;
    document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', () => {
    generateGameElements();
    generateFooter();
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
        // Sort games array
        const sortedGames = Object.entries(games).sort((a, b) => {
            const titleA = a[1].title.toLowerCase();
            const titleB = b[1].title.toLowerCase();
            
            // Extract the name and number parts
            const [nameA, numA] = titleA.split(/\s+/);
            const [nameB, numB] = titleB.split(/\s+/);
            
            // If the names are the same and both have numbers, sort numerically
            if (nameA === nameB && numA && numB) {
                return parseInt(numA) - parseInt(numB);
            }
            
            // Otherwise, sort alphabetically
            return titleA.localeCompare(titleB);
        });

        sortedGames.forEach(([id, game]) => {
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