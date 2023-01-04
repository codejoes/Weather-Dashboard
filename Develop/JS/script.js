//DOM REFERENCES
var searchButton = document.getElementById('search');
var searchDiv = document.getElementById('searches');
var todayDiv = document.getElementById('today');
var fiveDayDiv = document.getElementById('five-day');

//EVENT LISTENERS
searchButton.addEventListener('click', conductSearch)

//API KEY
var apiKey = "8a950fc193d5fe3f846e09e714237d97";

//STORAGE ARRAY
var listArray = [];

//LOCAL STORAGE OBJ
var keyObj = localStorage.getItem('stored-cities');

if (keyObj != null) {
    loadBookmarks();
}

console.log(searchDiv.childNodes);

function loadBookmarks() {
    listArray.push(keyObj);
    console.log(localStorage.getItem('stored-cities'));
    const newListArray = listArray[0].split(',');

    for (let i = 0; i < newListArray.length; i++) {
        var btn = document.createElement("button");
        btn.textContent = newListArray[i];
        btn.classList.add('btn', 'btn-primary');
        searchDiv.appendChild(btn);
    }
}

function conductSearch () {

    //Remove Previous Search Before Searching Again
    if (todayDiv.childNodes.length > 1) {
        for (let i = 0; i < 5; i++) {
            todayDiv.removeChild(todayDiv.lastChild);
        }
        
    } 

    
    if (fiveDayDiv.childNodes.length > 1) {
        for (let i = 0; i < 40; i++) {
            fiveDayDiv.removeChild(fiveDayDiv.lastChild);
        }
    }

    //Only Runs Search if There is Text in the Search Box
    if (document.getElementById('city-name').value != "") {
        var cityName = document.getElementById('city-name').value;
        //Only adds bookmark if listArray doesn't already include the city name
        if (!listArray.includes(cityName)) {
            listArray.push(cityName);
            localStorage.setItem('stored-cities', listArray);
            var btn = document.createElement("button");
            btn.textContent = cityName;
            btn.classList.add('btn', 'btn-primary');
            searchDiv.appendChild(btn);
        }
    } 
   

    //Geocoding API Call
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey)
        .then (function (response) {
            return response.json();
        })
        .then (function(data) {
            //console.log(data);
            let event = data[0];
            var lat = event.lat;
            var lon = event.lon;
            //Current Weather API Call
            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&" + "lon=" + lon + "&appid=" + apiKey)
                .then (function (response) {
                    return response.json();
                })
                .then(function(data){
                    //console.log(data);
                    let event = data;
                    let name = event.name;
                    let weather = event.weather[0].main;
                    if (weather === "Clouds") {
                        var weatherImg = "☁️";
                    } else if (weather === "Rain") {
                        var weatherImg = "🌧️";
                    } else if (weather === "Sun" || weather === "Clear") {
                        var weatherImg = "☀️";
                    }
                    let tempK = event.main.temp;
                    let tempF = 1.8 * (parseInt(tempK) - 273) + 32;
                    let windSpeed = event.wind.speed;
                    //console.log(windSpeed);
                    //let windDirection = event.wind.deg;
                    let humidity = event.main.humidity;
                    var weatherNow = document.getElementById('today');
                    var h3 = document.createElement("h3");
                    h3.textContent = "City: " + name;
                    weatherNow.appendChild(h3);
                    appendToday(weatherImg);
                    let tempText = "Temp: " + Math.round(tempF) + " ℉";
                    appendToday(tempText);
                    let windText = "Wind: " + Math.round(windSpeed) + " MPH";
                    appendToday(windText);
                    let humidText = "Humidity: " + humidity + "%";
                    appendToday(humidText);
                    
                });
            //Five-day Three-hour Weather API Call
            fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" + "lon=" + lon + "&units=imperial" + "&appid=" + apiKey)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    //console.log(data);
                    let event = data.list;
                    for (let i = 0; i < event.length; i++) {
                        let temp = "Temp: " + Math.round(event[i].main.temp) + " ℉";
                        let hum = "Humidity: " + event[i].main.humidity + "%";
                        let wind = "Wind: " + Math.round(event[i].wind.speed) + "MPH";
                        let date = dayjs(event[i].dt_txt).format('dddd, MMMM, Do - h:mm A');
                        let weather = event[i].weather[0].main;
                        if (weather === "Clouds") {
                            var weatherImg = "☁️";
                        } else if (weather === "Rain") {
                            var weatherImg = "🌧️";
                        } else if (weather === "Sun" || weather === "Clear") {
                            var weatherImg = "☀️";
                        }
                        let allData = [date, weatherImg, temp, wind, hum];
                        let divCard = document.createElement('div');
                        let fiveDay = document.getElementById('five-day'); 
                        fiveDay.appendChild(divCard);
                        divCard.classList.add('card', 'bg-blue');
                        create5day(divCard, allData);

                    }
                })
        });

    
}

//Function call to populate data in the current weather box
function appendToday(data) {
    let h5 = document.createElement('h5');
    h5.textContent = data;
    var weatherNow = document.getElementById('today');
    weatherNow.appendChild(h5);
}

//Function call to populate data in the five day forecast cards
function create5day(div, data) {
    
    for (let i = 0; i < data.length; i++) {
        let p = document.createElement('p');
        //console.log(data.length);
        p.textContent = data[i];
        div.appendChild(p);
    }
} 

//If a button is clicked other than search button it runs the search for that city again
searchDiv.addEventListener('click', function(event) {
    var element = event.target;
    
    if (element.matches('button') === true && element.firstChild.textContent != 'Search') {
        document.getElementById('city-name').value = element.textContent
        conductSearch();
      
    }
  });
