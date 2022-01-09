var searchFormEl = document.querySelector("#search-form");
var textFieldEl = document.querySelector("#text-field");
var city = [];

var apiKey = "948c0a800c0ef8a2fc2ace7b0b626e26";

// add text to search box and connect search button to text entered
var formSubmitHandler = function(event){
    // get the value of the city text in search form
    var city = textFieldEl.value.trim();
    if (city) {
        searchCity(city);
        textFieldEl.value = "";
    } else {
        alert ("Cannot find that city. Please double check your entry");
    }
    // get city searched to save
    saveSearch(city);
    pastSearch(city);
};

// add click function to search button 
searchFormEl.addEventListener("submit", formSubmitHandler);

// add city searched to search history list

