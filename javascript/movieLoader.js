document.addEventListener('DOMContentLoaded', () => {
    const movieContainer = document.getElementById('movie-container');
    const movieFrame = document.getElementById('movieFrame');
    const movieTitle = document.getElementById('movieTitle');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const movieInfo = document.getElementById('movieInfo');

    if (movieContainer) {
        // This is the movies list page
        generateMovieElements(movieContainer);
        setupSearch();
    } else if (movieFrame) {
        // This is the individual movie page
        loadMovie();
    }

    function generateMovieElements(container) {
        if (typeof movies !== 'undefined') {
            const sortedMovies = Object.entries(movies).sort((a, b) => 
                a[1].title.toLowerCase().localeCompare(b[1].title.toLowerCase())
            );
    
            sortedMovies.forEach(([id, movie]) => {
                const movieElement = document.createElement('div');
                movieElement.className = 'content';
                movieElement.innerHTML = `
                    <a href="movie-template.html?id=${id}">
                        <h3>${movie.title}</h3>
                        <img src="${movie.image}" class='img' alt="${movie.title}" />
                        <p>${movie.description}</p>
                    </a>
                `;
                container.appendChild(movieElement);
            });
        } else {
            console.error('Movies data not found');
        }
    }

    function setupSearch() {
        const searchInput = document.getElementById('query');
        const resultsContainer = document.getElementById('search-results');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchText = searchInput.value.toLowerCase();
                const movies = document.querySelectorAll('.content');
                let hasResults = false;

                movies.forEach(movie => {
                    const movieTitle = movie.querySelector('h3').textContent.toLowerCase();
                    if (movieTitle.includes(searchText)) {
                        movie.style.display = '';
                        hasResults = true;
                    } else {
                        movie.style.display = 'none';
                    }
                });

                if (resultsContainer) {
                    resultsContainer.innerHTML = hasResults ? '' : '<div class="no-results">No results found</div>';
                }
            });
        }
    }

    function loadMovie() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        if (movieId && movies[movieId]) {
            const movie = movies[movieId];
            document.title = movie.title;
            movieTitle.textContent = movie.title;
            
            movieFrame.src = movie.originalUrl;
            movieFrame.style.display = 'block';
            
            // Adjust frame size
            movieFrame.style.width = '100%';
            movieFrame.style.height = '80vh'; // 80% of the viewport height

            if (fullscreenButton) {
                fullscreenButton.addEventListener('click', () => {
                    if (movieFrame.requestFullscreen) {
                        movieFrame.requestFullscreen();
                    } else if (movieFrame.mozRequestFullScreen) {
                        movieFrame.mozRequestFullScreen();
                    } else if (movieFrame.webkitRequestFullscreen) {
                        movieFrame.webkitRequestFullscreen();
                    } else if (movieFrame.msRequestFullscreen) {
                        movieFrame.msRequestFullscreen();
                    }
                });
            }

            let movieInfoHTML = '';
            if (movie.controls) {
                movieInfoHTML += `<div class="controls"><h3>Controls:</h3>${movie.controls}</div>`;
            }
            if (movie.credits) {
                movieInfoHTML += `<div class="credits"><h3>Credits:</h3>${movie.credits}</div>`;
            }
            movieInfo.innerHTML = movieInfoHTML || '';
            movieInfo.style.display = movieInfoHTML ? 'block' : 'none';

            // Remove the adjustIframeHeight function as we're using a fixed height now
        } else {
            console.error('Movie not found');
            movieTitle.textContent = 'Movie Not Found';
            movieFrame.style.display = 'none';
        }
    }
});