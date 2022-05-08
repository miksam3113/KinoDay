const API_KEY = '9e255f4d-0362-42cc-968c-c5becf06f282';
const API_URL_TOP_POPULAR_100 =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH =
  'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_AB_FILM = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

async function getfilms(url, api) {
  fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': api,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => loadfilms(json));
}

async function getInfoFilm(url, api) {
  fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': api,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => openpopap(json));
}

function verifyrating(rating) {
  if (rating[rating.length - 1] == '%') {
    rating = parseInt(rating, 10) / 10;
    return rating.toFixed(1);
  } else {
    return rating;
  }
}

function getrating(rating) {
  if (rating[rating.length - 1] == '%') {
    rating = parseInt(rating, 10) / 10;
    rating = rating.toFixed(1);
  }
  if (rating >= 7) {
    return 'rat_green';
  }
  if (rating > 5 && rating < 7) {
    return 'rat_orange';
  }
  if (rating <= 5) {
    return 'rat_red';
  }
}

function loadfilms(obj) {
  console.log(obj);
  const films = document.getElementById('films');
  films.innerHTML = '';
  for (let i in obj.films) {
    films.innerHTML += `
    <div class="all_film">
      <div data-id="${obj.films[i].filmId}" id="film${i}" class="film">
        <img src="${obj.films[i].posterUrlPreview}" class="img_film"">
        <span onclick="funon()" class="img_mask"></span>
        <div class="rating ${getrating(obj.films[i].rating)}">${verifyrating(
      obj.films[i].rating
    )}</div>
      </div>
      <p class="name_film">${obj.films[i].nameRu}</p>
      <p class="genre_film">${obj.films[i].genres.map(
        (genre) => ` ${genre.genre}`
      )}</p>
    </div>`;
  }
}

getfilms(API_URL_TOP_POPULAR_100, API_KEY);

const form = document.querySelector('form');
const inp_search = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const searchurl = API_URL_SEARCH + inp_search.value;
  if (inp_search.value) {
    getfilms(searchurl, API_KEY);
    searchurl.value = '';
  }
});

function funon() {
  for (let i = 0; i < 20; i++) {
    const film_popap = document.getElementById(`film${i}`);
    film_popap.onclick = () => {
      const url_id_film = API_URL_AB_FILM + film_popap.dataset.id;
      getInfoFilm(url_id_film, API_KEY);
    };
  }
}

function openpopap(obj) {
  console.log(obj);
  const films = document.getElementById('films');
  films.innerHTML += `
    <div id="popap" class="popap">
      <div class="popap_body">
          <img class="img_popap" src="${obj.posterUrlPreview}">
          <div class="div_popap">
              <p class="p_name_film">${obj.nameRu}</p>
              <p class="p_year">Год выпуска: ${obj.year}</p>
              <p class="p_countrie">Страна: ${obj.countries.map(
                (country) => ` ${country.country}`
              )}</p>
              <p class="p_genre">Жанр: ${obj.genres.map(
                (genre) => ` ${genre.genre}`
              )}</p>
              <p class="p_slogan">Слоган: ${obj.slogan}</p>
              <p class="p_time">Время: ${obj.filmLength} мин</p>
              <p max="300" class="p_description">${obj.description}</p>
          </div>
          <button id="close" class="close">
            <img class="close_img"src="close.png">
          </button>
      </div>
    </div>`;
  let close = document.getElementById('close');
  close.addEventListener('click', () => {
    window.setTimeout(function removethis() {
      let popup = document.getElementById('popap');
      popup.style.display = 'none';
    }, 800);
    window.location.reload();
  });
  let popap = document.querySelector('.popap');
  document.addEventListener('click', (e) => {
    if (e.target === popap) {
      window.setTimeout(function removethis() {
        let popup = document.getElementById('popap');
        popup.style.display = 'none';
      }, 800);
      window.location.reload();
    }
  });
}
