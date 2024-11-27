document.addEventListener('DOMContentLoaded', () => {
    generateMovieElements();
    const searchInput = document.getElementById('query');
    const resultsContainer = document.getElementById('search-results');

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const offset = 400;
        return (
            rect.top >= -offset &&
            rect.left >= -offset &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
        );
    }

    function checkPosition() {
        const movies = document.querySelectorAll('.content');
        for (let movie of movies) {
            if (isElementInViewport(movie)) {
                movie.classList.add('in-view');
            } else {
                movie.classList.remove('in-view');
            }
        }
    }

    window.addEventListener('scroll', checkPosition);
    window.addEventListener('load', checkPosition);

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase();
            const movies = document.querySelectorAll('.content');
            let hasResults = false;
            resultsContainer.innerHTML = '';

            movies.forEach(movie => {
                const movieTitle = movie.querySelector('h3').textContent.toLowerCase();
                if (movieTitle.includes(searchText)) {
                    movie.classList.remove('hidden');
                    hasResults = true;
                } else {
                    movie.classList.add('hidden');
                }
            });

            if (!hasResults) {
                resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
            } else {
                resultsContainer.innerHTML = '';
            }

            checkPosition();
        });
    }

    checkPosition();
});

function generateMovieElements() {
    const movieContainer = document.getElementById('movie-container');
    
    if (movieContainer && typeof movies !== 'undefined') {
        // Sort movies array
        const sortedMovies = Object.entries(movies).sort((a, b) => {
            const titleA = a[1].title.toLowerCase();
            const titleB = b[1].title.toLowerCase();
            
            // Extract the name and number parts
            const [nameA, numA] = titleA.split(/\s+/);
            const [nameB, numB] = titleB.split(/\s+/);
            
            // If the names are the same and both have numbers, sort numerically
            if (nameA === nameB && numA && numB) {
                return parseInt(numA) - parseInt(numB);
            }
            
            // Otherwise, sort alphabetically
            return titleA.localeCompare(titleB);
        });

        sortedMovies.forEach(([id, movie]) => {
            const movieElement = document.createElement('div');
            movieElement.className = 'content';
            movieElement.innerHTML = `
                <a href="${movie.url}">
                    <h3>${movie.title}</h3>
                    <img src="${movie.image}" class='img' />
                    <p>${movie.description}</p>
                </a>
            `;
            movieContainer.appendChild(movieElement);
        });
    } else {
        console.error('Movie container or movies data not found');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId && movies[movieId]) {
        const movie = movies[movieId];
        document.title = movie.title;
        document.getElementById('movieLink').textContent = movie.title;
        document.getElementById('movieLink').href = movie.originalUrl;

        const iframe = document.getElementById('movieFrame');
        const loadingScreen = document.getElementById('loadingScreen');

        loadingScreen.style.display = 'block';
        
        const minLoadTime = 3500; // 3.5 seconds in milliseconds
        const loadStartTime = Date.now();

        iframe.src = movie.originalUrl;

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

        // Add controls and credits information to the movieInfo div
        const movieInfoContainer = document.getElementById('movieInfo');
        let movieInfoHTML = '';

        if (movie.controls) {
            movieInfoHTML += `<div class="controls"><h3>Controls:</h3>${movie.controls}</div>`;
        }

        if (movie.credits) {
            movieInfoHTML += `<div class="credits"><h3>Credits:</h3>${movie.credits}</div>`;
        }

        if (movieInfoHTML) {
            movieInfoContainer.innerHTML = movieInfoHTML;
        } else {
            movieInfoContainer.style.display = 'none';
        }

        iframe.addEventListener('error', function() {
            console.error('Failed to load movie');
            this.style.display = 'none';
            document.getElementById('movieTitle').textContent = 'Failed to load movie';
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
        console.error('Movie not found');
        document.getElementById('movieTitle').textContent = 'Movie Not Found';
        document.getElementById('movieFrame').style.display = 'none';
        document.getElementById('movieLink').style.display = 'none';
    }
});