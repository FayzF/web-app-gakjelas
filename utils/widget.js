const axios = require("axios");

//fungsi mengambil api dari data cuaca
const getWeatherData = async () => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?q=Makassar&appid=200ed885b2fd382182ba6aedd8d6ff99"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const Time = new Date();

const calendar = () => {
  let data = {
    clock: {
      hours: Time.getHours(),
      minutes: Time.getMinutes(),
    },
    day: Time.getDay(),
    date: Time.getDate(),
    month: Time.getMonth() + 1,
    year: Time.getFullYear(),
  };
  return data;
};

const gretings = () => {
  const calnd = calendar();
  let gretings = "";
  switch (true) {
    case calnd.clock.hours >= 1 && calnd.clock.hours <= 11:
      gretings = "Selamat Pagi";
      break;
    case calnd.clock.hours >= 12 && calnd.clock.hours <= 14:
      gretings = "Selamat Siang";
      break;
    case calnd.clock.hours >= 15 && calnd.clock.hours <= 18:
      gretings = "Selamat Sore";
      break;
    default:
      gretings = "Selamat Malam";
  }
  return gretings;
};

module.exports = { getWeatherData, calendar, gretings };
