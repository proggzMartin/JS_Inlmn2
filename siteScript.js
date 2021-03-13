"use strict";

import getWeather from "./ExternalAPIs/openWeatherAPI.js";
import isString from "./typeChecks.js";
import getVenues from "./ExternalAPIs/fourSquareAPI.js";
import createInputObject from "./ExternalAPIs/createHTMLElements.js";

//Vill bara ha det uppskrivet, samlat nånstans.
let htmlElements = [
  "goButton",
  "inputCity",
  "input-info",
  "weatherWrap",
  "venueWrap",
];

let inputCity = document.getElementById("inputCity");
inputCity.value = "Göteborg";

let radioButtons = document.getElementById("radioButtons");
let showWeather = true;
let showAttractions = true;
let filterAlphabetically = false;

let radioIds = [
  {
    title: "Only weather",
    func: () => {
      showWeather = true;
      showAttractions = false;
      filterAlphabetically = false;
    },
  },
  {
    title: "Only attractions",
    func: () => {
      showWeather = false;
      showAttractions = true;
      filterAlphabetically = false;
    },
  },
  {
    title: "Filter alphabetically",
    func: () => {
      showWeather = true;
      showAttractions = true;
      filterAlphabetically = true;
    },
  },
];

for (let i = 0; i < radioIds.length; i++) {
  var wrapDiv = document.createElement("div");
  var radioAndLabel = createInputObject("radio", radioIds[i].title);
  radioAndLabel.input.name = "options";

  radioAndLabel.input.addEventListener("change", radioIds[i].func);

  wrapDiv.appendChild(radioAndLabel.input);
  wrapDiv.appendChild(radioAndLabel.label);

  radioButtons.appendChild(wrapDiv);
}

//Testar här att ha ett out-objekt för att hålla output för väder.
//Det funkar, för ska bara ha 1 stad visade ; behöver inte skapa
//flera fält såsom i venues.
const out = {
  weatherWrap: document.getElementById("weatherWrap"),
  weatherHeader: document.getElementById("weatherHeader"),
  temp: document.getElementById("temp"),
  windspeed: document.getElementById("windspeed"),
  weather: document.getElementById("weather"),
};

const venue = {
  venueWrap: document.getElementById("venueWrap"),
};

const outputVisible = false;

function hideWeatherDetails(errorMessage) {
  out.weatherHeader.innerHTML = errorMessage;
  out.temp.innerHTML = "";
  out.temp.hidden = true;
  out.windspeed.innerHTML = "";
  out.windspeed.hidden = true;
  out.weather.innerHTML = "";
  out.weather.hidden = true;

  weatherWrap.hidden = false;

}

function setWeatherDetails(hideAll, weatherDetails) {
  out.weatherHeader.innerHTML = `Väderdata för '${city}' :`;
  out.temp.innerHTML =
    `Nuvarande temperatur ${kelvtinToCelcius(
      weatherDetails.main.temp
    )}°C, <br/>` +
    `Maxtemp: ${kelvtinToCelcius(weatherDetails.main.temp_max)}°C, <br/>` +
    `Mintemp: ${kelvtinToCelcius(weatherDetails.main.temp_min)}°C<br/>` +
    `Feels like ${kelvtinToCelcius(weatherDetails.main.feels_like)}°C`;
  out.windspeed.innerHTML = `Vindhastighet ${weatherDetails.wind.speed}m/s`;
  out.weather.innerHTML = `Väderbeskrivning: ${weatherDetails.weather[0].description}.`;
}

const performSearch = async function () {
  let city = inputCity.value;

  //Checking against module typeChecks.js
  if (isString(city)) {
    if (showWeather) {
      const weatherDetails = await getWeather(city); //<--openWeatherAPI.js

      //cod is received http code.
      if (!weatherDetails)
        //Then something went wrong
        hideWeatherDetails(`Staden '${city}' kunde inte hämtas, orsak okänd.`);
      else if (weatherDetails.cod === "404")
        hideWeatherDetails(
          `Staden '${city}' kunde inte hämtas, staden hittades inte.`
        );
      else {
        //all seems good, proceed.

        out.weatherHeader.innerHTML = `Väderdata för '${city}' :`;
        out.temp.innerHTML =
          `Nuvarande temperatur ${kelvtinToCelcius(
            weatherDetails.main.temp
          )}°C, <br/>` +
          `Maxtemp: ${kelvtinToCelcius(
            weatherDetails.main.temp_max
          )}°C, <br/>` +
          `Mintemp: ${kelvtinToCelcius(weatherDetails.main.temp_min)}°C<br/>` +
          `Feels like ${kelvtinToCelcius(weatherDetails.main.feels_like)}°C`;
        out.windspeed.innerHTML = `Vindhastighet ${weatherDetails.wind.speed}m/s`;
        out.weather.innerHTML = `Väderbeskrivning: ${weatherDetails.weather[0].description}.`;
        weatherWrap.hidden = false;
      }
    } else {
      //hide weather div
      weatherWrap.hidden = true;
    }

    if (showAttractions) {
      //Clear current data in the main div.
      venueWrap.innerHTML = "";
      let venues = await getVenues(city, 10);

      if (! venues || venues.meta.code !== 200) {
        let errorTitle = document.createElement("h2");
        errorTitle.innerHTML = "Något gick fel när attraktioner skulle hämtas. Försök igen senare.";
        venueWrap.appendChild(errorTitle);
      } else { //get data went OK.

        //beta ner strukturen; behöver bara denna underliggande datan.
        venues = venues.response.groups[0].items;

        //sortera i alfabetisk ordning.
        //Källa https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript

        if(filterAlphabetically)
          venues.sort(function(a, b){
            if(a.venue.name < b.venue.name) { return -1; }
            if(a.venue.name > b.venue.name) { return 1; }
            return 0;
          });

        for (let i = 0; i < venues.length; i++) {
          if (i > 0 && i % 5 == 0)
            //Want max 5 attractions per row.
            venueWrap.appendChild(document.createElement("br"));

          const element = venues[i];
          let innerWrap = document.createElement("div");
          innerWrap.className = "innerWrapper";
          venueWrap.appendChild(innerWrap);

          let venueTitle = document.createElement("h2");
          venueTitle.innerHTML = element.venue.name;
          innerWrap.appendChild(venueTitle);

          let venueAddressFormatted = element.venue.location.formattedAddress;

          //Could take array.length-1, one could argue that mentioning country isn't neccesary.
          for (let i = 0; i < venueAddressFormatted.length; i++) {
            let p = document.createElement("p");
            p.innerHTML = venueAddressFormatted[i];
            innerWrap.appendChild(p);
          }
          /* ================= */
          /* ================= */
          /* Kommenterad kod fungerar inte; försökte hämta image men får 'forbidden' och felmeddelanden.
           Testade olika sätt försöka ta bilden, lyckades ej. Får "Access Denied".
           Koden nedan illustrerar försöket. 
        console.log("IKONER:")
        console.log(element.venue.categories[0])
        let iconDetails = element.venue.categories[0];
        console.log("ICONDETAILS:");
        console.log(iconDetails)
        let iconDetailsAddress = iconDetails.icon.prefix + iconDetails.id + iconDetails.icon.suffix;
        let iconDetailsAddress = iconDetails.icon.prefix + iconDetails.id;
        console.log("ICONDETAILSADDRESS:");

        console.log(iconDetailsAddress);

        let iconImg = document.createElement("img");

        iconImg.src = iconDetailsAddress;
        venueWrap.appendChild(iconImg);*/
          /* ================= */
          /* ================= */
        }
      }

      venueWrap.hidden = false; //show the venues-section
    } else {
      venueWrap.hidden = true; //else if option not selected, hide the venues section.
    }
  } else {
    //a city hasn't been inputted yet.
    out.header.innerHTML = `Väderdata för ${city} kunde inte hämtas, orsak okänd.`;
  }

  //Visa info-div (oavsett om lyckas eller misslyckas)
};

const kelvtinToCelcius = function (kelvin) {
  return Math.round(kelvin - 273.15);
};

performSearch();

let goButton = document.getElementById("goButton");

goButton.onclick = performSearch;
