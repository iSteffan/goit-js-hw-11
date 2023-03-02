import axios from 'axios';
import Notiflix from 'notiflix';
import { galleryMarkup } from '../index';

const BACE_URL = 'https://pixabay.com/api/';

export async function getPhoto(key, page) {
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
    const feedback = await response.json();
    return feedback;
  } catch (error) {
    console.error(error);
  }
}
