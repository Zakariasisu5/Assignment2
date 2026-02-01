
const apiKey = '36093bfa';
let watchlist = []; // Array to store watchlist movies


document.getElementById('search-button').addEventListener('click', searchMovies);


document.getElementById('toggle-theme').addEventListener('click', toggleTheme);


document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
});
// Search movies function
function searchMovies() {
    const query = document.getElementById('search-input').value.trim();
    
    if (!query) {
        document.getElementById('movie-results').innerHTML = 'Please enter a movie name.';
        return;
    }
    
    if (query.length < 2) {
        document.getElementById('movie-results').innerHTML = 'Please enter at least 2 characters.';
        return;
    }
    
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    document.getElementById('movie-results').innerHTML = '🎬 Searching for movies...';

 // Fetch movies from OMDb API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                document.getElementById('movie-results').innerHTML = `No movies found. ${data.Error || ''}`;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            let errorMessage = 'Error fetching data. ';
            if (!navigator.onLine) {
                errorMessage += 'Please check your internet connection.';
            } else {
                errorMessage += 'Please try again later.';
            }
            document.getElementById('movie-results').innerHTML = `<div class="error-message">${errorMessage}</div>`;
        });
}

// Display movies function
function displayMovies(movies) {
    const resultsContainer = document.getElementById('movie-results');
    resultsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        const posterImg = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150?text=No+Image';
        
        card.innerHTML = `
            <img src="${posterImg}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button class="add-watchlist-btn">Add to Watchlist</button>
        `;
// Add event listener to watchlist button
        card.querySelector('.add-watchlist-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addToWatchlist(movie);
        });
        
        resultsContainer.appendChild(card);
    });
}

// Add movie to watchlist
function addToWatchlist(movie) {
    if (!watchlist.find(m => m.imdbID === movie.imdbID)) {
        watchlist.push(movie);
        renderWatchlist();
        showFeedback(`"${movie.Title}" added to watchlist!`, 'success');
    } else {
        showFeedback(`"${movie.Title}" is already in your watchlist!`, 'warning');
    }
}

// Render watchlist
function renderWatchlist() {
    const watchlistContainer = document.getElementById('watchlist-items');
    watchlistContainer.innerHTML = '';
    
    watchlist.forEach(movie => {
        const item = document.createElement('div');
        item.className = 'watchlist-card';
        
        const posterImg = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150?text=No+Image';
        
        item.innerHTML = `
            <img src="${posterImg}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button class="remove-btn">Remove</button>
        `;
        
        // Add event listener to remove button
        item.querySelector('.remove-btn').addEventListener('click', () => {
            removeFromWatchlist(movie.imdbID);
        });
        
        watchlistContainer.appendChild(item);
    });
}

// Remove from watchlist
function removeFromWatchlist(imdbID) {
    const movieToRemove = watchlist.find(movie => movie.imdbID === imdbID);
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    renderWatchlist();
    if (movieToRemove) {
        showFeedback(`"${movieToRemove.Title}" removed from watchlist!`, 'info');
    }
}

// Show user feedback
function showFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

// Toggle theme function
function toggleTheme() {
    const btn = document.getElementById('toggle-theme');
    const icon = btn ? btn.querySelector('.theme-icon') : null;
    const isDark = document.body.classList.toggle('dark-mode');
    if (btn) btn.setAttribute('aria-pressed', isDark);
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
        // ignore storage errors
    }
}

// Initialize theme on load
(function initTheme() {
    const btn = document.getElementById('toggle-theme');
    const icon = btn ? btn.querySelector('.theme-icon') : null;
    let isDark = false;
    try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark = saved ? saved === 'dark' : prefersDark;
    } catch (e) {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) document.body.classList.add('dark-mode');
    if (btn) btn.setAttribute('aria-pressed', isDark);
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
})();
