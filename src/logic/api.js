

export const fetchWeatherUsingLatLon = async (lat, lon, isImperial) => {
    try {
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${isImperial ? "imperial" : "metric"}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`
        const response = await fetch(apiUrl)
        if (response.ok) {
            const json = await response.json()
            return json
        }
        else {
            throw Error("Weather cannot be fetched!")
        }
    }   
    catch(err) {
        throw Error(err)
    }
}
export const fetchForecast = async (lat, lon, isImperial) => {
    try {
        let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${isImperial ? "imperial" : "metric"}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`
        const response = await fetch(apiUrl)
        if (response.ok) {
            const json = await response.json()
            return processForecastData(json.list, json.city.timezone)
        }
        else {
            throw Error("Weather cannot be fetched!")
        }
    }   
    catch(err) {
        throw Error(err)
    }
}

export const fetchSuggestions = async (search) => {
    const api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`;

    try {
        const response = await fetch(api_url);
        if (response.ok) {
            const json = await response.json();
            const countryCodes = json.map(x => x.country);

            const countryNamePromises = countryCodes.map(async (c) => {
                const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${c}`);
                if (countryResponse.ok) {
                    const countryJson = await countryResponse.json();
                    return countryJson[0].name.common;
                } else {
                    throw new Error(`Failed to fetch country name for code: ${c}`);
                }
            });

            const countryNames = await Promise.all(countryNamePromises);
            const suggestions = json.map((item, index) => ({
                ...item,
                country: countryNames[index],
            }));
            return suggestions;
        } else {
            throw new Error("Search suggestions could not be fetched!");
        }
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
};
const processForecastData = (forecastData, timezone) => {
    // Helper function to format the date (YYYY-MM-DD)
    const formatDate = (timestamp) => {
      const date = new Date((timestamp + timezone) * 1000);
      return date.toISOString().split('T')[0]; // Get the date part only
    };
  
    // Function to check if the time is around noon
    const isAroundNoon = (timestamp) => {
      const date = new Date((timestamp + timezone) * 1000);
      const hours = date.getUTCHours(); // Get hours in UTC
      return hours >= 11 && hours <= 13; // Check if the hour is between 11 AM and 1 PM
    };
  
    const dailyData = {};
    const currentDate = new Date();
  
    forecastData.forEach((entry) => {
      const date = formatDate(entry.dt);
      const dateObject = new Date(entry.dt * 1000);
  
      // Skip dates that are not after today
      if (dateObject <= currentDate) return;
  
      // Ensure time is around noon
      if (isAroundNoon(entry.dt)) {
        if (!dailyData[date]) {
          dailyData[date] = {
            dt: entry.dt, // Using the first timestamp of the day around noon
            temp: entry.main.temp,
            icon: entry.weather[0].icon
          };
        }
      }
    });
  
    // Convert object to array and get the first 5 days
    const result = Object.values(dailyData)
      .sort((a, b) => a.dt - b.dt) // Sort by timestamp
      .slice(0, 5);
  
    return result;
  };
  
  
  

  
