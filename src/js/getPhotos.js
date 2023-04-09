import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35112735-b4e2285ff6f08a1060a0a355b';

export const getPhotos = async (searchQuery, page) => {
    return await axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      q: searchQuery,
      page: page,
    }
  });
}
