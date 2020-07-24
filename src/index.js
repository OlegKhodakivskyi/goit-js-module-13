import * as basicLightbox from 'basiclightbox';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import imageTemplate from './templates/imageTemplate.hbs';
import './styles.css';

const search = document.querySelector('.search');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.btn-loadMore');
const searchBtn = document.querySelector('.searchBtn');
const searchForm = document.querySelector('.search-form');
const axios = require('axios');
const apiKey = '17617972-3da791f5653deb15d8df96d4c';

let searchObj = '';
let pageNum = 1;
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchObj = e.currentTarget.elements.searFormName.value;
  e.currentTarget.reset();
  loadBtn.classList.add('hidden');
  pageNum = 1;
  axiosImages(searchObj, pageNum).then(response => {
    if (response.data.hits.length === 0) {
      return PNotify.error({
        text: 'No match found',
      });
    }

    markupImg(response);
    pageNum += 1;
    loadBtn.classList.remove('hidden');
  });
});

loadBtn.addEventListener('click', () => {
  axiosImages(searchObj, pageNum).then(response => {
    loadMoreMarkUp(response);
    pageNum += 1;
    window.scrollTo({
      top: frame.contentWindow.pageXOffset,
      behavior: 'smooth',
    });
  });
});

function markupImg(response) {
  const markup = imageTemplate(response.data.hits);
  gallery.innerHTML = markup;
}

function loadMoreMarkUp(response) {
  const markup = imageTemplate(response.data.hits);
  gallery.insertAdjacentHTML('beforeend', markup);
}

function axiosImages(searchObj, pageNum = 1) {
  if (searchObj !== '') {
    return axios.get(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchObj}&page=${pageNum}&per_page=12&key=${apiKey}`,
    );
  }
}

gallery.addEventListener('click', e => {
  if (e.target.nodeName === 'IMG') {
    const instance = basicLightbox.create(`
            <img src="${e.target.dataset.source}" width="1200" height="800">
        `);
    // console.log();
    instance.show();
  }
});
