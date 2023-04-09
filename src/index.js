import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotos } from './js/getPhotos';
import { createGallery } from './js/markup';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more')

const lightbox = new SimpleLightbox('.gallery a');

let page;
let searchQuery = '';
let summaryHits;

formEl.addEventListener('submit', handleSearchPhotos);

async function handleSearchPhotos(evt) {
    evt.preventDefault();
    searchQuery = evt.target.elements.searchQuery.value.trim();
    page = 1;
    summaryHits = 0;

    galleryEl.innerHTML = '';
    
    if (!searchQuery) return;

    try {
        const { data } = await getPhotos(searchQuery, page);

        if (data.totalHits === 0) {
            throw new Error();
        } else {
            Notify.success(`Hooray! We found ${data.totalHits} images.`, {
            fontSize: '15px',
        });
            galleryEl.innerHTML = createGallery(data.hits);
            lightbox.refresh();
            summaryHits += data.hits.length;
        }
            
        if (data.totalHits > 40) {
            loadMoreBtnEl.classList.remove('is-hidden');
        } else {
            loadMoreBtnEl.classList.add('is-hidden');
        }

    } catch (error) {
        error => console.log(error);
        loadMoreBtnEl.classList.add('is-hidden')
        return Notify.failure(`Sorry, there are no images matching your search query. Please try again.`, {
            fontSize: '15px',
        });
    }
}

loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick)

async function handleLoadMoreBtnClick() {
    page += 1;

    try {
        const { data } = await getPhotos(searchQuery, page);

        summaryHits += data.hits.length;
        galleryEl.insertAdjacentHTML('beforeend', createGallery(data.hits));
        lightbox.refresh();

        const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 1.7,
        behavior: "smooth",
        });

        if (summaryHits === data.totalHits) {
            Notify.warning(`We're sorry, but you've reached the end of search results.`, {
            fontSize: '15px',
        });
            loadMoreBtnEl.classList.add('is-hidden');
            page = 1;
            summaryHits = 0;
            formEl.reset();
        }
    } catch (error) {
        error => console.log(error);
         return Notify.failure(`Sorry, there are no images matching your search query. Please try again.`, {
            fontSize: '15px',
        });
    }
}
