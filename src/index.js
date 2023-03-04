import Notiflix from 'notiflix';
import './css/styles.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BACE_URL = 'https://pixabay.com/api/';
const refs = {
  formRef: document.getElementById('search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtnRef: document.querySelector('.load-more'),
  inputRef: document.querySelector('input'),
};

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.loadMoreBtnRef.style.display = 'none';

refs.formRef.addEventListener('submit', onSubmitBtn);

let page = 0;

function onSubmitBtn(e) {
  e.preventDefault();
  refs.loadMoreBtnRef.style.display = 'none';
  page = 1;
  refs.galleryRef.innerHTML = '';
  const keyWord = e.target.elements.searchQuery.value.trim();

  if (keyWord !== '') {
    getPhoto(keyWord, page).then(feedback => {
      if (feedback.totalHits >= 1 && feedback.totalHits > 40) {
        Notiflix.Notify.info(`Hooray! We found ${feedback.totalHits} images.`);
        refs.loadMoreBtnRef.style.display = 'block';
      } else if (feedback.totalHits >= 1) {
        Notiflix.Notify.info(`Hooray! We found ${feedback.totalHits} images.`);
      }
      // if (feedback.hits.length > 40) {
      //   refs.loadMoreBtnRef.style.display = 'block';
      // }
    });
  }
}

refs.loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

function onLoadMoreBtnClick() {
  const searchRequest = refs.inputRef.value.trim();
  page += 1;
  getPhoto(searchRequest, page).then(feedback => {
    if (feedback.hits.length < 40) {
      refs.loadMoreBtnRef.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

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
    // else if (response.data.hits.length < 40) {
    //   refs.loadMoreBtnRef.style.display = 'none';
    // }
    // const feedback = response.data.hits;
    const feedback = response.data;

    // const totalHits = response.data.totalHits;
    // console.log(totalHits);
    galleryMarkup(feedback.hits);
    return feedback;
  } catch (error) {
    console.error(error);
  }
}

function galleryMarkup(data) {
  const dataMarkup = data
    .map(item => {
      return `<a class="photo-link" href="${item.largeImageURL}">
                <div class="photo-card">
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
                </div>
              </a>`;
    })
    .join('');
  refs.galleryRef.insertAdjacentHTML('beforeend', dataMarkup);
  simpleLightBox.refresh();
}
