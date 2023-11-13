
var searchedArr = [];

$("#search-btn").on("click",function() {
    var textStr = $("#search-inp").val();
    textStr = toTitleCase(textStr);
    if (textStr.length > 0){
        var urlString = "https://api.openweathermap.org/data/2.5/weather?q=";
        urlString += textStr;
        urlString += "&APPID=0bf264ae251f7110c36368067c1f04d7&units=metric";
        $.ajax({
            url: urlString,
            method: "GET",
            dataType: "json",
            success: function(data) {
                console.log(data);
                cityFound(textStr,searchedArr,data);
            },
            error: function() {
                alert("City Not Found!");
            }
        })
    }
})

function cityFound(textStr,searchedArr,data) {
    renderCurrentHeader(data);
    var v = "Temp: " + data.main.temp + '\u00B0C';
    $("#current-temp").text(v);
    var v = "Wind: " + data.wind.speed + ' km/h';
    $("#current-wind").text(v);
    var v = "Humidity: " + data.main.humidity + ' %';
    $("#current-humidity").text(v);
    renderForecast(data.coord.lat,data.coord.lon);
    if (!searchedArr.includes(textStr)) {
        searchedArr.unshift(textStr);
        renderHistory(searchedArr);
    }
}

function cropHistory(searchedArr) {
    while (searchedArr.length > 10) {
        searchedArr.pop();
    }
    return searchedArr;
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
            console.log(data);
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
        var temp = data.list[incr].main.temp;
        var v = "#day-" + ix + "-temp";
        $(v).text(temp);
        console.log(temp);
        ix += 1;
    }
}

function renderHistory(searchedArr) {
    var historyDiv = $("#search-history");
    historyDiv.empty();
    searchedArr = cropHistory(searchedArr);
    for (var i = 0; i < searchedArr.length; i++) {
        var cityBtn = $("<button>");
        cityBtn.text(searchedArr[i]);
        historyDiv.append(cityBtn);
    }
}

function toTitleCase(textStr) {
    return textStr.charAt(0).toUpperCase() + textStr.slice(1);
}
