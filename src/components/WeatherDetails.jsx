import { useWeatherContext } from "../context/WeatherContext";
import ReactLoading from "react-loading";
import PropTypes from "prop-types";

export default function WeatherDetails({ isImperial }) {
  const { weather, isLoading } = useWeatherContext();
  const tempUnit = isImperial ? "F" : "C";
  const windSpeedUnit = isImperial ? "mi/hr" : "m/sec";

  const convertDate = (timestamp) => {
    const date = new Date((timestamp + weather.timezone) * 1000); // Convert to milliseconds
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };
  const convertTime = (timestamp) => {
    const date = new Date((timestamp + weather.timezone) * 1000); // Convert to milliseconds

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format, handling midnight (0) as 12
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits for minutes

    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
    return formattedTime; // Output example: "02:15 PM"
  };
  function convertDirection(degrees) {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "N",
    ];
    const index = Math.round(((degrees % 360) / 22.5) % 16);
    return directions[index];
  }
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
    <>
      {weather && (
        <div className="weather-details">
          <div className="details">
            <div className="temp-card-container">
              <div className="temp-card">
                <h3>Low</h3>
                <div className="temp-card-body">
                  <span className="icon">
                    <i className="material-icons">arrow_downward</i>
                  </span>
                  <h2>
                    {Math.round(weather.main.temp_min)}{" "}
                    <span className="units">{" \u00B0" + tempUnit}</span>
                  </h2>
                </div>
              </div>
              <div className="temp-card">
                <h3>High</h3>
                <div className="temp-card-body">
                  <span className="icon">
                    <i className="material-icons">arrow_upward</i>
                  </span>
                  <h2>
                    {Math.round(weather.main.temp_max)}{" "}
                    <span className="units">{" \u00B0" + tempUnit}</span>
                  </h2>
                </div>
              </div>
              <div className="temp-card">
                <h3>Feels Like</h3>
                <div className="temp-card-body">
                  <h2>
                    {Math.round(weather.main.feels_like)}{" "}
                    <span className="units">{" \u00B0" + tempUnit}</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="details-card-container">
              <div className="details-card">
                <div className="details-card-head">
                  <h3>Sunrise & Sunset</h3>
                </div>
                <div className="details-card-body">
                  <div className="sunrise">
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="48px"
                        viewBox="0 -960 960 960"
                        width="48px"
                        fill="#e8eaed"
                      >
                        <path d="M450-332h60v-182l74 74 42-42-146-146-146 146 42 42 74-74v182Zm30 252q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                      </svg>
                    </span>
                    <h2>{convertTime(weather.sys.sunrise)}</h2>
                  </div>

                  <div className="sunset">
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="48px"
                        viewBox="0 -960 960 960"
                        width="48px"
                        fill="#e8eaed"
                      >
                        <path d="m480-332 146-146-42-42-74 74v-182h-60v182l-74-74-42 42 146 146Zm0 252q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                      </svg>
                    </span>
                    <h2>{convertTime(weather.sys.sunset)}</h2>
                  </div>
                </div>
              </div>
              <div className="details-card">
                <div className="details-card-head">
                  <h3>Wind</h3>
                </div>
                <div className="details-card-body">
                  <div className="wind-dir">
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="48px"
                        viewBox="0 -960 960 960"
                        width="48px"
                        fill="#e8eaed"
                      >
                        <path d="m303-303 270-83 83-270-270 83-83 270Zm176.76-137q-16.76 0-28.26-11.74-11.5-11.73-11.5-28.5 0-16.76 11.74-28.26 11.73-11.5 28.5-11.5 16.76 0 28.26 11.74 11.5 11.73 11.5 28.5 0 16.76-11.74 28.26-11.73 11.5-28.5 11.5Zm.51 360q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.22-60Q622-140 721-239.49q99-99.48 99-241Q820-622 721-721t-240.51-99q-141.52 0-241 99Q140-622 140-480.49q0 141.52 99.49 241 99.48 99.49 241 99.49ZM480-480Z" />
                      </svg>
                    </span>
                    <h2>{convertDirection(weather.wind.deg)}</h2>
                  </div>
                  <div className="wind-speed">
                    <h4>
                      Speed: {Math.round(weather.wind.speed)}{" "}
                      <span className="units">{windSpeedUnit}</span>
                    </h4>
                    {weather.wind.gust && (
                      <h4>
                        Gust: {Math.round(weather.wind.gust)}{" "}
                        <span className="units">{windSpeedUnit}</span>
                      </h4>
                    )}
                  </div>
                </div>
              </div>
              <div className="details-card">
                <div className="details-card-head">
                  <h3>Visibility</h3>
                </div>
                <div className="details-card-body">
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48px"
                      viewBox="0 -960 960 960"
                      width="48px"
                      fill="#e8eaed"
                    >
                      <path d="M480.12-330q70.88 0 120.38-49.62t49.5-120.5q0-70.88-49.62-120.38T479.88-670Q409-670 359.5-620.38T310-499.88q0 70.88 49.62 120.38t120.5 49.5Zm-.36-58q-46.76 0-79.26-32.74-32.5-32.73-32.5-79.5 0-46.76 32.74-79.26 32.73-32.5 79.5-32.5 46.76 0 79.26 32.74 32.5 32.73 32.5 79.5 0 46.76-32.74 79.26-32.73 32.5-79.5 32.5Zm.24 188q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Zm0-300Zm-.17 240Q601-260 702.5-325.5 804-391 857-500q-53-109-154.33-174.5Q601.34-740 480.17-740T257.5-674.5Q156-609 102-500q54 109 155.33 174.5Q358.66-260 479.83-260Z" />
                    </svg>
                  </span>
                  <h2>
                    {weather.visibility / 1000}{" "}
                    <span className="units">km</span>
                  </h2>
                </div>
              </div>
              <div className="details-card">
                <div className="details-card-head">
                  <h3>Humidity</h3>
                </div>
                <div className="details-card-body">
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48px"
                      viewBox="0 -960 960 960"
                      width="48px"
                      fill="#e8eaed"
                    >
                      <path d="M480-100q-133 0-226.5-91.71T160-415q0-63.14 24.5-120.77Q209-593.4 254-637.5L480-860l226 222.5q45 44.1 69.5 101.73T800-415q0 131.58-93.5 223.29Q613-100 480-100Z" />
                    </svg>
                  </span>
                  <h2>
                    {weather.main.humidity} <span className="units">%</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="main">
            <h4>{convertDate(weather.dt)}</h4>
            <h1>
              {Math.round(weather.main.temp)}{" "}
              <span className="units">{" \u00B0" + tempUnit}</span>
            </h1>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt=""
            />
            <h2>{weather.weather[0].description}</h2>
          </div>
        </div>
      )}
    </>
  );
}
WeatherDetails.propTypes = {
  isImperial: PropTypes.bool.isRequired,
};
