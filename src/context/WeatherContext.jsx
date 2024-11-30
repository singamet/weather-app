import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const WeatherContext = createContext();

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw Error(
      "useWeatherContext must be used inside an WeatherContextProvider"
    );
  }
  return context;
};

export const WeatherContextProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <WeatherContext.Provider
      value={{
        weather,
        setWeather,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
WeatherContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
