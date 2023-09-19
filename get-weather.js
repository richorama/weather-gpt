import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config()

async function query(url){
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "subscription-key": process.env.AZURE_MAPS_SHARED_KEY,
    }
  }

  const response = await fetch(url, options);
  const json = await response.json();
  return json
}

async function getWeatherAtCoords(coords, units){
  const url = `https://atlas.microsoft.com/weather/currentConditions/json?api-version=1.1&query=${coords.join()}&unit=${(units || "metric")}`
  return await query(url);
}

async function getCoords(location){
  const url = `https://atlas.microsoft.com/search/address/json?api-version=1.0&language=en-US&query=${location}`
  const response = await query(url);
  if (response.results.length === 0){
    return [0,0]
  }

  const [firstPosition] = response.results
  return [firstPosition.position.lat, firstPosition.position.lon]
}

export default async function getWeather(location, units){
  const coords = await getCoords(location);
  const weather = await getWeatherAtCoords(coords, units);
  return weather
}
