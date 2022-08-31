const URL = 'https://restcountries.com/v3.1/name/';
const PROPERTY_LIST = 'name,capital,population,flags,languages';

export default function fetchCountries(name) {
  return fetch(`${URL}${name}?fields=${PROPERTY_LIST}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
