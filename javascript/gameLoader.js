document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        loadGame(gameId);
    } else {
        loadGameList();
    }
});

function loadGame(gameId) {
    const game = games[gameId];
    document.title = game.title;
    document.getElementById('gameTitle').textContent = game.title;
    document.getElementById('gameLink').href = game.originalUrl;

    const iframe = document.getElementById('gameFrame');
    const loadingScreen = document.getElementById('loadingScreen');

    loadingScreen.style.display = 'block';
    
    const minLoadTime = 3500; // 3.5 seconds in milliseconds
    const loadStartTime = Date.now();

    // Create a wrapper for the iframe and loading screen
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';

    // Move the iframe and loading screen into the wrapper
    iframe.parentNode.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);
    wrapper.appendChild(loadingScreen);

    iframe.src = game.originalUrl;

    iframe.onload = function() {
        const loadEndTime = Date.now();
        const loadDuration = loadEndTime - loadStartTime;

        if (loadDuration < minLoadTime) {
            setTimeout(() => {
                fadeOutLoadingScreen();
            }, minLoadTime - loadDuration);
        } else {
            fadeOutLoadingScreen();
        }

        try {
            const link = document.createElement('link');
            link.href = 'styles.css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            iframe.contentDocument.head.appendChild(link);
        } catch (e) {
            console.error('Error loading CSS into iframe:', e);
        }
        this.style.display = 'block';
    };

    function fadeOutLoadingScreen() {
        let opacity = 1;
        const fadeEffect = setInterval(() => {
            if (opacity > 0) {
                opacity -= 0.1;
                loadingScreen.style.opacity = opacity;
            } else {
                clearInterval(fadeEffect);
                loadingScreen.style.display = 'none';
            }
        }, 50);
    }

    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton && wrapper) {
        fullscreenButton.addEventListener('click', function() {
            if (wrapper.requestFullscreen) {
                wrapper.requestFullscreen();
            } else if (wrapper.mozRequestFullScreen) {
                wrapper.mozRequestFullScreen();
            } else if (wrapper.webkitRequestFullscreen) {
                wrapper.webkitRequestFullscreen();
            } else if (wrapper.msRequestFullscreen) {
                wrapper.msRequestFullscreen();
            }
        });
    }

    iframe.addEventListener('error', function() {
        console.error('Failed to load game');
        this.style.display = 'none';
        document.getElementById('gameTitle').textContent = 'Failed to load game';
        loadingScreen.style.display = 'none';
    });

    function adjustIframeHeight() {
        const windowHeight = window.innerHeight;
        const offset = 200;
        wrapper.style.height = (windowHeight - offset) + 'px';
    }

    adjustIframeHeight();
    window.addEventListener('resize', adjustIframeHeight);
}

function loadGameList() {
    const gameListContainer = document.getElementById('gameList');
    gameListContainer.innerHTML = '<h2>Game List</h2>';

    // Create an array of game objects with their IDs
    const gameArray = Object.entries(games).map(([id, game]) => ({id, ...game}));

    // Sort games alphabetically by title
    gameArray.sort((a, b) => a.title.localeCompare(b.title));

    // Group games by their titles
    const groupedGames = gameArray.reduce((acc, game) => {
        const key = game.title.toLowerCase();
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(game);
        return acc;
    }, {});

    // Create and append game links
    Object.values(groupedGames).forEach(group => {
        group.forEach((game, index) => {
            const gameLink = document.createElement('a');
            gameLink.href = game.url;
            gameLink.textContent = game.title + (group.length > 1 ? ` (${index + 1})` : '');
            gameLink.classList.add('game-link');
            gameListContainer.appendChild(gameLink);
        });
    });

    document.title = 'Game List';
    document.getElementById('gameTitle').textContent = 'Game List';
    document.getElementById('gameFrame').style.display = 'none';
    document.getElementById('gameLink').style.display = 'none';
    document.getElementById('fullscreenButton').style.display = 'none';
}