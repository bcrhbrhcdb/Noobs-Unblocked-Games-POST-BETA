document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title;
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameFrame').src = game.url;
        document.getElementById('gameLink').href = game.originalUrl; // Use originalUrl for the link
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
