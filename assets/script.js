let cityInput = $("#city");
let searchBtn = $("#search-btn");
let cityName = $("#city-name");
let cityTemp = $("#temperature");
let humidity = $("#humidity");
let windSpeed = $("#wind-speed");
let uvIndex = $("#uv-index");
let ulTag = $("#saved-cities");
let apiKey = "2f1c1bf2f40bf4e0bff9c4a2bf0f5904";

// Displays weather data

function displayCityWeather(city) {
  $("#forecast").empty();
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    renderCurrentWeather(response);
    extendedForecast(response);
  });
}

function renderCurrentWeather(response) {
  // Get date
  let date = new Date(response.dt * 1000);
  let forecastDate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

  let iconData = response.weather[0].icon;
  let weatherIconUrl = `https://openweathermap.org/img/wn/${iconData}@2x.png`;

  $("#current-date").text(`(${forecastDate})`);
  cityName.text(response.name + ", " + response.sys.country);
  $("#weather-icon").attr("src", weatherIconUrl);
  cityName.text(response.main.name);
  cityTemp.text(Math.trunc(response.main.temp) + "\xB0" + "F");
  humidity.text(" " + response.main.humidity + "%");
  windSpeed.text(" " + Math.trunc(response.wind.speed) + "mph");
}

function extendedForecast(response) {
  let latitude = response.coord.lat;
  let longitude = response.coord.lon;
  let oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

  $.ajax({
    url: oneCallURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // UV index color
    let uvIndexValue = Math.trunc(response.current.uvi);
    // UV index value display on page
    uvIndex.text(uvIndexValue);

    if (uvIndexValue >= 0 && uvIndexValue < 3) {
      uvIndex.addClass("green");
    } else if (uvIndexValue >= 3 && uvIndexValue < 6) {
      uvIndex.addClass("yellow");
    } else if (uvIndexValue >= 6 && uvIndexValue < 8) {
      uvIndex.addClass("orange");
    } else {
      uvIndex.addClass("red");
    }

    // for loop that will get us the 5 day weather forecast
    for (let i = 1; i < 6; i++) {
      let date = new Date(response.daily[i].dt * 1000);
      // let forecastDate =
      //   date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      date = date.getDay();
      if (date == 0) {
        date = "Sunday";
      } else if (date == 1) {
        date = "Monday";
      } else if (date == 2) {
        date = "Tuesday";
      } else if (date == 3) {
        date = "Wednesday";
      } else if (date == 4) {
        date = "Thursday";
      } else if (date == 5) {
        date = "Friday";
      } else if (date == 6) {
        date = "Saturday";
      }
      // console.log(forecastDate);
      let forecastIcon = response.daily[i].weather[0].icon;
      let forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
      let forecastTemp = Math.trunc(response.daily[i].temp.day);
      let forecastHumidity = response.daily[i].humidity;

      // Create 5 cards that will display the weather forecast for 5 days.
      $("#forecast").append(
        `<div id="forecast-card">
            <p>${date}</p>
            <img src="${forecastIconUrl}" alt="forecast weather icon"/>
           <p>${forecastTemp}\xB0F</p>
           <p><i class="fa-solid fa-droplet"></i> ${forecastHumidity}%</p>
        </div>
        `
      );
    }
  });
}
// When the user clicks on the search button then the user input will be stored in local storage
// The city's data will be rendered on the page.
searchBtn.on("click", function (event) {
  event.preventDefault();

  let citySearch = cityInput.val().trim();
  if (citySearch === ""){
    alert("Enter a city name");
  } else {
  let storage = JSON.parse(localStorage.getItem("city-weather"));
  storage.push(citySearch);
  localStorage.setItem("city-weather", JSON.stringify(storage));

  uvIndex.removeClass("green yellow orange red");
  displayCityWeather(citySearch);
  renderCities();
  document.getElementById("myForm").reset();
  }
});

// The previously searched cities will be appended to a ul list
// Every new search will be added to the list.
function renderCities() {
  $("#saved-cities").empty();

  let storage = JSON.parse(localStorage.getItem("city-weather"));

  for (let i = 0; i < storage.length; i++) {
    let liTag = $("<li>");
    liTag.addClass("list-group-item saved-city");
    liTag.attr("id", i);
    ulTag.append(liTag);
    $("#" + i).text(storage[i]);
  }
}

// If the user clicks on a city from the list then the data of that city will be displayed
ulTag.click(function (event) {
  let element = event.target;
  let index = element.id; // will give us the id of the li element the user clicks on
  console.log(index);
  let megadeth = $("#" + index); // calling the id of the element and concatenating it with the index letiable
  let city = megadeth.text(); // will give us the text (the city name) of the targeted element
  console.log(city);
  uvIndex.removeClass("green yellow orange red");
  displayCityWeather(city); // will run the function and give us the data of the city
});

if (localStorage.getItem("city-weather") === null) {
  localStorage.setItem("city-weather", JSON.stringify([]));
};

function deleteItems() {
  localStorage.clear();
};

renderCities();
displayCityWeather("New York");
