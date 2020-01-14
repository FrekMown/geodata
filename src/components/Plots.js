import React, { useState, useEffect } from 'react';
import './Plots.css';
import Plotly from 'react-plotly.js';

const TYPES = ['world_map', 'time_series'];

function Plots(props) {
  const [type, setType] = useState('time_series'); //can be world_map or time series
  const [plotData, setPlotData] = useState([]); // list of elements {countryId: "COL", years: [], values:[]}
  const [mapYear, setMapYear] = useState(0);

  // Verify if user has chosen at least one country and one indicator
  let optionsChosen = (props.selCountries.length > 0 && props.selIndicator.length > 0);
 
  // Get data
  const getDataWorldBank = () => {
    // Returns a list of items from a list of lists
    if (optionsChosen){
      let changeDataFormat = (data) => {
        let newData = [];
        for (let item of data) {
          if (item) newData = [...newData, ...item];
        } 
        return newData;
      }
      // Create promises
      let promises = props.selCountries.map(countryId => (
        fetch(`https://api.worldbank.org/v2/country/${countryId}/indicator/${props.selIndicator}?format=json&frequency=Y&per_page=60`)
          .then(response => response.json())
          .then(data => data[1].filter(item => item.value !== null))
          .then(data => data.map(item =>({
            countryId: countryId,
            year: parseInt(item.date),
            value: item.value,
            unit: item.unit
          })))
          .catch(err => console.log(countryId, err))
      ));
      // Solve promises and set data
      Promise.all(promises)
        .then(data => changeDataFormat(data))
        .then(data => data.filter(item => item.value!==null))
        .then(data => {
          setPlotData(data);
        })
      }
    } 
  useEffect(getDataWorldBank, [props.selCountries, props.selIndicator]);

   // Create select menu to choose type
   let selectType;
   if (optionsChosen) {
     selectType = (
       <select id="plots-select-type" value={type} onChange={e => setType(e.target.value)}>
         { TYPES.map(t => (<option key={t}>{t}</option>)) }
       </select>
     );
   }
 
   // If type === world_map choose year to plot and start animation
   let selectYear;
   let startAnimationButton;
   if (optionsChosen && type==="world_map") {
     let yearsOK = Array.from(new Set(plotData.map(item => item.year))).sort((a,b) => b-a);

     const startAnimation = () => {
        let yearsAnimation = [...yearsOK];
        let intervalId = setInterval(() => {
          yearsAnimation.length>0 ? setMapYear(yearsAnimation.pop()): clearInterval(intervalId)
        }, 500);
     }
     selectYear = (
       <select id="plots-select-year" value={mapYear} onChange={e => setMapYear(e.target.value)}>
         <option key="" value={0}>Year?</option>
         { yearsOK.map(year => (<option key={year}>{year}</option>)) }
       </select>
     );
     startAnimationButton = (
       <button onClick={startAnimation}>
         Start !
       </button>
     );
   }  

   /// ***  Plot ***
   let plotlyData;
   let plotlyLayout;
   let plotlyPlot;

  // Plot time series
  if (optionsChosen && type === "time_series")  {
    let countriesPlot = Array.from(new Set(plotData.map(item => item.countryId)));

    plotlyData = countriesPlot.map(countryId => {
      let dataPlotCountry = plotData.filter(item => item.countryId === countryId);
      return {
        x: dataPlotCountry.map(item => item.year),
        y: dataPlotCountry.map(item => item.value),
        name: countryId,
        type: 'scatter',
      }      
    });

    plotlyLayout = {
      showlegend: true,
    }
  }

  // Plot world map
  if (optionsChosen && type === "world_map" && mapYear.length > 0) {
    // Filter data for this specific year
    let dataYear = plotData.filter(item => item.year === mapYear);
    let allValues = plotData.map(item => item.value);
  
    plotlyData = [{
      type: 'choropleth',
      locations: dataYear.map(item => item.countryId),
      z: dataYear.map(item => item.value),
      zmin: Math.min(...allValues),
      zmax: Math.max(...allValues),
      autocolorscale: true,
      showscale: true,
    }]

    plotlyLayout = {
      geo: {
        projection: {
          type: "mercator",
          showframe: false,
        }
      },
      showframe: false,
      margin: {
        t: 0,
        r: 0,
        b: 0,
        l: 0,
      },
      autosize: true,
      uirevision: true,
    }
  }

  // Creation of plotly object
  if (plotlyData && plotlyLayout) {
    plotlyPlot = (
      <Plotly
        data={plotlyData}
        layout={plotlyLayout}
        ref={props.plotlyRef}
        useResizeHandler
      />
    );
  }


  return (
    <div id="Plots">
      <div id="plots-title">Plots</div>
      <div id="plots-worldmap-form">
        {selectType}
        {selectYear}
        {startAnimationButton}
      </div>
      <div id="plot-plotly">
        {plotlyPlot}
      </div>
    </div>
  );
}

export default Plots;
