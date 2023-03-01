import axios from 'axios';

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
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
