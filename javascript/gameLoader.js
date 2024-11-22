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
    } else {
        console.error('Game not found');
        document.getElementById('gameTitle').textContent = 'Game Not Found';
        document.getElementById('gameFrame').style.display = 'none';
        document.getElementById('gameLink').style.display = 'none';
    }
});