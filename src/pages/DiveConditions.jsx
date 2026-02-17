import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Button,
  Spinner,
  Alert,
  List,
  ListItem,
} from "@material-tailwind/react";

const DiveConditions = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [marineData, setMarineData] = useState(null);
  const [waterTemp, setWaterTemp] = useState(null);

  // NOAA Station coordinates (major diving locations)
  const noaaStations = [
    { id: "9414290", name: "San Francisco", lat: 37.806, lon: -122.465 },
    { id: "9413450", name: "Monterey", lat: 36.605, lon: -121.888 },
    { id: "9410840", name: "San Diego", lat: 32.714, lon: -117.173 },
    { id: "9410660", name: "Los Angeles", lat: 33.720, lon: -118.273 },
    { id: "9410230", name: "La Jolla", lat: 32.867, lon: -117.257 },
    { id: "9447130", name: "Seattle", lat: 47.601, lon: -122.339 },
    { id: "8724580", name: "Key West", lat: 24.551, lon: -81.808 },
    { id: "8723214", name: "Virginia Key", lat: 25.731, lon: -80.161 },
    { id: "8518750", name: "New York", lat: 40.700, lon: -74.015 },
    { id: "8452660", name: "Newport", lat: 41.505, lon: -71.327 },
    { id: "8443970", name: "Boston", lat: 42.354, lon: -71.053 },
    { id: "8658120", name: "Wilmington NC", lat: 34.227, lon: -77.953 },
    { id: "8670870", name: "Fort Pulaski GA", lat: 32.033, lon: -80.900 },
    { id: "8729108", name: "Panama City", lat: 30.152, lon: -85.667 },
    { id: "1612340", name: "Honolulu", lat: 21.307, lon: -157.867 },
    { id: "1615680", name: "Mokuoloe", lat: 21.433, lon: -157.800 },
  ];

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest NOAA station
  const findNearestStation = (lat, lon) => {
    let nearest = null;
    let minDistance = Infinity;

    noaaStations.forEach((station) => {
      const distance = calculateDistance(lat, lon, station.lat, station.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...station, distance };
      }
    });

    // Only return if within 100km (reasonable for coastal diving)
    return minDistance < 100 ? nearest : null;
  };

  // Fetch water temperature from NOAA
  const fetchNOAAWaterTemp = async (lat, lon) => {
    const station = findNearestStation(lat, lon);

    if (!station) {
      console.log("No NOAA station nearby, using estimates");
      return null;
    }

    try {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");

      const response = await fetch(
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?` +
        `station=${station.id}&` +
        `product=water_temperature&` +
        `date=latest&` +
        `units=english&` +
        `time_zone=gmt&` +
        `application=packadive&` +
        `format=json`
      );

      if (!response.ok) {
        console.log("NOAA API error:", response.status);
        return null;
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const temp = parseFloat(data.data[0].v);
        return {
          temperature: temp,
          stationName: station.name,
          distance: station.distance.toFixed(1),
          time: data.data[0].t,
        };
      }

      return null;
    } catch (err) {
      console.error("NOAA fetch error:", err);
      return null;
    }
  };

  // Geocoding: Convert city/state to lat/lon
  const searchLocation = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);
    setMarineData(null);
    setLocationData(null);
    setLocationResults([]);
    setWaterTemp(null);

    try {
      // Open-Meteo Geocoding API - get multiple results
      const searchQuery = city.trim();
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchQuery
        )}&count=10&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Failed to fetch location data");
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("Location not found. Please try a different city.");
        setLoading(false);
        return;
      }

      // Filter results if state is provided
      let filteredResults = geoData.results;

      if (state.trim()) {
        const stateQuery = state.trim().toLowerCase();
        filteredResults = geoData.results.filter((location) => {
          const admin1 = (location.admin1 || "").toLowerCase();
          // Match full state name or abbreviation
          return admin1.includes(stateQuery) ||
            admin1 === stateQuery ||
            getStateAbbreviation(admin1) === stateQuery.toUpperCase();
        });

        // If no matches with state filter, show message
        if (filteredResults.length === 0) {
          setError(
            `No results found for "${city}" in "${state}". Try searching without the state.`
          );
          setLoading(false);
          return;
        }
      }

      // If only one result, auto-select it
      if (filteredResults.length === 1) {
        await selectLocation(filteredResults[0]);
      } else {
        // Show multiple results for user to choose
        setLocationResults(filteredResults);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
      setLoading(false);
    }
  };

  // When user selects a location from results
  const selectLocation = async (location) => {
    setLoading(true);
    setLocationResults([]);
    setLocationData(location);

    try {
      // Fetch all data in parallel
      const [weatherResult, marineResult, waterTempResult] = await Promise.all([
        fetchWeatherData(location.latitude, location.longitude),
        fetchMarineData(location.latitude, location.longitude),
        fetchNOAAWaterTemp(location.latitude, location.longitude),
      ]);

      setWaterTemp(waterTempResult);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get state abbreviation (basic US states)
  const getStateAbbreviation = (stateName) => {
    const states = {
      alabama: "AL",
      alaska: "AK",
      arizona: "AZ",
      arkansas: "AR",
      california: "CA",
      colorado: "CO",
      connecticut: "CT",
      delaware: "DE",
      florida: "FL",
      georgia: "GA",
      hawaii: "HI",
      idaho: "ID",
      illinois: "IL",
      indiana: "IN",
      iowa: "IA",
      kansas: "KS",
      kentucky: "KY",
      louisiana: "LA",
      maine: "ME",
      maryland: "MD",
      massachusetts: "MA",
      michigan: "MI",
      minnesota: "MN",
      mississippi: "MS",
      missouri: "MO",
      montana: "MT",
      nebraska: "NE",
      nevada: "NV",
      "new hampshire": "NH",
      "new jersey": "NJ",
      "new mexico": "NM",
      "new york": "NY",
      "north carolina": "NC",
      "north dakota": "ND",
      ohio: "OH",
      oklahoma: "OK",
      oregon: "OR",
      pennsylvania: "PA",
      "rhode island": "RI",
      "south carolina": "SC",
      "south dakota": "SD",
      tennessee: "TN",
      texas: "TX",
      utah: "UT",
      vermont: "VT",
      virginia: "VA",
      washington: "WA",
      "west virginia": "WV",
      wisconsin: "WI",
      wyoming: "WY",
    };
    return states[stateName.toLowerCase()] || "";
  };

  // Fetch Weather Forecast
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      throw err;
    }
  };

  // Fetch Marine Forecast
  const fetchMarineData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch marine data");
      }

      const data = await response.json();
      setMarineData(data);
    } catch (err) {
      console.error("Marine fetch error:", err);
      // Marine data might not be available for all locations, so we don't throw
      setMarineData({ error: "Marine data not available for this location" });
    }
  };

  // Get weather description from WMO code
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with heavy hail",
    };
    return weatherCodes[code] || "Unknown";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get wind direction from degrees
  const getWindDirection = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Get estimated water temperature based on latitude (fallback)
  const getEstimatedWaterTemp = (latitude) => {
    if (latitude > 32 && latitude < 40) {
      return "55-62°F"; // California coast
    } else if (latitude >= 40) {
      return "48-55°F"; // Pacific Northwest (colder)
    } else if (latitude >= 25 && latitude < 32) {
      return "65-75°F"; // Southern US coast (warmer)
    } else {
      return "60-70°F"; // Default/tropical
    }
  };

  // Get water temperature display (real or estimated)
  const getWaterTempDisplay = () => {
    if (waterTemp && waterTemp.temperature) {
      return `${waterTemp.temperature.toFixed(1)}°F`;
    }
    return locationData ? getEstimatedWaterTemp(locationData.latitude) : "N/A";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchLocation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h2" className="mb-6 text-blue-gray-800">
          Dive Conditions
        </Typography>

        {/* Search Section */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  size="lg"
                />
              </div>
              <div className="flex-1">
                <Input
                  label="State (optional - e.g., CA, California)"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  size="lg"
                />
              </div>
              <Button
                onClick={searchLocation}
                disabled={loading}
                className="md:w-48"
                color="blue"
                size="lg"
              >
                {loading ? <Spinner className="h-4 w-4" /> : "Search"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert color="red" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Location Selection */}
        {locationResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader
              color="amber"
              className="relative h-16 flex items-center justify-center"
            >
              <Typography variant="h5" color="white">
                📍 Multiple Locations Found - Select One
              </Typography>
            </CardHeader>
            <CardBody>
              <List>
                {locationResults.map((location, index) => (
                  <ListItem
                    key={index}
                    onClick={() => selectLocation(location)}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    <div className="flex flex-col w-full">
                      <Typography variant="h6">
                        {location.name}
                        {location.admin1 && `, ${location.admin1}`}
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {location.country}
                        {location.admin2 && ` • ${location.admin2}`} • Lat:{" "}
                        {location.latitude.toFixed(4)}, Lon:{" "}
                        {location.longitude.toFixed(4)}
                      </Typography>
                    </div>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        )}

        {/* Location Info */}
        {locationData && (
          <Card className="mb-6">
            <CardBody>
              <Typography variant="h5" className="mb-2">
                {locationData.name}
                {locationData.admin1 && `, ${locationData.admin1}`}
              </Typography>
              <Typography variant="small" className="text-gray-600">
                {locationData.country} • Lat: {locationData.latitude.toFixed(4)}
                , Lon: {locationData.longitude.toFixed(4)}
              </Typography>
            </CardBody>
          </Card>
        )}

        {/* Current Conditions */}
        {weatherData && (
          <>
            <Typography variant="h4" className="mb-7 text-blue-gray-700">
              Current Conditions
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Current Weather */}
              <Card>
                <CardHeader
                  color="blue"
                  className="relative h-16 flex items-center justify-center"
                >
                  <Typography variant="h5" color="white">
                    🌤️ Weather
                  </Typography>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-700">
                        Temperature:
                      </Typography>
                      <Typography className="font-bold text-2xl">
                        {weatherData.current.temperature_2m}°F
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-700">
                        Feels Like:
                      </Typography>
                      <Typography className="font-semibold">
                        {weatherData.current.apparent_temperature}°F
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-700">
                        Conditions:
                      </Typography>
                      <Typography className="font-semibold">
                        {getWeatherDescription(
                          weatherData.current.weather_code
                        )}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-700">
                        Humidity:
                      </Typography>
                      <Typography className="font-semibold">
                        {weatherData.current.relative_humidity_2m}%
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-700">Wind:</Typography>
                      <Typography className="font-semibold">
                        {weatherData.current.wind_speed_10m} mph{" "}
                        {getWindDirection(
                          weatherData.current.wind_direction_10m
                        )}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-700">
                        Precipitation:
                      </Typography>
                      <Typography className="font-semibold">
                        {weatherData.current.precipitation}"
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Current Marine */}
              {marineData && !marineData.error && (
                <Card>
                  <CardHeader
                    color="light-blue"
                    className="relative h-16 flex items-center justify-center"
                  >
                    <Typography variant="h5" color="white">
                      🌊 Marine
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Typography className="text-gray-700">
                          Wave Height:
                        </Typography>
                        <Typography className="font-bold text-2xl">
                          {marineData.current.wave_height
                            ? `${marineData.current.wave_height.toFixed(1)} m`
                            : "N/A"}
                        </Typography>
                      </div>
                      <div className="flex justify-between items-center">
                        <Typography className="text-gray-700">
                          Wave Period:
                        </Typography>
                        <Typography className="font-semibold">
                          {marineData.current.wave_period
                            ? `${marineData.current.wave_period.toFixed(1)} s`
                            : "N/A"}
                        </Typography>
                      </div>
                      <div className="flex justify-between items-center">
                        <Typography className="text-gray-700">
                          Wave Direction:
                        </Typography>
                        <Typography className="font-semibold">
                          {marineData.current.wave_direction
                            ? `${getWindDirection(
                              marineData.current.wave_direction
                            )} (${marineData.current.wave_direction}°)`
                            : "N/A"}
                        </Typography>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <Typography className="text-gray-700">
                          🌡️ Water Temp:
                        </Typography>
                        <Typography className="font-bold text-lg text-cyan-700">
                          {getWaterTempDisplay()}
                        </Typography>
                      </div>
                      {waterTemp && waterTemp.temperature ? (
                        <Typography variant="small" className="text-gray-500 italic">
                          *From NOAA {waterTemp.stationName} station ({waterTemp.distance} km away)
                        </Typography>
                      ) : (
                        <Typography variant="small" className="text-gray-500 italic">
                          *Estimated seasonal range
                        </Typography>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Marine Error */}
              {marineData && marineData.error && (
                <Card>
                  <CardHeader
                    color="light-blue"
                    className="relative h-16 flex items-center justify-center"
                  >
                    <Typography variant="h5" color="white">
                      🌊 Marine
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <Typography className="text-gray-600 text-center">
                      {marineData.error}
                    </Typography>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* 7-Day Forecast */}
            <Typography variant="h4" className="mb-7 text-blue-gray-700">
              7-Day Forecast
            </Typography>

            {/* Weather Forecast */}
            <Card className="mb-12">
              <CardHeader
                color="blue"
                className="relative h-16 flex items-center justify-center"
              >
                <Typography variant="h5" color="white">
                  🌤️ Weather Forecast
                </Typography>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-4 min-w-max">
                    {weatherData.daily.time.map((date, index) => (
                      <div
                        key={date}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <Typography className="font-semibold mb-2">
                          {formatDate(date)}
                        </Typography>
                        <Typography variant="small" className="text-gray-600 mb-2">
                          {getWeatherDescription(
                            weatherData.daily.weather_code[index]
                          )}
                        </Typography>
                        <Typography className="font-bold text-lg text-red-500">
                          {weatherData.daily.temperature_2m_max[index]}°
                        </Typography>
                        <Typography className="font-semibold text-blue-500">
                          {weatherData.daily.temperature_2m_min[index]}°
                        </Typography>
                        <Typography variant="small" className="text-gray-600 mt-2">
                          💧 {weatherData.daily.precipitation_sum[index]}"
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          💨 {weatherData.daily.wind_speed_10m_max[index]} mph
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          {getWindDirection(
                            weatherData.daily.wind_direction_10m_dominant[index]
                          )}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Marine Forecast */}
            {marineData && !marineData.error && (
              <Card className="mb-6">
                <CardHeader
                  color="light-blue"
                  className="relative h-16 flex items-center justify-center"
                >
                  <Typography variant="h5" color="white">
                    🌊 Marine Forecast
                  </Typography>
                </CardHeader>
                <CardBody>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 gap-4 min-w-max">
                      {marineData.daily.time.map((date, index) => (
                        <div
                          key={date}
                          className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"
                        >
                          <Typography className="font-semibold mb-2">
                            {formatDate(date)}
                          </Typography>
                          <Typography className="font-bold text-lg text-blue-700">
                            {marineData.daily.wave_height_max[index]
                              ? `${marineData.daily.wave_height_max[
                                index
                              ].toFixed(1)} m`
                              : "N/A"}
                          </Typography>
                          <Typography variant="small" className="text-gray-600 mb-1">
                            Wave Height
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            Period:{" "}
                            {marineData.daily.wave_period_max[index]
                              ? `${marineData.daily.wave_period_max[
                                index
                              ].toFixed(1)} s`
                              : "N/A"}
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            {marineData.daily.wave_direction_dominant[index]
                              ? getWindDirection(
                                marineData.daily.wave_direction_dominant[
                                index
                                ]
                              )
                              : "N/A"}
                          </Typography>
                          <div className="mt-2 pt-2 border-t border-blue-200 w-full text-center">
                            <Typography variant="small" className="text-cyan-700 font-semibold">
                              🌡️ {getWaterTempDisplay()}
                            </Typography>
                            <Typography variant="small" className="text-gray-500">
                              Water Temp
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {!weatherData && !loading && !error && locationResults.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <Typography variant="h5" className="text-gray-600 mb-2">
                🏖️ Ready to Check Dive Conditions?
              </Typography>
              <Typography className="text-gray-500">
                Enter a city and state above to get current weather and marine
                forecasts
              </Typography>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiveConditions;
