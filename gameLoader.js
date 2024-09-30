document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    // Check if the gameId exists in the games object
    if (gameId && games[gameId]) {
        const game = games[gameId];
        document.title = game.title; // Set the document title
        document.getElementById('gameTitle').textContent = game.title; // Set the game title in the HTML
        document.getElementById('gameFrame').src = game.originalUrl; // Set the iframe source to the original game URL
        document.getElementById('gameLink').href = game.originalUrl; // Set the link to the original game URL
    } else {
        console.error('Game not found');
        document.getElementById('gameTitle').textContent = 'Game Not Found'; // Display an error message
        document.getElementById('gameFrame').style.display = 'none'; // Hide the iframe
        document.getElementById('gameLink').style.display = 'none'; // Hide the link button
    }
});

// Fullscreen button functionality
const fullscreenButton = document.getElementById('fullscreenButton');
const iframe = document.getElementById('gameFrame');

if (fullscreenButton && iframe) {
    fullscreenButton.addEventListener('click', function() {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            iframe.msRequestFullscreen();
        }
    });
}

// Load the CSS from styles.css into the iframe
iframe.onload = function() {
    try {
        const link = document.createElement('link');
        link.href = 'styles.css'; // Use a relative path to access styles.css
        link.rel = 'stylesheet';
        link.type = 'text/css';
        iframe.contentDocument.head.appendChild(link); // Append the link to the iframe's head
    } catch (e) {
        console.error('Error loading CSS into iframe:', e);
    }
};

// Optional: Add error handling for iframe loading
iframe.addEventListener('load', function() {
    this.style.display = 'block'; // Show iframe when loaded successfully
});

iframe.addEventListener('error', function() {
    console.error('Failed to load game');
    this.style.display = 'none'; // Hide iframe on error
    document.getElementById('gameTitle').textContent = 'Failed to load game'; // Show error message
});

// Function to adjust iframe height based on window size
function adjustIframeHeight() {
    const windowHeight = window.innerHeight;
    const offset = 200; // Adjust this value as needed for padding/margins
    iframe.style.height = (windowHeight - offset) + 'px'; // Set iframe height dynamically
}

// Call the function on load and resize events
window.addEventListener('load', adjustIframeHeight);
window.addEventListener('resize', adjustIframeHeight);
