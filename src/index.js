import './css/styles.css';

import countryCard from "./card.hbs";
import countryName from "./country.hbs";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import {fetchCountries} from "./fetchCountries";

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),

};
const DEBOUNCE_DELAY = 300;
refs.input.addEventListener('input', debounce(сountrySearch, DEBOUNCE_DELAY));

function сountrySearch(event) {
    event.preventDefault();
    const inputValue = event.target.value.trim();
    if (inputValue === '') {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }

    fetchCountries(inputValue)
        .then(country => {
            if (country === undefined) {
                throw new Error('Country not found');
            }

            if (country.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                return;
            }
            
            refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
            country.forEach(item => {
                const markupList = countryName(item);
                refs.countryList.insertAdjacentHTML('beforeend', markupList);
          
                if (country.length === 1) {
                    const markup = countryCard(item);
                    refs.countryInfo.insertAdjacentHTML('afterbegin', markup);
                    refs.countryList.innerHTML = '';
                }
            })
        })
        .catch(Error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
    })
}
