const apiKey = 'f3e6ffebe13a6082e65b15128d0d19f4';
const moviesGrid = document.getElementById('moviesGrid');
const tvShowsGrid = document.getElementById('tvShowsGrid');
const pagination = document.getElementById('pagination');

let currentPage = 1;
let totalPages = 1;
let currentCategory = 'popular';
let currentType = 'movie';

document.getElementById('moviesTab').addEventListener('click', () => {
  switchTab('movies', 'movie');
});

document.getElementById('tvShowsTab').addEventListener('click', () => {
  switchTab('tvShows', 'tv');
});

document.getElementById('popularTab').addEventListener('click', () => {
  switchCategory('popular');
});

document.getElementById('latestTab').addEventListener('click', () => {
  switchCategory('latest');
});

const switchTab = (tab, type) => {
  currentType = type;
  document.getElementById('moviesTab').classList.toggle('active', type === 'movie');
  document.getElementById('tvShowsTab').classList.toggle('active', type === 'tv');
  document.getElementById('moviesTab').ariaPressed = (type === 'movie');
  document.getElementById('tvShowsTab').ariaPressed = (type === 'tv');
  moviesGrid.style.display = type === 'movie' ? 'grid' : 'none';
  tvShowsGrid.style.display = type === 'tv' ? 'grid' : 'none';
  fetchContent();
};

const switchCategory = (category) => {
  currentCategory = category;
  document.getElementById('popularTab').classList.toggle('active', category === 'popular');
  document.getElementById('latestTab').classList.toggle('active', category === 'latest');
  document.getElementById('popularTab').ariaSelected = (category === 'popular');
  document.getElementById('latestTab').ariaSelected = (category === 'latest');
  currentPage = 1;
  fetchContent();
};

const fetchContent = async () => {
  const grid = currentType === 'movie' ? moviesGrid : tvShowsGrid;
  grid.innerHTML = '';
  let url = `https://api.themoviedb.org/3/${currentType}/${currentCategory}?api_key=${apiKey}&page=${currentPage}`;
  if (currentCategory === 'latest') {
    url = currentType === 'movie'
      ? `https://api.themoviedb.org/3/movie/now_playing?language=en-US&include_adult=false&api_key=${apiKey}&page=${currentPage}`
      : `https://api.themoviedb.org/3/tv/airing_today?language=en-US&include_adult=false&api_key=${apiKey}&page=${currentPage}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  totalPages = data.total_pages;
  data.results.forEach(item => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    img.alt = item.title || item.name;
    img.addEventListener('click', () => showDetails(item.id));
    grid.appendChild(img);
  });
  updatePagination();
};

const updatePagination = () => {
  pagination.innerHTML = '';
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.addEventListener('click', () => {
      currentPage--;
      fetchContent();
    });
    pagination.appendChild(prevButton);
  }
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      currentPage++;
      fetchContent();
    });
    pagination.appendChild(nextButton);
  }
};

const showDetails = (id) => {
  const type = currentType === 'movie' ? 'movie' : 'tv';
  window.location.href = `details.html?id=${id}&type=${type}`;
};

document.getElementById('watchlistTab').addEventListener('click', () => {
  window.location.href = 'watchlist.html';
});

fetchContent();
