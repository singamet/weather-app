import { useEffect, useState } from "react";
import { useWeatherContext } from "../context/WeatherContext";
import { fetchWeatherUsingLatLon } from "../logic/api";
import Search from "./Search";
import PropTypes from "prop-types";

export default function Header({
  isImperial,
  setIsImperial,
  location,
  setLocation,
}) {
  const { weather, setWeather, setError, setIsLoading } = useWeatherContext();

  const [isLocationFetched, setIsLocationFetched] = useState(false);
  useEffect(() => {
    try {
      setIsLoading(true);
      if (navigator.geolocation && !isLocationFetched) {
        const watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await fetchWeatherUsingLatLon(
              latitude,
              longitude,
              isImperial
            );
            if (data) {
              setWeather(data);
              setLocation({ latitude, longitude });
              console.log(data);
            } else {
              setError("Error fetching weather for current location!");
            }
            setIsLocationFetched(true);
          }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLocationFetched, isImperial]);

  return (
    <div className="header">
      <h1 onClick={() => setIsLocationFetched(false)}>Weather App</h1>
      <Search
        isImperial={isImperial}
        location={location}
        setLocation={setLocation}
      />
      <div className="switch-container">
        <label className="label" htmlFor="toggleSwitch">
          {"\u00B0"}C
        </label>
        <label className="switch">
          <input
            type="checkbox"
            id="toggleSwitch"
            checked={isImperial}
            onChange={() => setIsImperial(!isImperial)}
          />
          <span className="slider round"></span>
        </label>
        <label className="label" htmlFor="toggleSwitch">
          {"\u00B0"}F
        </label>
      </div>

      <div className="location">
        <span className="material-icons">location_on</span>
        <h3>{weather && weather.name}</h3>
      </div>
    </div>
  );
}
Header.propTypes = {
  isImperial: PropTypes.bool.isRequired,
  setIsImperial: PropTypes.func.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  setLocation: PropTypes.func.isRequired,
};
