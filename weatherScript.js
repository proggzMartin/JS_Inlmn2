"use strict";

import getWeather from './openWeatherAPI.js';
import isString from './typeChecks.js';

//Vill bara ha det uppskrivet, samlat nånstans.
let htmlElements = ["inputCity", "input-info", "output"];

let getWeatherButton = document.getElementById("getWeatherButton");
let inputCity = document.getElementById("inputCity");


// let output = document.getElementById("output");

const out = {
  "output": document.getElementById("output"),
  "header": document.getElementById("header"),
  "temp": document.getElementById("temp"),
  "windspeed": document.getElementById("windspeed"),
  "weather": document.getElementById("weather"),
}

out.output.style="display: none;"

const outputVisible = false;

const getWeatherPressed = async function() {

  let city = inputCity.value;

  //Checking against module typeChecks.js
  if(isString(city)) {
    const weatherDetails = await getWeather(city);

    //cod is received http code.
    if(!weatherDetails)
    {
      //Then something went wrong
      out.header.innerHTML = `Väderdata för '${city}' kunde inte hämtas, orsak okänd.`
    } else if(weatherDetails.cod === '404') {
      out.header.innerHTML = `Väderdata för '${city}' kunde inte hämtas, staden hittades inte.`
    } else {

      //all seems good, proceed.

      out.header.innerHTML = `Väderdata för '${city}' :`;
      out.temp.innerHTML = `Nuvarande temperatur ${kelvtinToCelcius(weatherDetails.main.temp)}°C, <br/>`+
                           `Maxtemp: ${kelvtinToCelcius(weatherDetails.main.temp_max)}°C, <br/>`+
                           `Mintemp: ${kelvtinToCelcius(weatherDetails.main.temp_min)}°C<br/>`+
                           `Feels like ${kelvtinToCelcius(weatherDetails.main.feels_like)}°C`;
      out.windspeed.innerHTML = `Vindhastighet ${weatherDetails.wind.speed}m/s`;
      out.weather.innerHTML = `Väderbeskrivning: ${weatherDetails.weather[0].description}.`;


    }
    // setInfoText(weatherDetails);
  } else {
    //a city hasn't been inputted yet.
    out.header.innerHTML = `Väderdata för ${city} kunde inte hämtas, orsak okänd.`;

  }

  //Visa info-div (oavsett om lyckas eller misslyckas)
  output.style="display: block;"

}

const kelvtinToCelcius = function (kelvin) {
  return Math.round(kelvin - 273.15);
}


getWeatherButton.onclick = getWeatherPressed;



