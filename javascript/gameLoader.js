document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title;
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameLink').href = game.originalUrl;

        const iframe = document.getElementById('gameFrame');
        const loadingScreen = document.getElementById('loadingScreen');

        loadingScreen.style.display = 'block';
        
        const minLoadTime = 3500; // 3.5 seconds in milliseconds
        const loadStartTime = Date.now();

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
        if (fullscreenButton) {
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

        // Add controls and credits information to the gameInfo div
        const gameInfoContainer = document.getElementById('gameInfo');
        let gameInfoHTML = '';

        if (game.controls) {
            gameInfoHTML += `<div class="controls"><h3>Controls:</h3>${game.controls}</div>`;
        }

        if (game.credits) {
            gameInfoHTML += `<div class="credits"><h3>Credits:</h3>${game.credits}</div>`;
        }

        if (gameInfoHTML) {
            gameInfoContainer.innerHTML = gameInfoHTML;
        } else {
            gameInfoContainer.style.display = 'none';
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
            iframe.style.height = (windowHeight - offset) + 'px';
        }

        adjustIframeHeight();
        window.addEventListener('resize', adjustIframeHeight);
    } else {
        console.error('Game not found');
        document.getElementById('gameTitle').textContent = 'Game Not Found';
        document.getElementById('gameFrame').style.display = 'none';
        document.getElementById('gameLink').style.display = 'none';
    }
});