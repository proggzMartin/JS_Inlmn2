
// api.openweathermap.org/data/2.5/weather?
// Parameters
// q -	required	City name, state code and country code divided by comma, use ISO 3166 country codes.
// You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.

// appid -	required	Your unique API key (you can always find it on your account page under the "API key" tab)
// mode -	optional	Response format. Possible values are xml and html. If you don't use the mode parameter format is JSON by default. Learn more
// units -	optional	Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default. Learn more
// lang -	optional	You can use this parameter to get the output in your language. Learn more

//Example: api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}
const apiKey = "7534ad9b667e08b24091ef78f4507532";
const apiBase = 'https://api.openweathermap.org/data/2.5/';

async function getWeather(city) {

  let weatherData = await fetch(apiBase+`weather?q=${city}&appid=${apiKey}`, {
    method: "GET"
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(error => console.log("Something went wrong: "+error));

  return weatherData;

};


export {getWeather as default} ;