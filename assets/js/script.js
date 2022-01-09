var searchFormEl = document.querySelector("#search-form");
var textFieldEl = document.querySelector("#text-field");
var searchButtonEl = document.querySelector("#searchBtn");
var currentWeatherEl = document.querySelector("#current-city-weather");
var searchHistoryEl = document.querySelector("#search-history");
var history = JSON.parse(localStorage.getItem("search")) || [];
var fiveDayEl = document.querySelector("#five-day");
var city = [];

var apiKey = "948c0a800c0ef8a2fc2ace7b0b626e26";

// add text to search box and connect search button to text entered
var formSubmitHandler = function (event) {
    // stop refresh
    event.preventDefault();

    // get the value of the city text in search form
    var city = textFieldEl.value.trim();
    if (city) {
        searchCity(city);
        textFieldEl.value = "";
    } else {
        alert("Cannot find that city. Please double check your entry");
    }
    // get city searched to save
    saveSearch(city);
    pastSearch(city);
};

// connect search text to API
var searchCity = function (city) {

    var apiUrlOne = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    // connect to url
    fetch(apiUrlOne)
        .then(function (response) {
            // achieved connection
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    connectDaily(data);
                })
            }
        })
        .catch(function (error) {
            console.log("failed to connect to URL");
        });
};

// get the daily forecast
var connectDaily = function (data) {
    // get latitude/longitude data
    var lat = data.coord.lat
    var lon = data.coord.lon

    console.log(lat);
    console.log(lon);

    // connect to url
    var apiUrlTwo = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(apiUrlTwo)
        .then(function (response) {
            // achieved connection
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    connectFiveDay(data);
                    console.log(data.daily)
                    displayCurrentWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            console.log("failed to connect to URL");
        });

};

var displayCurrentWeather = function (data, city) {
    // call on current weather div
    var currentWeatherEl = document.querySelector("#current-city-weather");
    currentWeatherEl.innerHTML = data.daily
        .map((day, idx) => {
            if (idx <= 0) {
                var date = new Date(day.date * 1000);
                // input data from API into div
                return `<div id="right-column" class="col-sm-9 col-md-7 col-lg-9">
                <div class="header-container container header-border">
                    <div id="current-city-weather" class="row">
                        <div class="col">
                            <div class="card border-0" style="width: 10vw">
                                <h2 class="card-title">${dt.toDateString()}</h2>
                                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon
                                    }@4x.png"  class="card-img-top" 
                                    alt="${day.weather[0].description}" />
                                <div class="card-body">
                                    <h3 class="card-title">${day.weather[0].main}</h3>
                                    <p class="card-text">Temp: ${day.temp.day} \u00B0F</p>
                                    <p class="card-text">Humidity: ${day.humidity} %</p>
                                    <p class="card-text">Wind: ${day.wind_speed} m/s</p>
                                    <p class="card-text">UV index: ${day.uvi}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        });
}

var connectFiveDay = function (data) {
    var fiveDayEl = document.querySelector("#five-day");
    connectFiveDay.innerHTML = data.daily
        .map((day, idx) => {
            if (idx <= 4) {
                var date = new Date(day.date * 1000);
                // input data from API into div
                return `<div class="col">
                <div class="card five-day-card h-100" style="width: 10vw">
                    <h2 class="card-title">${date.toDateString()}</h2>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon
                            }@4x.png" class="card-img-top"
                        alt=""${day.weather[0].description}" />
                    <div class="card-body">
                        <h3 class="card-title">${day.weather[0].main}</h3>
                        <p class="card-text">Temp: ${day.temp.day} \u00B0F</p>
                        <p class="card-text">Wind: ${day.wind_speed} m/s</p>
                        <p class="card-text">Humidity: ${day.humidity}</p>
                    </div>
                </div>`
            }
        })
        .join("");
        console.log(fiveDayEl);
}

// add city searched to search history list
var saveSearch = function (city) {
    var searchText = city;
}

var pastSearch = function() {
    // create loop that contains search history buttons
    searchHistoryEl.innerHTML = "";
    for (var i=0; i < history.length; i++) {
        var searchList = document.createElement("input");
        searchList.setAttribute("type", "text");
        searchList.setAttribute("readonly", true);
        searchList.setAttribute("class", "form-control d-block bg-gray w-75 mt-1 md-1");
        searchList.setAttribute("value", history[i]);
        searchList.addEventListener("click", function (event) {
            console.log(event.target.value);
            fiveDayEl.innerHTML = "";
            currentWeatherEl.innerHTML = "";
            city = event.target.value;
            searchCity(city);
        })
        searchHistoryEl.appendChild(searchList);
    }
}

// add click function to search button 
searchFormEl.addEventListener("submit", formSubmitHandler);

pastSearch();

