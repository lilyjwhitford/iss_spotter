const { nextISSTimesForMyLocation } = require("./iss_promised");
const { printPassTimes } = require("./index");

// fetchMyIP() 
//   .then(fetchCoordsByIP) // provide fetchCoordsByIP as a callback after calling fetchMyIP
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));

nextISSTimesForMyLocation()
.then((passTimes) => {
  printPassTimes(passTimes);
})
.catch((error) => {
  console.log("It didn't work: ", error.message);
});