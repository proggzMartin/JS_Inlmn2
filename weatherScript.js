
//Fick inte till moduler, så kör det jag fick att funka.
var weather = (function() {
  'use strict';

  //Vill bara ha det uppskrivet, samlat nånstans.
  let htmlElements = [
    "inputCity", "input-info", "output"
  ];

  let apiKey = '7534ad9b667e08b24091ef78f4507532';

  let inputCity = document.getElementById("inputCity");
  let output = document.getElementById("output");
  
  function setInfoText(city) {
    if(!city) {
      inputInfo.textContent = 'Något gick åt skogen';
    } else { 
      document.getElementById("input-info").textContent = 'Väderinfo för ort: '+response.name;
    }
  }

  return {
    

    // api.openweathermap.org/data/2.5/weather?
    // Parameters
    // q -	required	City name, state code and country code divided by comma, use ISO 3166 country codes.
    // You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.
    
    // appid -	required	Your unique API key (you can always find it on your account page under the "API key" tab)
    // mode -	optional	Response format. Possible values are xml and html. If you don't use the mode parameter format is JSON by default. Learn more
    // units -	optional	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
    // lang -	optional	You can use this parameter to get the output in your language. Learn more
    
    //Example: api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}
    infoVisible: false,
    getWeather: function() {

      let enteredCity = inputCity.value;

      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {

        let response = JSON.parse(this.response);
        console.log(response);
        setInfoText(this.responseText);
      };

      xhttp.open("GET", 
                  `https://api.openweathermap.org/data/2.5/weather?q=${enteredCity}&appid=${apiKey}`, 
                  true);
      xhttp.send();
    } 
  }
})();



