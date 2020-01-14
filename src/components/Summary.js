import React, { useState, useEffect } from 'react';
import './Summary.css';
import { CountryActiveItem } from './CountryItems';
import { IndicatorActiveItem } from './IndicatorItems';

function Summary(props) {
  const [active, setActive] = useState(true);
  const [countries, setCountries] = useState([]);
  const [indicator, setIndicator] = useState(null); // Stores data for the selected indicator

  // For plotlyRef
  useEffect(() => {
    if (props.plotlyRef.current !== undefined && props.plotlyRef.current !== null) {
      props.plotlyRef.current.resizeHandler();
    }
  }, [active, props.plotlyRef]);

  // Fetch data for selected indicator
  const fetchSelIndicatorData = () => {
    if (props.selIndicator.length > 0) {
      let addr = `https://api.worldbank.org/v2/indicator/${props.selIndicator}?format=json`;
      fetch(addr)
        .then(response => response.json())
        .then(data => setIndicator(data[1][0]))
        .catch(err => console.log(err))
    }
    else setIndicator(null)
  }
  useEffect(fetchSelIndicatorData, [props.selIndicator]);

  // Fetch detailed data for selected countries
  const fetchSelCountriesData = () => {
    if (props.selCountries.length > 0) {
      let addr = `https://restcountries.eu/rest/v2/alpha/?codes=${props.selCountries.join(';')}`
      fetch(addr)
        .then(response => response.json())
        .then(data => setCountries(data))
        .catch(err => console.log(err));
    }
    else setCountries([]);
  }
  useEffect(fetchSelCountriesData, [props.selCountries]);

  // Create Indicator item
  let indicatorItem;
  if (indicator !== null) {
    indicatorItem = (
      <>
        <h3>Selected Indicator:</h3>
        <IndicatorActiveItem
          indicator={indicator}
        />
      </>
    );
  }

  // Remove all button
  let removeAllButton;
  if (props.selCountries.length > 0) {
    removeAllButton = (
      <button onClick={props.removeAllCountries}>
        Clear Countries
      </button>
    );
  }

  // Create Country items
  let countryItems;
  if (countries.length > 0) {
    countryItems = (
      <>
        <h3>Selected Countries:</h3>
        {countries.map(country => (
          <CountryActiveItem
            country={country}
            key={country.alpha3Code}
            toggleCountry={props.toggleCountry}
          />
        ))}
      </>
    );
  }

  

  // Create main content and return it
  let content;
  if (active) {
    content = (
      <div id="Summary">
        <div id="summary-first-line">
          <div id="summary-close-button" onClick={() => setActive(false)}>{">>"}</div>
          <div id="summary-title">Summary</div>
        </div>
        <div id="summary-indicator">
          {indicatorItem}
        </div>
        <div id="summary-countries">
          {removeAllButton}
          {countryItems}
        </div>
      </div>
    );
  }
  else {
    content = (
      <div id="summary-hidden" onClick={() => setActive(true)}>
        <div>{"<<"}</div>
      </div>
    );
  }

  return content;
}

export default Summary;
