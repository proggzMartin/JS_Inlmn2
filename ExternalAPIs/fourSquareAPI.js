

const clientID = 'TY31IAZCIU5ZL4AB1UNTZAT2EBQRDCXQEZU01EKVVT44JZF0';
const clientSecret = 'U0OUOZDPSKYFUZZ1UFJOEVVRX3GFOIJIP1BZJJBYTFQSSJTZ';

const apiBase = "https://api.foursquare.com/v2/venues/explore";


//Async ; invänta fetch att bli klar innan fortsätter.
async function getVenues(city, limit) {

  //Sort by popularity = 1 
  let apiUrl = apiBase+`?client_id=${clientID}&client_secret=${clientSecret}&near=${city}&limit=${limit}&v=20211014`+
               `&sortByPopularity=1`; //annars efter popularitet.

  let venuesData = await fetch(apiUrl, {
    method: "GET"
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    return data;
  })
  .catch(error => console.log("Something went wrong: "+error));

  return venuesData;
};


export {getVenues as default} ;
