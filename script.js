const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('error');

const apiKey = '2dd784a8fa964b44a56976b7154206fd'; // Your OpenWeatherMap API key

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === '') return;

  fetchWeather(city);
});

function fetchWeather(city) {
  errorMessage.classList.add('hidden');
  weatherResult.classList.add('hidden');

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'City not found');
      }
      return res.json();
    })
    .then((data) => {
      displayWeather(data);
      cityInput.value = ''; // Clear input after success
    })
    .catch((err) => {
      errorMessage.textContent = err.message;
      errorMessage.classList.remove('hidden');
    });
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;

  const iconCode = data.weather[0].icon;
  // Cache-busting with timestamp to avoid stale icon issue
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png?${new Date().getTime()}`;
  weatherIcon.alt = data.weather[0].description;

  weatherResult.classList.remove('hidden');
}
