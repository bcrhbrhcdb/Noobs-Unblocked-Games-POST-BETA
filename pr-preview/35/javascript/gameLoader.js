// gameLoader.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title;
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameFrame').src = game.originalUrl;
        document.getElementById('gameLink').href = game.originalUrl;
    } else {
        console.error('Game not found');
        document.getElementById('gameTitle').textContent = 'Game Not Found';
        document.getElementById('gameFrame').style.display = 'none';
        document.getElementById('gameLink').style.display = 'none';
    }

    const fullscreenButton = document.getElementById('fullscreenButton');
    const iframe = document.getElementById('gameFrame');

    if (fullscreenButton && iframe) {
        fullscreenButton.addEventListener('click', function() {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        });
    }

    iframe.onload = function() {
        try {
            const link = document.createElement('link');
            link.href = 'styles.css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            iframe.contentDocument.head.appendChild(link);
        } catch (e) {
            console.error('Error loading CSS into iframe:', e);
        }
    };

    iframe.addEventListener('load', function() {
        this.style.display = 'block';
    });

    iframe.addEventListener('error', function() {
        console.error('Failed to load game');
        this.style.display = 'none';
        document.getElementById('gameTitle').textContent = 'Failed to load game';
    });

    function adjustIframeHeight() {
        const windowHeight = window.innerHeight;
        const offset = 200;
        iframe.style.height = (windowHeight - offset) + 'px';
    }

    adjustIframeHeight();
    window.addEventListener('resize', adjustIframeHeight);
});
