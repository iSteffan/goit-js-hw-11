import './css/styles.css';
import axios from 'axios';

import Pagination from 'tui-pagination';

const refs = {
  formRef: document.getElementById('search-form'),
  galleryRef: document.querySelector('.gallery'),
};

const BACE_URL = 'https://api.themoviedb.org/3';

const API_KEY = '8776cc9f66dd32d7c5ecc9b66eb74c99';

refs.formRef.addEventListener('submit', onSubmitBtn);

const container = document.getElementById('tui-pagination-container');

function onSubmitBtn(e) {
  e.preventDefault();
  const keyWord = e.target.elements.searchQuery.value.trim();

  // getMovieByName(keyWord);
  getMovie(keyWord).then(data => {
    // по даті 0 малюєм пагінацію
    const instance = new Pagination(container, {
      totalItems: data[0],
      itemsPerPage: 20,
      visiblePages: 5,
    });

    refs.galleryRef.insertAdjacentHTML('beforeend', galleryMarkup(data[1]));
    // по даті 1 малюєм картку
    console.log('масив на 1й сторінці', data[1]);

    // слухач на пагінацію
    instance.on('beforeMove', event => {
      const currentPage = event.page;

      // робимо запит мо тому самому keyWord тільки змінюємо сторінки
      getMovie(keyWord, currentPage).then(data => {
        console.log('масив на вибраній сторінці', data);
      });
    });
  });
}

async function getMovie(name, page = 1) {
  try {
    // Створюєм запит по ключовому слову на сервер
    const movies = await axios.get(
      `${BACE_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=false&query=${name}`
    );

    // Створюєм запит на сервер для отримання всіх жанрів
    const genres = await axios.get(
      `${BACE_URL}//genre/movie/list?api_key=${API_KEY}&language=en-US`
    );

    // Масиви з кінами та жанрами
    const movieArr = movies.data.results;
    const genresArr = genres.data.genres;

    // перебираємо масив кін, підставляємо в масив з жанрами замість чисел - відповідні їм жанри
    const updatedMovies = movieArr.map(movie => {
      const updatedGenreName = movie.genre_ids.map(genreId => {
        const genre = genresArr.find(genre => genre.id === genreId);
        return genre.name;
      });

      return {
        ...movie,
        genre_ids: updatedGenreName,
      };
    });

    // console.log('мап', updatedMovies);
    console.log('чистий бекенд', movies.data);
    console.log('масив з кінами', movieArr);
    console.log('масив з жанрами', genresArr);
    if (page === 1) {
      return [movies.data.total_results, updatedMovies];
    } else {
      return updatedMovies;
    }
  } catch (error) {
    console.error(error);
  }
}

function galleryMarkup(data) {
  const dataMarkup = data
    .map(item => {
      return `<div class="photo-card">
                <img src="${item.poster_path}" alt=""/>
              </div>`;
    })
    .join('');

  return dataMarkup;
}

// async function getMovieByName(name) {
//   try {
//     // Створюєм запит по ключовому слову на сервер
//     const movie = await axios.get(
//       `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${name}`
//     );

//     console.log(movie.data);
//     return movie.data;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function getGenres() {
//   try {
//     const responseGenres = await axios.get(
//       `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
//     );

//     console.log(responseGenres);

//     return responseGenres;
//   } catch (error) {
//     console.error(error);
//   }
// }
// const a = [
//   [
//     {
//       adult: false,
//       backdrop_path: '/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg',
//       genre_ids: [16, 10751, 14],
//     },
//     {
//       adult: false,
//       backdrop_path: '/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg',
//       genre_ids: [16, 99, 14],
//     },
//   ],
// ];
// const b = [
//   { id: 28, name: 'Action' },
//   { id: 12, name: 'Adventure' },
//   { id: 16, name: 'Animation' },
//   { id: 35, name: 'Comedy' },
//   { id: 80, name: 'Crime' },
//   { id: 99, name: 'Documentary' },
//   { id: 18, name: 'Drama' },
//   { id: 10751, name: 'Family' },
//   { id: 14, name: 'Fantasy' },
//   { id: 36, name: 'History' },
//   { id: 27, name: 'Horror' },
//   { id: 10402, name: 'Music' },
//   { id: 9648, name: 'Mystery' },
//   { id: 10749, name: 'Romance' },
//   { id: 878, name: 'Science Fiction' },
//   { id: 10770, name: 'TV Movie' },
//   { id: 53, name: 'Thriller' },
//   { id: 10752, name: 'War' },
//   { id: 37, name: 'Western' },
// ];

// -----------------------------------------------------------------------------------------------------------
// const BACE_URL = 'https://pixabay.com/api/';
// const refs = {
//   formRef: document.getElementById('search-form'),
//   galleryRef: document.querySelector('.gallery'),
//   loadMoreBtnRef: document.querySelector('.load-more'),
//   inputRef: document.querySelector('input'),
// };

// const simpleLightBox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// refs.loadMoreBtnRef.style.display = 'none';

// refs.formRef.addEventListener('submit', onSubmitBtn);

// let page = 0;

// function onSubmitBtn(e) {
//   e.preventDefault();
//   refs.loadMoreBtnRef.style.display = 'none';
//   page = 1;
//   refs.galleryRef.innerHTML = '';
//   const keyWord = e.target.elements.searchQuery.value.trim();

//   if (keyWord !== '') {
//     getPhoto(keyWord, page).then(feedback => {
//       if (feedback.totalHits >= 1 && feedback.totalHits > 40) {
//         Notiflix.Notify.info(`Hooray! We found ${feedback.totalHits} images.`);
//         refs.loadMoreBtnRef.style.display = 'block';
//       } else if (feedback.totalHits >= 1) {
//         Notiflix.Notify.info(`Hooray! We found ${feedback.totalHits} images.`);
//       }
//       // if (feedback.hits.length > 40) {
//       //   refs.loadMoreBtnRef.style.display = 'block';
//       // }
//     });
//   }
// }

// refs.loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

// function onLoadMoreBtnClick() {
//   const searchRequest = refs.inputRef.value.trim();
//   page += 1;
//   getPhoto(searchRequest, page).then(feedback => {
//     if (feedback.hits.length < 40) {
//       refs.loadMoreBtnRef.style.display = 'none';
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//   });
// }

// async function getPhoto(key, page) {
//   const options = {
//     params: {
//       key: '34039766-687567eb1e3c3ba001a14a80f',
//       q: key,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       page: page,
//       per_page: 40,
//     },
//   };

//   try {
//     const response = await axios.get(BACE_URL, options);
//     if (response.data.hits.length === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }
//     // else if (response.data.hits.length < 40) {
//     //   refs.loadMoreBtnRef.style.display = 'none';
//     // }
//     // const feedback = response.data.hits;
//     const feedback = response.data;

//     // const totalHits = response.data.totalHits;
//     // console.log(totalHits);
//     galleryMarkup(feedback.hits);
//     return feedback;
//   } catch (error) {
//     console.error(error);
//   }
// }

// function galleryMarkup(data) {
//   const dataMarkup = data
//     .map(item => {
//       return `<a class="photo-link" href="${item.largeImageURL}">
//                 <div class="photo-card">
//                   <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
//                   <div class="info">
//                     <p class="info-item">
//                       <b>Likes</b>
//                       ${item.likes}
//                     </p>
//                     <p class="info-item">
//                       <b>Views</b>
//                       ${item.views}
//                     </p>
//                     <p class="info-item">
//                       <b>Comments</b>
//                       ${item.comments}
//                     </p>
//                     <p class="info-item">
//                       <b>Downloads</b>
//                       ${item.downloads}
//                     </p>
//                   </div>
//                 </div>
//               </a>`;
//     })
//     .join('');
//   refs.galleryRef.insertAdjacentHTML('beforeend', dataMarkup);
//   simpleLightBox.refresh();
// }
