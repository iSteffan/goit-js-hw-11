import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

function countrySearch(event) {
  const countryName = event.target.value.trim();
  clearInfo();

  if (countryName !== '') {
    fetchCountries(countryName).then(countryData => {
      console.log(countryData);

      if (countryData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countryData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (countryData.length >= 2 && countryData.length <= 10) {
        renderCountriesList(countryData);
      } else {
        renderCountry(countryData);
      }
    });
  }
}

function renderCountriesList(countries) {
  const countriesMarkup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="60">
         <p>${country.name.official}</p>
                </li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', countriesMarkup);
}

function renderCountry(oneCountry) {
  const countryMarkup = oneCountry
    .map(country => {
      return `
      <ul>
        <li>
          <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width=50 height=40>
          <p><b>${country.name.official}</b></p>
        </li>
        <li>
          <p><b>Capital:</b> ${country.capital}</p>
        </li>
        <li>
          <p><b>Population:</b> ${country.population}</p>
        </li>
        <li>
          <p><b>Languages:</b> ${Object.values(country.languages)}</p>
        </li>
      </ul>`;
    })
    .join('');

  refs.countryInfo.insertAdjacentHTML('beforeend', countryMarkup);
}

function clearInfo() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
