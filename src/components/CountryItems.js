import React from 'react';
import './CountryItems.css';

export const CountryInactiveItem = (props) => (
  <div 
    id="CountryInactiveItem" 
    onClick={_ => props.toggleCountry(props.country.alpha3Code)}
    style={props.active ? {"backgroundColor": "darkblue", "color": "wheat"} : {}}  
  >
    <div id="country-inactive-names">
      <div id="country-inactive-name">{props.country.name}</div>
      <div id="country-inactive-native-name">
        {props.country.nativeName === props.country.name ? "" : props.country.nativeName}
      </div>
    </div>
    <div id="country-inactive-flag">
      <img src={props.country.flag} alt=""/>
    </div>
  </div>
);

export const CountryActiveItem = (props) => (
  <div id="CountryActiveItem"  onClick={_ => props.toggleCountry(props.country.alpha3Code)}>
    <div id="country-active-first-line">
      <div id="country-active-alpha3Code">{props.country.alpha3Code}</div>
      <div id="country-active-title">{props.country.name}</div>
    </div>
    <div id="country-active-first-block">
      <div id="country-active-first-block-left">
        <div id="country-active-flag"><img src={props.country.flag} alt=""/></div>
      </div>
      <div id="country-active-first-block-right">
        <div id="country-active-name"><strong>Native name: </strong>{props.country.nativeName}</div>
        <div id="country-active-capital"><strong>Capital: </strong>{props.country.capital}</div>
        <div id="country-active-region"><strong>Region: </strong>{props.country.region} ({props.country.subregion})</div>
      </div>
    </div>
    <div id="country-active-num">
      <div id="country-active-pop"><strong>Population: </strong>{new Intl.NumberFormat('en-US').format(props.country.population)}</div>
      <div id="country-active-area"><strong>Area: </strong>{new Intl.NumberFormat('en-US').format(props.country.area)}</div>
    </div>
    <div id="country-active-lang">
      <strong>Languages: </strong>{props.country.languages.map(l => l.name).join(', ')}
    </div>
  </div>
); 