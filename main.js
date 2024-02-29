let isCelsius = true; // Start with Celsius by default
let currentCity = 'Toronto'; // Set a default city

document.getElementById('search-btn').addEventListener('click', function() {
    currentCity = document.getElementById('search-box').value;
    fetchWeatherData(currentCity);
});

document.getElementById('toggle-temp').addEventListener('click', function() {
    isCelsius = !isCelsius;
    this.textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    fetchWeatherData(currentCity); // Use the global variable
});


function fetchWeatherData(city) {
    const apiKey = 'd5dd004228b099dd290b0869cfb7517b';
    const units = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return response.json();
        }
    })
    .then(data => {
        displayWeatherData(data);
        fetchWeeklyForecast(data.coord.lat, data.coord.lon); // Call the fetchWeeklyForecast here with the coordinates
        fetchHourlyForecast(data.coord.lat, data.coord.lon); // Call fetchHourlyForecast here
    })
    .catch(error => console.error('Error:', error));
}

function fetchWeeklyForecast(lat, lon) {
    const apiKey = 'd5dd004228b099dd290b0869cfb7517b';
    const units = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    fetch(url)
    .then(response => response.json())
    .then(data => displayWeeklyForecast(data.list)) // data.list contains the array for the 3-hourly forecast data
    .catch(error => console.error('Error:', error));
}

function fetchHourlyForecast(lat, lon) {
    const apiKey = 'd5dd004228b099dd290b0869cfb7517b'; // Use your actual API key
    const units = isCelsius ? 'metric' : 'imperial';
    // Use the /forecast endpoint for 3-hourly forecast data
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayHourlyForecast(data.list); // Assuming the hourly data is in data.list
    })
    .catch(error => console.error('Error:', error));
}

function displayWeatherData(data) {
    const weatherDataDiv = document.getElementById('weather-data');
    const weatherOtherDiv = document.getElementById('weather-other');
    const toggleButton = document.getElementById('toggle-temp');
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit'};

    if (data.cod === 200) {
        let temperature = data.main.temp; // Get the temperature from the data
        let feelsLike = data.main.feels_like; // Get the "feels like" temperature
        let tempUnit = isCelsius ? '°C' : '°F';
        let windSpeed = isCelsius ? `${data.wind.speed} m/s` : `${(data.wind.speed * 2.237).toFixed(1)} mph`; // Convert wind speed to mph if imperial

        let precipitation = '';
        if (data.rain && data.rain['1h']) { // If there is rain data for the last hour
            precipitation = `<p>Precipitation (last 1 hr): ${data.rain['1h']} mm</p>`;
        } else if (data.snow && data.snow['1h']) { // Similarly for snow
            precipitation = `<p>Snow (last 1 hr): ${data.snow['1h']} mm</p>`;
        }

        // Update the innerHTML with the additional weather information
        weatherDataDiv.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p5> ${temperature.toFixed(1)}${tempUnit}</p5>
        <p> ${new Date(data.dt * 1000).toLocaleDateString(undefined, dateOptions)}</p>
        <p> ${new Date(data.dt * 1000).toLocaleTimeString(undefined, timeOptions)}</p>
        <p>${data.weather[0].description}</p>
`;

        weatherOtherDiv.innerHTML = `
        <p><i class="fas fa-thermometer-half"></i> Feels Like: ${feelsLike.toFixed(1)}${tempUnit}</p>
        <p><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</p>
        ${precipitation ? `<p><i class="fas fa-cloud-rain"></i> ${precipitation}</p>` : ''}
        <p><i class="fas fa-wind"></i> Wind Speed: ${windSpeed}</p>
        <p><i class="fas fa-tachometer-alt"></i> Pressure: ${data.main.pressure} hPa</p>
        <p><i class="fas fa-sun"></i> Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString(undefined, timeOptions)}</p>
        <p><i class="fas fa-moon"></i> Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString(undefined, timeOptions)}</p>`;

        // Update the toggle button text
        fetchWeeklyForecast(data.coord.lat, data.coord.lon);
    } else {
        weatherDataDiv.innerHTML = `<p>City not found. Please try again!</p>`;
    }
}

function displayWeeklyForecast(forecastData) {
    const timeDiv = document.getElementById('time');
    let innerHTML = '';

    // Group by day, and find the max/min temperatures
    const groupedByDay = forecastData.reduce((acc, forecast) => {
        const date = new Date(forecast.dt * 1000);
        const dayKey = date.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

        if (!acc[dayKey]) {
            acc[dayKey] = {
                maxTemp: forecast.main.temp_max,
                minTemp: forecast.main.temp_min,
                date
            };
        } else {
            acc[dayKey].maxTemp = Math.max(acc[dayKey].maxTemp, forecast.main.temp_max);
            acc[dayKey].minTemp = Math.min(acc[dayKey].minTemp, forecast.main.temp_min);
        }

        return acc;
    }, {});

    Object.values(groupedByDay).forEach(({ date, maxTemp, minTemp }) => {
        const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
        const tempUnit = isCelsius ? '°C' : '°F';

        innerHTML += `
            <div class="day-forecast">
                <h3>${dayName}</h3>
                <p>Temperature: ${maxTemp.toFixed(1)}${tempUnit} / ${minTemp.toFixed(1)}${tempUnit}</p>
                <p>Weather: ${forecastData[0].weather[0].main}</p>
                <img src="https://openweathermap.org/img/w/${forecastData[0].weather[0].icon}.png" alt="${forecastData[0].weather[0].description}">
            </div>`;
    });

    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = innerHTML;
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast-container'); // Make sure this ID matches your HTML
    hourlyForecastDiv.innerHTML = ''; // Clear any existing content

    hourlyData.forEach((hourForecast, index) => {
        // Limit the number of hours to display, for example, the next 24 hours (8 entries of 3-hour data)
        if (index < 8) {
            const hourElem = document.createElement('div');
            hourElem.className = 'hour-forecast';

            const date = new Date(hourForecast.dt * 1000);
            const hour = date.getHours();
            const temperature = hourForecast.main.temp.toFixed(1);
            const tempUnit = isCelsius ? '°C' : '°F';
            const weather = hourForecast.weather[0].main;

            hourElem.innerHTML = `
                <h4>${hour}:00</h4>
                <p>Temp: ${temperature}${tempUnit}</p>
                <p>${weather}</p>
                <img src="https://openweathermap.org/img/w/${hourForecast.weather[0].icon}.png" alt="${weather}">
            `;

            hourlyForecastDiv.appendChild(hourElem);
        }
    });
}

window.onload = function() {
    fetchWeatherData(currentCity); // Use the global variable
};
