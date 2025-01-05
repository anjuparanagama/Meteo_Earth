const apiKey = '4eb3703790b356562054106543b748b2';

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const city = getQueryParam('city');

if (city) {
    fetchWeather(city);
    fetchForecast(city);
} else {
    alert('No city specified. Please go back and enter a city name.');
}

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found.');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('city-name').textContent = data.name;
            document.getElementById('temperature').textContent = `${data.main.temp.toFixed(0)}°C`;
            // document.getElementById('description').textContent = `${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

            const weatherImage = getWeatherImage(data.weather[0].icon);
            document.getElementById('weather-image').src = weatherImage;
        })
        .catch(err => {
            alert(err.message);
            console.error(err);
        });
}

function fetchForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching forecast data.');
            }
            return response.json();
        })
        .then(data => {
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = '';

            // Filter today's forecasts
            const today = new Date().toISOString().split('T')[0];
            const todayForecasts = data.list.filter(item => {
                const forecastDate = new Date(item.dt * 1000).toISOString().split('T')[0];
                return forecastDate === today;
            });

            // Display today's hourly forecast
            if (todayForecasts.length > 0) {
                const hourlyContainer = document.createElement('div');
                hourlyContainer.className = 'hourly-forecast';
                todayForecasts.forEach(item => {
                    const hourlyItem = document.createElement('div');
                    hourlyItem.className = 'forecast-item';
                    const weatherImage = getWeatherImage(item.weather[0].icon);
                    hourlyItem.innerHTML = `
                        <h4>${new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                        <img src="${weatherImage}" alt="${item.weather[0].description}" />
                        <p>${item.weather[0].description}</p>
                        <p>${item.main.temp.toFixed(0)}°C</p>
                    `;
                    hourlyContainer.appendChild(hourlyItem);
                });
                forecastContainer.appendChild(hourlyContainer);
            }

			// Group forecasts by day
			const groupedByDay = groupByDay(data.list);

			// Display 5-day forecast
			const dailyContainer = document.createElement('div');
			dailyContainer.className = 'daily-forecast';

			Object.keys(groupedByDay).slice(1, 6).forEach(date => {
				const dayData = groupedByDay[date];
				const avgTemp = average(dayData.map(item => item.main.temp));
				const avgHumidity = average(dayData.map(item => item.main.humidity));
				const avgWind = average(dayData.map(item => item.wind.speed));
				const weatherImage = getWeatherImage(dayData[0].weather[0].icon);
				const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }); // Get day name (e.g., Sunday, Monday)

				const dailyItem = document.createElement('div');
				dailyItem.className = 'forecast-item';
				dailyItem.innerHTML = `
					<h4>${dayName}</h4>
					<img src="${weatherImage}" alt="${dayData[0].weather[0].description}" />
					<p>${dayData[0].weather[0].description}</p>
					<p>${avgTemp.toFixed(0)}°C</p>
				`;
				dailyContainer.appendChild(dailyItem);
			});
			forecastContainer.appendChild(dailyContainer);
        })
        .catch(err => {
            alert(err.message);
            console.error(err);
        });
}

// Helper function to group forecast data by day
function groupByDay(list) {
    return list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});
}

function average(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

// Function to get the weather image URL based on the icon code
function getWeatherImage(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
