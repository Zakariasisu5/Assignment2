// Movie Discovery App - Search functionality with Watchlist
const apiKey = '36093bfa';
let watchlist = []; // Array to store watchlist movies

// Event listener for search button
document.getElementById('search-button').addEventListener('click', searchMovies);

// Event listener for theme toggle
document.getElementById('toggle-theme').addEventListener('click', toggleTheme);

// Add keyboard support for search
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
