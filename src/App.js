import React, {useEffect, useState} from 'react';
import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
     countryCode === 'worldwide'
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
  };

  console.log("country Info", countryInfo);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
             <h1>COVID-19 TRACKER</h1>
             <FormControl className="app_dropdown">
                <Select variant="outlined" onChange={onCountryChange} value={country}>
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                    {countries.map((country) => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                      ))
                    }
                </Select>
              </FormControl>
        </div>

        <div className="app_stats">
           <InfoBox title="corona cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>

           <InfoBox title="recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>

           <InfoBox title="deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>

          <Map/>
      </div>
     
      <Card className="app_right">
        <CardContent>
           <h3> live cases by country</h3>
              <Table countries={tableData}/>
           <h3>worldwide new cases</h3>
              <LineGraph/>
         </CardContent>
      </Card>
    </div>
  );
}

export default App;
