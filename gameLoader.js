document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title;
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameFrame').src = game.url;
        document.getElementById('gameLink').href = game.url;
    } else {
        console.error('Game not found');
        // Optionally, redirect to a 404 page or show an error message
    }
});