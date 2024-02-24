const request = require("request"); // import request library to make HTTP request


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org/?format=json", (error, response, body) => { // make an http request
  // check if error occurs when requesting IP data
    if (error) {
      callback(error, null);
      return;
    }
    // if non 200 status, assume server error
    if (response.statusCode !== 200) {
      const errorMsg = `Status Code ${response.statusCode} when fetching IP: ${body}`;
      callback(Error(errorMsg), null);
      return;
    }
  
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    // error can be set if invalid domain or if user if offline, etc
    if (error) {
      callback(error, null);
      return;
    }
    // parse the returned body to check its information
    const parsedBody = JSON.parse(body);
    // check if success is true or not
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    
    const { latitude, longitude } = parsedBody;
    
    callback(null, {latitude, longitude});
    
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const errorMsg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(errorMsg), null);
      return;
    }
    
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
  
        callback(null, nextPasses);
      });
    });
  });
};

// we only need to esport nextISSTimesForMyLocation becuase they are not needed by external modules
module.exports = { nextISSTimesForMyLocation };