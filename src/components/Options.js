import React, { useState, useEffect } from 'react';
import './Options.css';
import { CountryInactiveItem } from './CountryItems';
import { IndicatorInactiveItem } from './IndicatorItems';
// import * as apiCalls from '../api'

const INDICATORS_PER_PAGE = 10;

function Options(props) {
  const [active, setActive] = useState(true);
  const [type, setType] = useState('countries'); // can be either countries or indicators
  const [countries, setCountries] = useState([]);
  const [topics, setTopics] = useState([])
  const [currTopic, setCurrTopic] = useState("0");
  // For pagination on indicators
  const [nPages, setNPages] = useState(null);
  const [currPage, setCurrPage] = useState(null);
  const [indicators, setIndicators] = useState([]);
  // For choosing subregion
  const [subregionCountries, setSubregionCountries] = useState([]);
  const [subregion, setSubregion] = useState("all")

  // For plotlyRef
  useEffect(() => {
    if (props.plotlyRef.current !== undefined && props.plotlyRef.current !== null) {
      props.plotlyRef.current.resizeHandler();
    }
  }, [active, props.plotlyRef]);

  // Load initial country data at the beginning
  const fetchInitialCountryData = () => {
    let addr = "https://restcountries.eu/rest/v2/all?fields=name;alpha3Code;flag;nativeName;subregion";
    fetch(addr)
      .then(response => response.json())
      .then(data => {
        setCountries(data);
        setSubregionCountries(data);
      })
      .catch(err => console.log(err));
  }
  useEffect(fetchInitialCountryData, []);

  // Choose countries depending on selected subregion
  const filterSubregionCountries = () => {
    if (subregion === "all") setSubregionCountries([...countries]);
    else setSubregionCountries(countries.filter(country => country.subregion === subregion));
  }
  useEffect(filterSubregionCountries, [subregion]);

  // Load initial topics
  const fetchInitialTopics = () => {
    let addr = "https://api.worldbank.org/v2/topic?format=json";
    fetch(addr)
      .then(response => response.json())
      .then(data => setTopics(data[1]))
      .catch(err => console.log(err));
  }
  useEffect(fetchInitialTopics, []);

  // Load indicators when topics change
  const fetchIndicatorsForTopic = () => {
    if (currTopic !== "0") {
      let addr = `https://api.worldbank.org/v2/topic/${currTopic}/indicator?format=json&per_page=${INDICATORS_PER_PAGE}`;
      fetch(addr)
        .then(response => response.json())
        .then(data => {
          setCurrPage(data[0].page);
          setNPages(data[0].total);
          setIndicators(data[1])
        })
        .catch(err => console.log(err));
    }
    else {
      setIndicators([]);
      setCurrPage(0);
      setNPages(0);
    }
  }
  useEffect(fetchIndicatorsForTopic, [currTopic]);

  // When click on next page
  const getPageForTopic = (page) => {
    let addr = `https://api.worldbank.org/v2/topic/${currTopic}/indicator?format=json&per_page=${INDICATORS_PER_PAGE}&page=${page}`
    fetch(addr)
      .then(response => response.json())
      .then(data => {
        setCurrPage(data[0].page);
        setNPages(data[0].total);
        setIndicators(data[1]);
      })
      .catch(err => console.log(err));
  }

  // Create buttons for pagination on indicators for topic
  let paginationButtons;
  if (type==="indicators" && currTopic !== "0") {
    paginationButtons = (
      <div id="options-pagination">
        <button onClick={()=>getPageForTopic(currPage-1)} disabled={currPage<=1}>{"<"}</button>
        <button onClick={()=>getPageForTopic(currPage+1)} disabled={currPage>=nPages}>{">"}</button>
      </div>

    );
  }


  // Create indicator items
  let indicatorElements;
  if (type === 'indicators') {
    indicatorElements = (
      <div id="options-indicators">
        {indicators.map(i => (
          <IndicatorInactiveItem
            key={i.id}
            indicator={i}
            setSelIndicator={props.setSelIndicator}
            active={i.id === props.selIndicator}
          />
        ))}
      </div>
    );
  }

  // Create select for topics
  let topicSelect;
  if (type === 'indicators') {
    topicSelect = (
      <select
        onChange={e => setCurrTopic(e.target.value)}
        value={currTopic}
        id="options-select-topic"
      >
        <option key={0} value={0}>Please Choose a Topic</option>
        {topics.map(t => (<option key={t.id} value={t.id}>{t.value}</option>))}
      </select>
    );
  }

  // Create descriptive text for topics
  let topicDescriptiveText;
  if (type === 'indicators' && currTopic > 0) {
    topicDescriptiveText = (
      <div id="options-topics-description">
        {topics.filter(t => t.id === currTopic)[0].sourceNote}
      </div>
    );
  }

  // Selection for subregion
  let selectSubregions;
  if (type === 'countries') {
    let subregions = Array.from(new Set(countries.map(d => d.subregion).filter(subr => subr.length>0)));
    selectSubregions = (
      <select 
        id="options-select-subregion"
        value={subregion}
        onChange={e => setSubregion(e.target.value)}>
        <option value={"all"} key={"all"}>All subregions</option>
        {subregions.map(subregion => (<option key={subregion}>{subregion}</option>))}
      </select>
    );
  }

  // button to add all countries if subregion chosen
  let addAllButton;
  // if (type === "countries" && subregion !== "all") {
  if (type === "countries") {
    addAllButton = (
      <button 
        onClick={() => props.addCountries(subregionCountries)} 
      >Add All</button>
    );
  } 

  // Create Country data
  let countryItems;
  if (type === 'countries') {
    countryItems = subregionCountries.map(c => (
      <CountryInactiveItem
        country={c}
        key={c.alpha3Code}
        toggleCountry={props.toggleCountry}
        active={props.selCountries.includes(c.alpha3Code)}
      />
    ));
  }


  // Create form for types (countries or indicators)
  let radioForm = (
    <form id="options-form" onChange={e => setType(e.target.value)}>
        <label>
          <input type="radio" value="countries" name="type" defaultChecked={type === "countries"} />
          Countries
        </label>
        <label>
          <input type="radio" value="indicators" name="type" defaultChecked={type === "indicators"} />
          Indicators
        </label>
    </form>
  );

  // Create main content and return it
  let content;
  if (active) {
    content = (
      <div id="Options">
        <div id="options-first-line">
          <div id="options-title">Options</div>
          <div id="options-close-button" onClick={() => setActive(false)}>{"<<"}</div>
        </div>
        {radioForm}
        {selectSubregions}
        {addAllButton}
        <div id="options-country-items">
          {countryItems}
        </div>
        {topicSelect}
        {topicDescriptiveText}
        {paginationButtons}
        {indicatorElements}
        {paginationButtons}
      </div>
    );
  }
  else {
    content = (
      <div id="options-hidden" onClick={() => setActive(true)}>
        <div>{">>"}</div>
      </div>
    );
  }

  return content;
}

export default Options;
