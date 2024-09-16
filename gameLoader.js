document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title;
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameFrame').src = game.url;
        document.getElementById('gameLink').href = game.originalUrl;
    } else {
        console.error('Game not found');
        document.getElementById('gameTitle').textContent = 'Game Not Found';
        document.getElementById('gameFrame').style.display = 'none';
        document.getElementById('gameLink').style.display = 'none';
    }
});

// Fullscreen button functionality
const fullscreenButton = document.getElementById('fullscreenButton');
const iframe = document.getElementById('gameFrame');

if (fullscreenButton && iframe) {
    fullscreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen().catch((err) => {
                    alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
                });
            } else {
                alert('Fullscreen API is not supported by your browser.');
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}

// Optional: Add error handling for iframe loading
document.getElementById('gameFrame').addEventListener('load', function() {
    this.style.display = 'block';
}, false);

document.getElementById('gameFrame').addEventListener('error', function() {
    console.error('Failed to load game');
    this.style.display = 'none';
    document.getElementById('gameTitle').textContent = 'Failed to load game';
}, false);

// Optional: Add a function to adjust iframe height based on window size
function adjustIframeHeight() {
    const iframe = document.getElementById('gameFrame');
    const windowHeight = window.innerHeight;
    const offset = 200; // Adjust this value as needed
    iframe.style.height = (windowHeight - offset) + 'px';
}

// Call the function on load and resize
window.addEventListener('load', adjustIframeHeight);
window.addEventListener('resize', adjustIframeHeight);
