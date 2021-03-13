"use strict";

import getWeather from "./ExternalAPIs/openWeatherAPI.js";
import isString from "./typeChecks.js";
import getVenues from "./ExternalAPIs/fourSquareAPI.js";
import createInputObject from "./ExternalAPIs/createHTMLElements.js";


let inputCity = document.getElementById("inputCity");

let radioButtons = document.getElementById("radioButtons");
let showWeather = true;
let showVenues = true;
let filterAlphabetically = false;

//Data för radioknappar. Udnerlätta skapandes att fler/färre radioknappar, behöver bara lägga till rad här.
let radioIds = [
  {
    title: "Only weather",
    func: () => { //Funktion som ska köras när man trycker på radioknapp.
      showWeather = true;
      showVenues = false;
      filterAlphabetically = false;
    },
  },
  {
    title: "Only attractions",
    func: () => {
      showWeather = false;
      showVenues = true;
      filterAlphabetically = false;
    },
  },
  {
    title: "Filter alphabetically",
    func: () => {
      showWeather = true;
      showVenues = true;
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

//Åberopas på mer än 1 ställe; refactor ut för att slippa copypaste-kod.
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

//Görs i separat funktion för att ge mer readability i metoden "performSearch".
function setWeatherDetails(city, weatherDetails) {
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
}

//När man trycker 'Go' och söker, körs denna funktion.
const performSearch = async function () {
  let city = inputCity.value;

  //Checking against module typeChecks.js
  if (isString(city)) {
    if (showWeather) {
      const weatherDetails = await getWeather(city); //<--openWeatherAPI.js

      
      if (!weatherDetails)
        hideWeatherDetails(`Staden '${city}' kunde inte hämtas, orsak okänd.`);
      else if (weatherDetails.cod === "404") //cod is received http code.
        hideWeatherDetails(
          `Staden '${city}' kunde inte hämtas, staden hittades inte.`
        );
      else {
        setWeatherDetails(city, weatherDetails);
        weatherWrap.hidden = false;
      }
    } else {
      //hide the weather-div
      weatherWrap.hidden = true;
    }

    if (showVenues) {
      //Clear current data in the main div.
      venueWrap.innerHTML = "";
      let venues = await getVenues(city, 10);

      if (!venues || venues.meta.code !== 200) {
        let errorTitle = document.createElement("h2");
        errorTitle.innerHTML = "Något gick fel när attraktioner skulle hämtas. Försök igen senare.";
        venueWrap.appendChild(errorTitle);
      } else { //get data went OK.

        //beta ner strukturen; behöver bara denna underliggande datan.
        venues = venues.response.groups[0].items;

        
        if(filterAlphabetically)
          //sortera i alfabetisk ordning.
          //Källa https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
          venues.sort(function(a, b){
            if(a.venue.name < b.venue.name) { return -1; }
            if(a.venue.name > b.venue.name) { return 1; }
            return 0;
          });
        
        for (let i = 0; i < venues.length; i++) {
          if (i > 0 && i % 5 == 0)
            //Want max 5 attractions per row.
            venueWrap.appendChild(document.createElement("br"));

          let innerWrap = document.createElement("div");
          innerWrap.className = "innerWrapper";
          venueWrap.appendChild(innerWrap);

          let venueTitle = document.createElement("h2");
          venueTitle.innerHTML = venues[i].venue.name;
          innerWrap.appendChild(venueTitle);

          let venueAddressFormatted = venues[i].venue.location.formattedAddress;

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

inputCity.value = "Göteborg"; //default-värde vid start.

//Vid start, gör en förstasökning på Göteborg.
performSearch();

let goButton = document.getElementById("goButton");

goButton.onclick = performSearch;
