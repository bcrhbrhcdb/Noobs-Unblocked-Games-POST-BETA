document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title;
        document.getElementById('gameTitle').textContent = game.title;
        
        const iframe = document.getElementById('gameFrame');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (game.type === 'folder') {
            loadingScreen.style.display = 'block';
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    iframe.style.display = 'block';
                }, 500);
            }, 5000);
        }

        iframe.src = game.originalUrl;
        document.getElementById('gameLink').href = game.originalUrl;

        iframe.onload = function() {
            if (game.type !== 'folder') {
                this.style.display = 'block';
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
        };

        iframe.addEventListener('error', function() {
            console.error('Failed to load game');
            this.style.display = 'none';
            document.getElementById('gameTitle').textContent = 'Failed to load game';
        });
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

    function adjustIframeHeight() {
        const windowHeight = window.innerHeight;
        const offset = 200;
        iframe.style.height = (windowHeight - offset) + 'px';
    }

    adjustIframeHeight();
    window.addEventListener('resize', adjustIframeHeight);
});