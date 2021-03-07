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
      out.header.innerText = `Väderdata för '${city}' kunde inte hämtas, orsak okänd.`
    } else if(weatherDetails.cod === '404') {
      out.header.innerText = `Väderdata för '${city}' kunde inte hämtas, staden hittades inte.`
    } else {

      //all seems good, proceed.
      
      out.header.innerText = `Väderdata för '${city}' :`;
      out.temp = `Nuvarande temperatur ${weatherDetails} ${} ${}`
      out.latitude


    }
    // setInfoText(weatherDetails);
  } else {
    //a city hasn't been inputted yet.
    out.header.innerText = `Väderdata för ${city} kunde inte hämtas, orsak okänd.`;

  }

  //Visa info-div (oavsett om lyckas eller misslyckas)
  output.style="display: block;"

}


getWeatherButton.onclick = getWeatherPressed;



