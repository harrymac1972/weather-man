
var searchedArr = [];

$("#search-btn").on("click",function() {
    var textStr = $("#search-inp").val();
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
            error: function(xhr, status, error) {
                alert("City Not Found!");
            }
        })
    }
})

function cityFound(textStr,searchedArr,data) {
    renderCurrentHeader(data);
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
