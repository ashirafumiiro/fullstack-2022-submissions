import React, { useState, useEffect } from 'react';
import axios from "axios";


const Search = ({ search, handleSearch }) => {
  return (
    <div>find countries <input vale={search} onChange={handleSearch} /></div>
  )
}

const DisplayCountry = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital: {country.capital}</div>
      <div>population: {country.population}</div>
      <h1>Languages</h1>
      <ul>
        {country.languages.map(lang => {
          return (<li key={lang.iso639_1 || lang.name}>{lang.name}</li>)
        })}
      </ul>
      <img src={country.flag} alt="flag" height="100" width="100"/>
      <DisplayWeather capital={country.capital} />
    </div>
  )
}

const DisplayWeather = ({capital}) =>{
  const [weather, setWeather] = useState({temp: 0.0, wind: 0, icon: ''});
  const weatherApiKey = process.env.REACT_APP_API_KEY;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}`;

  useEffect(()=>{
    axios
      .get(weatherUrl)
      .then(response => {
        const data = response.data
        console.log('weather data:', data);
        setWeather({
          temp: Math.round((data.main.temp -  273.15) * 100)/100,
          wind: data.wind.speed,
          icon: data.weather[0].icon

        })

      })
      .catch(err => console.log(err))
  },[weatherUrl])

  return(
    <div>
      <h2>Wheather in {capital}</h2>
      <div>temperature {weather.temp} Celcius</div>
      <img alt='weather icon' src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
      <div>wind {weather.wind} m/s</div>
      
    </div>
  )
}

const DisplayResults = ({ search, setResult, countries }) => {
  const results = countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase()));

  if (results.length > 10) {
    return (<div>Too many matches, specify another filter</div>)
  }
  else if (results.length > 1) {    
    return (
      <div>
        {results.map(country =>
          <div key={country.alpha2Code}>
            {country.name}
            <button onClick={()=>setResult(country.name)}>show</button>
          </div>)}
      </div>
    )
  }
  else if (results.length === 1) {
    return (
      <DisplayCountry country={results[0]} />
    )
  }
  else {
    return (<div></div>)
  }
}
function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log('effect')
    axios
      .get("https://restcountries.com/v2/all")
      .then(response => {
        setCountries(response.data)
      })
      .catch(err => console.log(err))
  }, [])
  console.log("Countries: ", countries.length)

  const handleSearch = (value) => {
    setSearch(value)
  }

  return (
    <div>
      <Search search={search} handleSearch={(e)=>handleSearch(e.target.value)} />
      <DisplayResults search={search} countries={countries}
        setResult={handleSearch} />
    </div>
  );
}

export default App;
