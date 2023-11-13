
var searchedArr = getStoredHistory();
if (localStorage.getItem("cityHistory") === null) {
    searchedArr = ["Toronto"];
    renderHistory(searchedArr);
}

function _init() {
    var historyArr = getStoredHistory();
    if (localStorage.getItem("cityHistory") === null) {
        searchCity("Toronto");
    } else {
        renderHistory(historyArr);
        searchCity(historyArr[0]);
    }
}

function cityFound(cityStr,searchedArr,data) {
    renderCurrentHeader(data);
    var v = "Temp: " + data.main.temp + '\u00B0C';
    $("#current-temp").text(v);
    var v = "Wind: " + data.wind.speed + ' km/h';
    $("#current-wind").text(v);
    var v = "Humidity: " + data.main.humidity + ' %';
    $("#current-humidity").text(v);
    renderForecast(data.coord.lat,data.coord.lon);
    if (!searchedArr.includes(cityStr)) {
        searchedArr.unshift(cityStr);
        renderHistory(searchedArr);
    }
}

function cropHistory(searchedArr) {
    while (searchedArr.length > 15) {
        searchedArr.pop();
    }
    return searchedArr;
}

function getStoredHistory() {
    var historyJSONStr = localStorage.getItem("cityHistory");
    return JSON.parse(historyJSONStr);
}

function renderCurrentHeader(data) {
    $("#current-city").text(data.name);
    var todayDt = "(" + dayjs().format('M/D/YYYY') + ")";
    $("#current-today").text(todayDt);
    var icon = data.weather[0].icon;
    iconUrl = `https://openweathermap.org/img/w/${icon}.png`;
    $("#current-icon").attr("src",iconUrl);
}

function renderForecast(latitude,longitude) {
    var urlString = "https://api.openweathermap.org/data/2.5/forecast?lat=";
    urlString += latitude;
    urlString += "&lon=";
    urlString += longitude;    
    urlString += "&appid=";
    urlString += "0bf264ae251f7110c36368067c1f04d7&units=metric";
    $.ajax({
        url: urlString,
        method: "GET",
        dataType: "json",
        success: function(data) {
            renderForecastData(data);
        },
        error: function() {
            alert("Forecast Not Found!");
        }
    })
}

function renderForecastData(data) {
    var ix = 1;
    for (var incr = 6; incr < 40; incr += 8) {
        renderForecastDataDay(data,ix,incr);
        renderForecastDataIcon(data,ix,incr);
        renderForecastDataTemp(data,ix,incr);
        renderForecastDataWind(data,ix,incr);
        renderForecastDatahumidity(data,ix,incr);
        ix += 1;
    }
}

function renderForecastDataDay(data,ix,incr) {
    var dayStr = data.list[incr].dt_txt;
    var dayArr = dayStr.split(" ");
    var day = dayArr[0];
    var date = dayjs(day);
    var formDay = date.format('M/D/YYYY');
    var ele = "#day-" + ix + "-header";
    $(ele).text(formDay);
}

function renderForecastDatahumidity(data,ix,incr) {
    var dew = data.list[incr].main.humidity;
    var ele = "#day-" + ix + "-humidity";
    var humidity = "Humidity: " + dew + ' %';
    $(ele).text(humidity);
}

function renderForecastDataIcon(data,ix,incr) {
    var iconString = data.list[incr].weather[0].icon;
    iconUrl = `https://openweathermap.org/img/w/${iconString}.png`;
    var ele = "#day-" + ix + "-icon";
    $(ele).attr("src",iconUrl);
}

function renderForecastDataTemp(data,ix,incr) {
    var temp = data.list[incr].main.temp;
    var ele = "#day-" + ix + "-temp";
    temp += ' \u00B0C';
    $(ele).text(temp);
}

function renderForecastDataWind(data,ix,incr) {
    var speed = data.list[incr].wind.speed;
    var ele = "#day-" + ix + "-wind";
    var windSpeed = "Wind: " + speed + ' km/h';
    $(ele).text(windSpeed);
}

function renderHistory(searchedArr) {
    var historyDiv = $("#search-history");
    historyDiv.empty();
    searchedArr = cropHistory(searchedArr);
    for (var i = 0; i < searchedArr.length; i++) {
        var cityBtn = $("<button>");
        cityStr = searchedArr[i];
        cityBtn.text(cityStr);
        historyDiv.append(cityBtn);
        cityBtn.on("click",function() {
            var btnStr = $(this).text();       
            searchCity(btnStr);
        });
    }
    setStoredHistory(searchedArr);
}

function searchCity(cityStr) {
    cityStr = toTitleCase(cityStr);
    if (cityStr.length > 0){
        var urlString = "https://api.openweathermap.org/data/2.5/weather?q=";
        urlString += cityStr;
        urlString += "&APPID=0bf264ae251f7110c36368067c1f04d7&units=metric";
        $.ajax({
            url: urlString,
            method: "GET",
            dataType: "json",
            success: function(data) {
                cityFound(cityStr,searchedArr,data);
            },
            error: function() {
                alert("City Not Found!");
            }
        })
    }
}

function setStoredHistory(searchedArr) {
    var searchedArrStr = JSON.stringify(searchedArr);
    localStorage.setItem('cityHistory', searchedArrStr);
}

function toTitleCase(textStr) {
    return textStr.charAt(0).toUpperCase() + textStr.slice(1);
}

$("#search-btn").on("click",function() {
    var cityStr = $("#search-inp").val();
    searchCity(cityStr);
})


_init();
