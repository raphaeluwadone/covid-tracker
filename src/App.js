import React, { useState, useEffect } from 'react';
import './App.css';
import {FormControl, Select, MenuItem, CardContent, Card, } from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map'
import Tables from './Table';
import { sortData, statsFormater } from './utils';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  const URL = "https://disease.sh/v3/covid-19/countries"

  useEffect(() => {
    const getCases = async () => {
      const cases = await fetch("https://disease.sh/v3/covid-19/all")
      const response = await cases.json()
      setCountryInfo(response)
    }
    getCases()
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      await fetch(`${URL}`)
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))
        setCountries(countries)
        const sortedData = sortData(data)
        setTableData(sortedData)
        console.log(data);
        setMapCountries(data)
      })
    }
    getCountries()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    const uri = countryCode === 'worldwide' ?  "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    const cases = await fetch(uri)
    const res = await cases.json()
      setCountry(countryCode)
      setCountryInfo(res)
      // console.log(res.countryInfo.lat, res.countryInfo.long);
      if(countryCode !== 'worldwide') {
        setMapCenter([res.countryInfo.lat, res.countryInfo.long])
      }
      setMapZoom(4)
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select 
            variant="outlined"
            onChange={onCountryChange}
            value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, i) => (
                <MenuItem value={country.value} key={i}>{country.name}</MenuItem>
              ))} 
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox casesType={casesType} active={casesType === 'cases'} isRed onClick={e => setCasesType("cases")} title="Coronavirus cases" cases={statsFormater(countryInfo.todayCases)} total={statsFormater(countryInfo.cases)}/>
          <InfoBox casesType={casesType} active={casesType === 'recovered'} onClick={e => setCasesType("recovered")} title="Coronavirus Recoveries" cases={statsFormater(countryInfo.todayRecovered)} total={statsFormater(countryInfo.recovered)}/>
          <InfoBox casesType={casesType} active={casesType === 'deaths'} isRed onClick={e => setCasesType("deaths")} title="Coronavirus Deaths" cases={statsFormater(countryInfo.todayDeaths)} total={statsFormater(countryInfo.deaths)}/>
        </div>
        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Tables countries={tableData}/>
              <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          {/* Graph */}
          <LineGraph className={"app__graph"} casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
