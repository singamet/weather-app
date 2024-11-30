import { useEffect, useState } from "react";
import { useWeatherContext } from "../context/WeatherContext";
import { fetchForecast } from "../logic/api";
import ReactLoading from "react-loading";
import PropTypes from "prop-types";

export default function Forecast({ isImperial, location }) {
  const [forecast, setForecast] = useState([]);
  const { setError, isLoading } = useWeatherContext();
  useEffect(() => {
    const getForecast = async () => {
      try {
        if (location && location.latitude && location.longitude) {
          const fc = await fetchForecast(
            location.latitude,
            location.longitude,
            isImperial
          );
          if (fc.length > 0) {
            setForecast(fc);
            console.log(fc);
          }
        }
      } catch (err) {
        setError(err);
      }
    };
    getForecast();
  }, [location, isImperial]);

  const convertTimestampToDayOfWeek = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options = { weekday: "long" }; // Options to get the day of the week

    const dayOfWeek = date.toLocaleDateString("en-US", options);
    return dayOfWeek;
  };
  if (isLoading) {
    return (
      <ReactLoading
        type="spinningBubbles"
        color="white"
        height={200}
        width={100}
      />
    );
  }

  return (
    <div className="forecast">
      {forecast &&
        forecast.map((day) => (
          <div key={day.dt} className="forecast-card">
            <h3>{convertTimestampToDayOfWeek(day.dt)}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@4x.png`}
              alt=""
            />
            <h1>
              {Math.round(day.temp) + " \u00B0" + (isImperial ? "F" : "C")}
            </h1>
          </div>
        ))}
    </div>
  );
}
Forecast.propTypes = {
  isImperial: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
};
