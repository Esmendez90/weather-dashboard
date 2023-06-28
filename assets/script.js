let inputName = document.getElementById("inputCity");
let btn = document.getElementById("search-btn");
let myForm = document.getElementById("myForm");
let apiKey = "2f1c1bf2f40bf4e0bff9c4a2bf0f5904";
let placeName;
let countryName;
let weatherDescription;
let temperature;
let feelsLike;
let maxTemp;
let minTemp;
let humidity;
let windSpeed;
let todaysDate;
let weatherIconUrl;
let uvIndexValue;
let sunriseTime;
let sunsetTime;

btn.addEventListener("click", getCityName);

function getCityName(e) {
  e.preventDefault();

  let cityName = inputName.value.trim();

  if (cityName) {
    getWeatherData(cityName);
    myForm.reset();
  } else {
    alert("Please, enter a valid city name.");
  }
}

function getWeatherData(cityName) {
  // console.log("City: ", cityName);
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
    success: function (response) {
      if (response) {
        placeName = response.name;
        countryName = response.sys.country;
        weatherDescription = response.weather[0].description;
        temperature = response.main.temp;
        feelsLike = response.main.feels_like;
        maxTemp = response.main.temp_max;
        minTemp = response.main.temp_min;
        humidity = response.main.humidity;
        windSpeed = response.wind.speed;

        getTodaysDate(response.dt, response.sys.sunrise, response.sys.sunset);
        getWeatherIcon(response.weather[0].icon);
        getUvIndex(response.coord.lat, response.coord.lon);
        storedCities(cityName);
      }
    },
    error: function () {
      alert(
        "Error code 404. Request not found. Please, check your spelling and try again."
      );
    },
  });
}

function getUvIndex(...data) {
  let oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0]}&lon=${data[1]}&appid=${apiKey}&units=imperial`;

  $.ajax({
    url: oneCallURL,
    method: "GET",
  }).then(function (response) {
    // console.log(response);
    uvIndexValue = Math.trunc(response.current.uvi);

    if (uvIndexValue < 3) {
      $("#uv-index-icon").css("color", "#4caf50");
    } else if (uvIndexValue > 2 && uvIndexValue < 8) {
      $("#uv-index-icon").css("color", "#ffeb3b");
    } else if (uvIndexValue > 8) {
      $("#uv-index-icon").css("color", "#e91e1e");
    }

    getHourlyWeather(response.hourly);
    renderWeatherData();
    extendedForecast(response);
  });
}

function getTodaysDate(dt, sunrise, sunset) {
  let date = String(new Date(dt * 1000));
  todaysDate = date.substring(4, 15);

  let sunriseConvertTime = String(new Date(sunrise * 1000));
  sunriseTime = sunriseConvertTime.substring(17, 21);

  let sunsetConvertTime = String(new Date(sunset * 1000));
  sunsetTime = sunsetConvertTime.substring(16, 21);
}

function renderWeatherData() {
  let tempValues = [temperature, maxTemp, minTemp, feelsLike];
  let temps = tempValues.map((values) => Math.trunc(values) + "\xB0");

  //  console.log("description ", weatherDescription);
  $("#city-name, #country-name").text(`${placeName}, ${countryName}`);
  $("#weather-description").text(`${weatherDescription}`);
  $("#weather-icon").attr("src", weatherIconUrl);
  $("#current-date").text(`${todaysDate}`);
  $("#feels-like").text(`Feels like ${temps[3]}`);
  $("#temperature").text(`${temps[0]} F`);
  $("#max-min-temp").text(`max ${temps[1]} / min ${temps[2]}`);
  $("#humidity").text(` ${humidity}% humidity`);
  $("#wind-speed").text(` ${windSpeed} mph wind speed`);
  $("#uv-index").text(` ${uvIndexValue} UV index`);
  $("#sunrise-time").text(` ${sunriseTime} sunrise`);
  $("#sunset-time").text(` ${sunsetTime} sunset`);
}

function getHourlyWeather(data) {
  $("#hourly-forecast").empty();
  // console.log(data);
  for (let i = 0; i < 13; i++) {
    let hours = new Date(data[i].dt * 1000);
    let hourly = hours.getHours();

    if (hourly > "12") {
      hourly = hourly - 12 + "PM";
    } else if (hourly == "12") {
      hourly = hourly + "PM";
    } else {
      hourly = hourly + "AM";
    }

    let hourlyTemp = Math.trunc(data[i].temp);

    let hourlyIcon = `https://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`;
    // console.log(hourlyIcon);

    $("#hourly-forecast").append(
      `<div id="hourly-card">
                <p>${hourly}</p>
                 <p style="margin-bottom: 5px">${hourlyTemp}\xB0</p>
                 <div class="hourly-icon-container">
                 <img id="hourly-weather-icon" src="${hourlyIcon}" alt="hourly weather icon" />
                <div>
              </div>
              `
    );
  }
}

function extendedForecast(data) {
  $("#forecast").empty();
  // console.log(data);
  // for loop that will get us the 5 day weather forecast
  for (let i = 1; i < 8; i++) {
    let date = new Date(data.daily[i].dt * 1000);
    //  let todaysDate =
    //    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
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

    let forecastIcon = data.daily[i].weather[0].icon;
    let forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
    let forecastTemp = Math.trunc(data.daily[i].temp.day);
    let forecastHumidity = data.daily[i].humidity;

    // Create 5 cards that will display the weather forecast for 5 days.
    $("#forecast").append(
      `<div id="forecast-card">
            <p style="font-size:20px; letter-spacing:0.5px">${date}</p>
            
           <p style="margin-bottom:0;">${forecastTemp}\xB0</p>
           <div class="forecast-icon-container">
           
           <img src="${forecastIconUrl}" alt="forecast weather icon"/>
           </div>
           <p style="margin-top: 0px;"><i class="fa-solid fa-droplet"></i> ${forecastHumidity}%</p>
        </div>
        `
    );
  }
}

function getWeatherIcon(icon) {
  weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function storedCities(cityName) {
  //console.log("Store: ", cityName);
  let storage = JSON.parse(localStorage.getItem("stored-city-names"));
  storage.push(cityName);
  localStorage.setItem("stored-city-names", JSON.stringify(storage));

  renderStoredCityNames();
}

function renderStoredCityNames() {
  $("#saved-cities").empty();

  let storage = JSON.parse(localStorage.getItem("stored-city-names"));
  console.log(storage);
  for (let i = 0; i < storage.length; i++) {
    $("#saved-cities").append(`
   <li class="list-group-item saved-city-name" id=${[i]}>
   ${storage[i]}
   </li>
   
    `);
  }
}

if (localStorage.getItem("stored-city-names") === null) {
  localStorage.setItem("stored-city-names", JSON.stringify([]));
}

renderStoredCityNames();

// // When the user clicks on the search button then the user input will be stored in local storage
// // The city's data will be rendered on the page.
// searchBtn.on("submit",getCityData);

// function getCityData (e) {
//   e.preventDefault();

//   let citySearch = cityInput.val().trim();
//   // if (citySearch === ""){
//   //   alert("Enter a city name");
//   // } else {
//   let storage = JSON.parse(localStorage.getItem("city-weather"));
//   storage.push(citySearch);
//   localStorage.setItem("city-weather", JSON.stringify(storage));

//   uvIndex.removeClass("green yellow orange red");
//   displayCityWeather(citySearch);
//   renderCities();
//   // document.getElementById("myForm").reset();
//   // }
// };

// // The previously searched cities will be appended to a ul list
// // Every new search will be added to the list.
// function renderCities() {
//   $("#saved-cities").empty();

//   let storage = JSON.parse(localStorage.getItem("city-weather"));

//   for (let i = 0; i < storage.length; i++) {
//     let liTag = $("<li>");
//     liTag.addClass("list-group-item saved-city");
//     liTag.attr("id", i);
//     ulTag.append(liTag);
//     $("#" + i).text(storage[i]);
//   }
// };

// // If the user clicks on a city from the list then the data of that city will be displayed
// ulTag.click(function (event) {
//   let element = event.target;
//   let index = element.id; // will give us the id of the li element the user clicks on
//   console.log(index);
//   let megadeth = $("#" + index); // calling the id of the element and concatenating it with the index letiable
//   let city = megadeth.text(); // will give us the text (the city name) of the targeted element
//   console.log(city);
//   uvIndex.removeClass("green yellow orange red");
//   displayCityWeather(city); // will run the function and give us the data of the city
// });

// if (localStorage.getItem("city-weather") === null) {
//   localStorage.setItem("city-weather", JSON.stringify([]));
// };

// function deleteItems() {
//   localStorage.clear();
// };

// renderCities();
// displayCityWeather("new york");
