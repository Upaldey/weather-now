const apiKey = "4350449ce7495f8a3502f4548212f393";
const searchBtn = document.querySelector(".search-btn");
const input = document.querySelector(".input");
const errorMsg = document.querySelector(".error-msg");
const main = document.querySelector(".main");
main.style.display = "none";
errorMsg.style.display = "none";

searchBtn.addEventListener("click", handleSearch);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

function handleSearch() {
  const city = input.value.trim();
  if (city === "") return;
  getWeatherData(city);
}

async function getWeatherData(city) {
  try {
    errorMsg.style.display = "none";

    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const currentData = await currentRes.json();
    if (currentData.cod !== 200) throw new Error(currentData.message);

    updateCurrentWeather(currentData);

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    updateForecast(forecastData);

    document.querySelector(".main").style.display = "flex";
    document.getElementById("initial-message").style.display = "none";
    document.querySelector(".weather-app-container").classList.remove("shrink");
  } catch (err) {
    console.error("Error fetching data:", err);
    errorMsg.style.display = "block";
  }
}

function updateCurrentWeather(data) {
  document.querySelector(".city-name").textContent = data.name;
  document.querySelector(".temp").textContent = `${Math.round(
    data.main.temp
  )}°C`;
  document.querySelector(".stateweather").textContent =
    data.weather[0].description;
  document.querySelector(".date-time").textContent =
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  document.querySelector(
    ".weather img"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.querySelector(".feels-like + p").textContent = `${Math.round(
    data.main.feels_like
  )}°C`;
  document.querySelector(
    ".humidity + p"
  ).textContent = `${data.main.humidity}%`;
  document.querySelector(
    ".Windspeed + p"
  ).textContent = `${data.wind.speed} m/s`;
  document.querySelector(
    ".pressure + p"
  ).textContent = `${data.main.pressure} hPa`;
}

function updateForecast(data) {
  const dailyMap = {};

  data.list.forEach((item) => {
    const dateObj = new Date(item.dt_txt);
    const dateKey = item.dt_txt.split(" ")[0];
    const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const hour = dateObj.getHours();
    const temp = item.main.temp;
    const iconCode = item.weather[0].icon;

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = {
        temps: [],
        icon: null,
        dayName: weekday,
      };
    }

    dailyMap[dateKey].temps.push(temp);

    if (hour === 12 && !dailyMap[dateKey].icon) {
      dailyMap[dateKey].icon = iconCode;
    }

    if (!dailyMap[dateKey].icon) {
      dailyMap[dateKey].icon = iconCode;
    }
  });

  const days = Object.keys(dailyMap).slice(0, 5);

  days.forEach((dateKey, i) => {
    const { temps, icon, dayName } = dailyMap[dateKey];
    const high = Math.max(...temps);
    const low = Math.min(...temps);

    document.getElementById(`day-${i + 1}-name`).textContent = dayName;
    document.getElementById(`day-${i + 1}-high`).textContent = `${Math.round(
      high
    )}°`;
    document.getElementById(`day-${i + 1}-low`).textContent = `${Math.round(
      low
    )}°`;
    document.getElementById(
      `day-${i + 1}-icon`
    ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById(`day-${i + 1}-icon`).alt = "weather icon";
  });
}
