
var cityInput = $("#city");

var searchBtn = $("#search-btn");



function searchCity(event) {

  event.preventDefault();

  var citySearch = cityInput.val();

  console.log(citySearch);



  var apiKey = "2f1c1bf2f40bf4e0bff9c4a2bf0f5904";

  // Current weather API

  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`;

  // 5 days weather API

  var weeklyURL = `https://api.openweathermap.org/data/2.5/forecast?q=${citySearch}&units=imperial&appid=${apiKey}`;



  $.ajax({

    url: queryURL,

    method: "GET",

  }).then(function (response) {

    //console.log(response);

    // Output City name

    var cityName = $("#city-name");

    cityName.text(response.name);



    // Output Temperature

    var cityTemp = $("#temperature");

    cityTemp.text("Temperature: " + response.main.temp + " \xB0" + "F");



    // Output Humidity

    var humidity = $("#humidity");

    humidity.text("Humidity: " + response.main.humidity + " %");



    // Output Wind Speed

    var windSpeed = $("#wind-speed");

    windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");



    // Output UV index

    var latitude = response.coord.lat;

    var longitude = response.coord.lon;



    $.ajax({

        // UV Index API

      url: `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,

      method: "GET",

    }).then(function (response) {

      var uvIndex = $("#uv-index");

      uvIndex.text("UV Index: " + response.value);

    });

  });



  // ajax request for 5 days weather data

  $.ajax({

      url: weeklyURL,

      method: "GET",

  }).then(function (response){

    console.log(response);

    var weeklyTemp = $("#weekly-temp");

    var weeklyHumidity = $("#weekly-humidity");

    weeklyTemp.text("Temp: " + response.list[0].main.temp + " \xB0" + "F");

    weeklyHumidity.text("Humidity: " + response.list[0].main.humidity + " %");

  })



  







}



searchBtn.on("click", searchCity);