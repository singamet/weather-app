import { useEffect, useState } from "react";
import { useWeatherContext } from "../context/WeatherContext";
import { fetchSuggestions, fetchWeatherUsingLatLon } from "../logic/api";
import PropTypes from "prop-types";

export default function Search({ isImperial, location, setLocation }) {
  const [search, setSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const { setWeather, setError, setIsLoading } = useWeatherContext();
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        if (location) {
          const data = await fetchWeatherUsingLatLon(
            location.latitude,
            location.longitude,
            isImperial
          );
          setWeather(data);
          setSearchSuggestions([]);
          setSearch("");
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [location, setWeather, isImperial]);
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      try {
        setIsLoading(true);
        if (search.length > 3) {
          const suggestionsData = await fetchSuggestions(search);
          if (suggestionsData) {
            setSearchSuggestions(suggestionsData);
          } else {
            setError("Suggestions Fetching error");
          }
        } else {
          setSearchSuggestions([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchSuggestions();
  }, [search]);
  return (
    <div className="search">
      <div className="search-container">
        <input
          placeholder="Search Location"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        {search && (
          <button className="clear-btn" onClick={() => setSearch("")}>
            X
          </button>
        )}
      </div>
      <ul className="suggestions">
        {searchSuggestions.length > 0 &&
          searchSuggestions.map((x) => (
            <li
              key={`${x.lat},${x.lon}`}
              onClick={() => setLocation({ latitude: x.lat, longitude: x.lon })}
            >
              {x.name}, {x.state ? x.state + ", " : ""} {x.country}
            </li>
          ))}
      </ul>

      {/* <button onClick={() => setLocation(search)}>
                <span className="material-icons">search</span>
            </button> */}
    </div>
  );
}
Search.propTypes = {
  isImperial: PropTypes.bool.isRequired,
  setIsImperial: PropTypes.func.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  setLocation: PropTypes.func.isRequired,
};
