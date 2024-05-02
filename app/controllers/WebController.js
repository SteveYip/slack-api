import WeatherController from "./WeatherController";

const getWeatherInfo = async (req, res) => {
  const weather = await WeatherController.observatoryApiCall();
  return res.send(weather.data);
};

export default { getWeatherInfo };
