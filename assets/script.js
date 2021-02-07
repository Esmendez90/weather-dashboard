var cityInput = $("#city");
var searchBtn = $("#search-btn");
var cityName = $("#city-name");
var cityTemp = $("#temperature");
var humidity = $("#humidity");
var windSpeed = $("#wind-speed");
var uvIndex = $("#uv-index");
var weeklyTemp = $("#weekly-temp");
var weeklyHumidity = $("#weekly-humidity");
var ulTag = $("#saved-cities");

// Displays weather data

function displayCityWeather(city) {
  $("#forecast").empty();

  var apiKey = "2f1c1bf2f40bf4e0bff9c4a2bf0f5904";

  // Current weather API
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
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
      // UV index color
      var uvIndexValue = response.current.uvi;

      if (uvIndexValue >= 0 && uvIndexValue < 3) {
        uvIndex.addClass("green");
      } else if (uvIndexValue >= 3 && uvIndexValue < 6) {
        uvIndex.addClass("yellow");
      } else if (uvIndexValue >= 6 && uvIndexValue < 8) {
        uvIndex.addClass("orange");
      } else {
        uvIndex.addClass("red");
      }

      // UV index value display on page
      uvIndex.text(response.current.uvi);

      // for loop that will get us the 5 day weather forecast
      for (var i = 1; i < 6; i++) {
        var date = new Date(response.daily[i].dt * 1000);
        var forecastDate =
          date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
        var forecastIcon = response.daily[i].weather[0].icon;
        var forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
        var forecastTemp = response.daily[i].temp.day;
        var forecastHumidity = response.daily[i].humidity;

        // Create 5 cards that will display the weather forecast for 5 days.
        $("#forecast").append(
          `<div id="forecast-card" class="card text-white bg-primary mb-3" style="max-width: 10rem;"><p class="card-text">${forecastDate}</p><img src="${forecastIconUrl}"/><p class="card-text">${forecastTemp} \xB0F</p><p class="card-text">${forecastHumidity} %</p></div>`
        );
      }
    });
  });
}

// When the user clicks on the search button then the user input will be stored in local storage
// The city's data will be rendered on the page.
searchBtn.on("click", function (event) {
  event.preventDefault();

  var citySearch = cityInput.val();
  var storage = JSON.parse(localStorage.getItem("city-weather"));
  storage.push(citySearch);
  localStorage.setItem("city-weather", JSON.stringify(storage));

  displayCityWeather(citySearch);
  renderCities();
});

// The previously searched cities will be appended to a ul list
// Every new search will be added to the list.
function renderCities() {
  $("#saved-cities").empty();

  var storage = JSON.parse(localStorage.getItem("city-weather"));

  for (var i = 0; i < storage.length; i++) {
    //console.log(storage[i]);

    var liTag = $("<li>");
    liTag.addClass("list-group-item saved-city");
    liTag.attr("id", i);
    ulTag.append(liTag);
    $("#" + i).text(storage[i]);
  }
}


// If the user clicks on a city from the list then the data of that city will be displayed
ulTag.click(function (event) {
  var element = event.target;
  var index = element.id; // will give us the id of the li element the user clicks on
  console.log(index); 
  var megadeth = $("#" + index); // calling the id of the element and concatenating it with the index variable
  var city = megadeth.text(); // will give us the text (the city name) of the targeted element
  console.log(city);

  displayCityWeather(city); // will run the function and give us the data of the city
});

if (localStorage.getItem("city-weather") === null) {
  localStorage.setItem("city-weather", JSON.stringify([]));
}
function deleteItems() {
  localStorage.clear();
}

renderCities();
displayCityWeather("New York"); // New york is set as a default city 
