import { useEffect, useState } from "react";
import Header from "./components/Header";
import WeatherDetails from "./components/WeatherDetails";
import { useWeatherContext } from "./context/WeatherContext";

import Forecast from "./components/Forecast";

function App() {
  const { weather } = useWeatherContext();
  // console.log(weather)
  const [bg, setBg] = useState({});
  const [isImperial, setIsImperial] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (weather) {
      setBg({
        backgroundImage: `url('./assets/${weather.weather[0].icon}.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      });
    }
  }, [weather]);
  // console.log(bg)
  return (
    <div className="app" style={bg}>
      <Header
        isImperial={isImperial}
        setIsImperial={setIsImperial}
        location={location}
        setLocation={setLocation}
      />
      <WeatherDetails isImperial={isImperial} />
      <Forecast isImperial={isImperial} location={location} />
    </div>
  );
}

export default App;
