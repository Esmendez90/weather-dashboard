var cityInput = $("#city");
var searchBtn = $("#search-btn");
var cityName = $("#city-name");
var cityTemp = $("#temperature");
var humidity = $("#humidity");
var windSpeed = $("#wind-speed");
var uvIndex = $("#uv-index");
var weeklyTemp = $("#weekly-temp");
var weeklyHumidity = $("#weekly-humidity");

// Displays weather data
function displayCityWeather(city) {
  var apiKey = "2f1c1bf2f40bf4e0bff9c4a2bf0f5904";
  // Current weather API
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // Output current date
    var date = new Date(response.dt * 1000);
    var forecastDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    $("#current-date").text(forecastDate);

    // Output City name and weather icon
    var iconData = response.weather[0].icon;
    var weatherIconUrl = `https://openweathermap.org/img/wn/${iconData}@2x.png`;
    cityName.text(response.name);
    $("#weather-icon").attr("src", weatherIconUrl);
    $("#weather-icon2").attr("src", weatherIconUrl);

    // Output Temperature
    cityTemp.text("Temperature: " + response.main.temp + " \xB0" + "F");

    // Output Humidity
    humidity.text("Humidity: " + response.main.humidity + " %");

    // Output Wind Speed
    windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");

    // Output UV index
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;

    var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    // ajax request for 5 day forecast
    $.ajax({
      url: oneCallURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      uvIndex.text("UV Index: " + response.current.uvi);

      // for loop that will get us the 5 day weather forecast of orlando

      for (var i = 1; i < 6; i++) {
        var date = new Date(response.daily[i].dt * 1000);
        var forecastDate =
          date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
        var forecastTemp = response.daily[i].temp.day;
        var forecastHumidity = response.daily[i].humidity;

        // this will create 5 cards that will display the weather forecast for 5 days.
        // for now, it is defaulted to ONLY show the 5 day forecast for orlando. See line 113 in js.

        $("#forecast").append(`<div
          id="forecast-card"
          class="card text-white bg-primary mb-3"
          style="max-width: 10rem"
          >
          <p class="card-text">${forecastDate}</p>
          <p class="card-text">${forecastTemp}</p>
          <p class="card-text">${forecastHumidity}</p>
          </div>`);
      }
    });
  });
}

searchBtn.on("click", function (event) {
  event.preventDefault();
  //console.log(event.target);

  var citySearch = cityInput.val();
  var storage = JSON.parse(localStorage.getItem("city-weather"));
  storage.push(citySearch);
  localStorage.setItem("city-weather", JSON.stringify(storage));
  displayCityWeather(citySearch);
  renderCities();
});

function renderCities() {
  var ulTag = $("<ul>").addClass("list-group list-group-flush");
  $("#list-of-cities").append(ulTag);

  var storage = JSON.parse(localStorage.getItem("city-weather"));
  for (var i = 0; i < storage.length; i++) {
    console.log(storage[i]);
    var liTag = $("<li>").addClass("list-group-item saved-city").attr("id", i); // Need help here!!!!
    ulTag.append(liTag);
    $("#" + i).text(storage[i]);
  }
}

if (localStorage.getItem("city-weather") === null) {
  localStorage.setItem("city-weather", JSON.stringify([]));
}

renderCities();

displayCityWeather("orlando");
