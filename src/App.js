import React, { useState, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import Options from './components/Options'
import Plots from './components/Plots'
import Summary from './components/Summary'

function App() {
  const [selCountries, setSelCountries] = useState([]); //Stores countries IDs
  const [selIndicator, setSelIndicator] = useState(''); // Stores indicator ID

  // Plotly ref
  const plotlyRef = useRef();

  // Add or remove countries.
  const toggleCountry = (countryId) => {
    if (selCountries.includes(countryId)) setSelCountries(selCountries.filter(c => c!==countryId)); 
    else setSelCountries([...selCountries, countryId]);
  }

  // Add countries (for add all button)
  const addCountries = (countries) => {
    let countryIds = countries.map(country => country.alpha3Code);
    let newCountries = countryIds.filter(countryId => !selCountries.includes(countryId));
    setSelCountries([...selCountries, ...newCountries]);
  }

  // Remove countries (for remove all button)
  const removeAllCountries = () => {
    setSelCountries([]);
  }


  return (
    <div id="App">
      <Navbar />
      <div id="app-main-content">
        <Options 
          selCountries={selCountries}
          selIndicator={selIndicator}
          toggleCountry={toggleCountry}
          setSelIndicator={setSelIndicator}
          addCountries={addCountries}
          plotlyRef={plotlyRef}
          />
        <Plots 
          selCountries={selCountries}
          selIndicator={selIndicator}
          plotlyRef={plotlyRef}
          />
        <Summary 
          selCountries={selCountries}
          selIndicator={selIndicator}
          toggleCountry={toggleCountry}
          removeAllCountries={removeAllCountries}
          plotlyRef={plotlyRef}
        />
      </div>
    </div>
  );
}

export default App;
