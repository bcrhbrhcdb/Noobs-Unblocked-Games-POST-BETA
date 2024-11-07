// ratingSystem.js
document.addEventListener('DOMContentLoaded', () => {
    const gameId = new URLSearchParams(window.location.search).get('id');
    const stars = document.querySelectorAll('.star');
    const averageRating = document.getElementById('averageRating');
    const likeButton = document.getElementById('likeButton');
    const dislikeButton = document.getElementById('dislikeButton');
    const likeCount = document.getElementById('likeCount');
    const dislikeCount = document.getElementById('dislikeCount');

    let gameData = JSON.parse(localStorage.getItem(gameId)) || {
        ratings: [],
        likes: 0,
        dislikes: 0
    };

    function updateDisplay() {
        const avgRating = gameData.ratings.length ? 
            (gameData.ratings.reduce((a, b) => a + b, 0) / gameData.ratings.length).toFixed(1) : 0;
        averageRating.textContent = avgRating;
        likeCount.textContent = gameData.likes;
        dislikeCount.textContent = gameData.dislikes;

        stars.forEach((star, index) => {
            star.classList.toggle('active', index < Math.round(avgRating));
        });
    }

    function saveGameData() {
        localStorage.setItem(gameId, JSON.stringify(gameData));
    }

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            gameData.ratings.push(rating);
            updateDisplay();
            saveGameData();
        });
    });

    likeButton.addEventListener('click', () => {
        gameData.likes++;
        updateDisplay();
        saveGameData();
    });

    dislikeButton.addEventListener('click', () => {
        gameData.dislikes++;
        updateDisplay();
        saveGameData();
    });

    updateDisplay();
});