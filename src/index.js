import './css/styles.css';
import fetchCountries from './components/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import '../node_modules/notiflix/dist/notiflix-aio-3.2.5.min.js';

const DEBOUNCE_DELAY = 300;
let value;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput(e) {
  value = e.target.value.trim();
  if (value.length === 0) {
    clearCountryInfo();
    clearCountryList();
    return;
  }
  if (value.length === 1) {
    showInfo();
    return;
  }
  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        showInfo();
        return;
      } else if (data.length > 1) {
        clearCountryInfo();
        addItemsInCountryList(data);
      } else {
        console.log(data);
        clearCountryList();
        addTagsInCountryInfo(data[0]);
      }
    })
    .catch(() => {
      showError();
    })
    .finally(() => {
      value = '';
    });
}

function renderCountresList(arr) {
  return arr
    .map(
      ({ name: { official }, flags }) =>
        `<li class="item"><img src="${flags.svg}" alt="flag" width="40px" height="26"></img>${official}</li>`
    )
    .join('');
}

function renderCountryInfo({
  flags: { svg },
  name: { official },
  capital,
  population,
  languages,
}) {
  return `<div class="flag-name">
  <img src="${svg}" alt="flag" width="40px" height="26">
  <h1>${official}</h1>
  </div><p>Capital: <span>${capital}</span></p>
  <p>Population: <span>${population}</span></p>
  <p>Languages: <span>${Object.values(languages)}</span></p>`;
}

function addItemsInCountryList(data) {
  refs.countryList.innerHTML = renderCountresList(data);
}

function addTagsInCountryInfo(data) {
  refs.countryInfo.innerHTML = renderCountryInfo(data);
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function showInfo() {
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function showError() {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}
