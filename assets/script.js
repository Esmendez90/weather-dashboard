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
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
    success: function (response) {
      if (response) {
        console.log(response);
        placeName = response.name;
        countryName = response.sys.country;
        weatherDescription = response.weather[0].description;
        weatherIconUrl = response.weather[0].icon;
        temperature = response.main.temp;
        feelsLike = response.main.feels_like;
        maxTemp = response.main.temp_max;
        minTemp = response.main.temp_min;
        humidity = response.main.humidity;
        windSpeed = response.wind.speed;

        getTodaysDate(response.dt, response.sys.sunrise, response.sys.sunset);
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
// UV index data. Execute hourly and extended weather data and render it
function getUvIndex(...data) {
  let oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0]}&lon=${data[1]}&appid=${apiKey}&units=imperial`;

  $.ajax({
    url: oneCallURL,
    method: "GET",
  }).then(function (response) {
     console.log(response);
    uvIndexValue = Math.trunc(response.current.uvi);

    if (uvIndexValue < 3) {
      $("#uv-index-icon").css("color", "#4caf50");
    } else if (uvIndexValue > 2 && uvIndexValue < 8) {
      $("#uv-index-icon").css("color", "#ffeb3b");
    } else if (uvIndexValue >= 8) {
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
  $("#weather-icon").attr(
    "src",
    `https://openweathermap.org/img/wn/${weatherIconUrl}@2x.png`
  );
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
                <p style="font-weight:bold;">${hourly}</p>
                 <p style="margin-bottom: 5px; font-weight:bold;">${hourlyTemp}\xB0</p>
                 <div class="hourly-icon-container">
                 <img id="hourly-weather-icon" src="${hourlyIcon}" alt="hourly weather icon" />
                </div>
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
            <p style="font-size:20px; letter-spacing:0.5px; font-weight:bold;">${date}</p>
            
           <p style="font-weight:bold;">${forecastTemp}\xB0</p>
           <div class="forecast-icon-container">
           
           <img src="${forecastIconUrl}" alt="forecast weather icon"/>
           </div>
           <p style="margin-top: 0px; font-weight:bold;"><i class="fa-solid fa-droplet"></i> ${forecastHumidity}%</p>
        </div>
        `
    );
  }
}

function storedCities(cityName) {
  cityName = cityName.toUpperCase();
  let storage = JSON.parse(localStorage.getItem("stored-city-names"));
  storage.push(cityName);
  localStorage.setItem("stored-city-names", JSON.stringify(storage));

  renderStoredCityNames();
}

function renderStoredCityNames() {
  $("#saved-cities").empty();

  let storage = JSON.parse(localStorage.getItem("stored-city-names"));
  for (let i = 0; i < storage.length; i++) {
    $("#saved-cities").append(`
   <li class="saved-city-name" id=${[i]}>
   <button class="delete-city-btn"><i class="fa-solid fa-xmark"></i></button>
   ${storage[i]}
   </li>
    `);
  }
  deleteOneCity();
  deleteAllStoredCities();
  renderOneStoredCity();
}

function deleteOneCity() {
  $(".delete-city-btn").on("click", function (event) {
    event.preventDefault();
    let x = event.target.parentElement.parentElement.innerText;

    let storage = JSON.parse(localStorage.getItem("stored-city-names"));

    storage = storage.filter((e) => e !== x);

    localStorage.setItem("stored-city-names", JSON.stringify(storage));

    renderStoredCityNames();
  });
}

function deleteAllStoredCities() {
  $(".clear-cities-btn").on("click", function (event) {
    event.preventDefault();
    let storage = JSON.parse(localStorage.getItem("stored-city-names"));
    storage = storage.filter((e) => e !== e);

    localStorage.setItem("stored-city-names", JSON.stringify(storage));
    renderStoredCityNames();
  });
}

function renderOneStoredCity() {
  $(".saved-city-name").on("click", function (event) {
    event.preventDefault();
    getWeatherData(event.target.innerText);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Default city name button
$(".default-city-name").on("click", function (event) {
  event.preventDefault();
  let defaultCityName = $("#city-name")[0].innerText;
  defaultCityName = defaultCityName.split(",")[0];
  let defaultCityStorage = JSON.parse(
    localStorage.getItem("default-city-name")
  );

  if (defaultCityStorage.length == 0) {
    alert(`${defaultCityName} has been added as your default city.`);

    let defaultCityStorage = JSON.parse(
      localStorage.getItem("default-city-name")
    );

    defaultCityStorage.push(defaultCityName);
    localStorage.setItem(
      "default-city-name",
      JSON.stringify(defaultCityStorage)
    );
    $(".default-city-name").css("display", "none");
    $(".delete-default-city-name").css("display", "block");
  } else {
    alert(`You have already set ${defaultCityName} as your default city.`);
  }
});

// Delete default city name
$(".delete-default-city-name").on("click", function (event) {
  event.preventDefault();
  let defaultCityStorage = JSON.parse(
    localStorage.getItem("default-city-name")
  );

  defaultCityStorage = defaultCityStorage.filter((e) => e !== e);

  localStorage.setItem("default-city-name", JSON.stringify(defaultCityStorage));

  $(".delete-default-city-name").css("display", "none");
  $(".default-city-name").css("display", "block");
});

// Verify if localStorage for list of Searched Cities
if (
  localStorage.getItem("stored-city-names") === null ||
  localStorage.getItem("stored-city-names") === "undefined"
) {
  $(".fa-star").css("display","none");
  localStorage.setItem("stored-city-names", JSON.stringify([]));
} else {
  $(".fa-star").css("display","initial");
  renderStoredCityNames();
}

// Verify localStorage for Default city name
// if localStorage does NOT exist...
if (
  localStorage.getItem("default-city-name") === null ||
  localStorage.getItem("default-city-name") === "undefined"
) {
  // Create a localStorage for default city name
  localStorage.setItem("default-city-name", JSON.stringify([]));
}
else if (JSON.parse(localStorage.getItem("default-city-name")).length == 0) {
  console.log(
    "Click the star icon and mark a city as your default city for weather data."
  );
} else if (JSON.parse(localStorage.getItem("default-city-name")).length == 1) {
  $(".default-city-name").css("display", "none");
  $(".delete-default-city-name").css("display", "block");
  let defaultName = JSON.parse(localStorage.getItem("default-city-name"))[0]
  getWeatherData(defaultName);
}
