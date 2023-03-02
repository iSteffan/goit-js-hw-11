import Notiflix from 'notiflix';
import './css/styles.css';
import axios from 'axios';

const BACE_URL = 'https://pixabay.com/api/';
const refs = {
  formRef: document.getElementById('search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtnRef: document.querySelector('.load-more'),
};

refs.loadMoreBtnRef.style.display = 'none';

refs.formRef.addEventListener('submit', onSubmitBtn);
refs.loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

function onSubmitBtn(e) {
  e.preventDefault();
  const keyWord = e.target.elements.searchQuery.value;
  if (keyWord !== '') {
    getPhoto(keyWord);
    refs.loadMoreBtnRef.style.display = 'block';
  }
}

function onLoadMoreBtnClick() {}

async function getPhoto(key, page) {
  const options = {
    params: {
      key: '34039766-687567eb1e3c3ba001a14a80f',
      q: key,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(BACE_URL, options);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const feedback = response.data.hits;
    console.log(feedback);
    galleryMarkup(feedback);
  } catch (error) {
    console.error(error);
  }
}

function galleryMarkup(data) {
  const dataMarkup = data
    .map(item => {
      return `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.galleryRef.insertAdjacentHTML('beforeend', dataMarkup);
}

// function countrySearch(event) {
//   const countryName = event.target.value.trim();
//   clearInfo();

//   if (countryName !== '') {
//     fetchCountries(countryName).then(countryData => {
//       console.log(countryData);

//       if (countryData.length > 10) {
//         Notiflix.Notify.info(
//           'Too many matches found. Please enter a more specific name.'
//         );
//       } else if (countryData.length === 0) {
//         Notiflix.Notify.failure('Oops, there is no country with that name');
//       } else if (countryData.length >= 2 && countryData.length <= 10) {
//         renderCountriesList(countryData);
//       } else {
//         renderCountry(countryData);
//       }
//     });
//   }
// }

// function clearInfo() {
//   refs.countryList.innerHTML = '';
//   refs.countryInfo.innerHTML = '';
// }
