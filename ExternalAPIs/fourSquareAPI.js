

const clientID = 'TY31IAZCIU5ZL4AB1UNTZAT2EBQRDCXQEZU01EKVVT44JZF0';
const clientSecret = 'U0OUOZDPSKYFUZZ1UFJOEVVRX3GFOIJIP1BZJJBYTFQSSJTZ';

const apiBase = "https://api.foursquare.com/v2/venues/explore";

async function getVenues(city, limit) {
  console.log("getVenues");

  let apiUrl = apiBase+`?client_id=${clientID}&client_secret=${clientSecret}&near=${city}&limit=${10}&v=20211014`;
  
  let venuesData = await fetch(apiUrl, {
    method: "GET"
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("VENUES");

    console.log(data);
    return data;
  })
  .catch(error => console.log("Something went wrong: "+error));

  return venuesData;
};


export {getVenues as default} ;
