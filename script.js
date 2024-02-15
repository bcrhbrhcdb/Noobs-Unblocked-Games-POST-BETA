document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('query');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        resultsContainer.innerHTML = ''; // Clear previous results

        const allGames = document.querySelectorAll('.searchable, .game'); // Select all game elements

        allGames.forEach(game => {
            if (game.textContent.toLowerCase().includes(searchTerm)) {
                const gameItem = document.createElement('li');
                gameItem.textContent = game.textContent;
                
                // Check for image and link
                const gameImage = game.querySelector('img');
                if (gameImage && gameImage.alt.toLowerCase().includes(searchTerm)) {
                    const image = document.createElement('img');
                    image.src = gameImage.src;
                    gameItem.appendChild(image);
                }

                const gameLink = game.querySelector('a');
                if (gameLink && gameLink.textContent.toLowerCase().includes(searchTerm)) {
                    const link = document.createElement('a');
                    link.href = gameLink.href;
                    link.textContent = gameLink.textContent;
                    gameItem.appendChild(link);
                }

                resultsContainer.appendChild(gameItem);
            }
        });

        if (resultsContainer.innerHTML === '') {
            resultsContainer.innerHTML = '<li>No results found.</li>';
        }
    });
});
//full screen button

document.addEventListener('DOMContentLoaded', (event) => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const iframes = document.querySelectorAll('iframe');

    fullscreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable fullscreen mode for the document: ${err.message} (${err.name})`);
            });
            for (let i = 0; i < iframes.length; i++) {
                if (iframes[i].requestFullscreen) {
                    iframes[i].requestFullscreen().catch((err) => {
                        alert(`Error attempting to enable fullscreen mode for the iframe: ${err.message} (${err.name})`);
                    });
                }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            for (let i = 0; i < iframes.length; i++) {
                if (iframes[i].contentDocument.exitFullscreen) {
                    iframes[i].contentDocument.exitFullscreen();
                }
            }
        }
    });
});

