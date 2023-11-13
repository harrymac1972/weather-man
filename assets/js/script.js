
var searchedArr = [];

$("#search-btn").on("click",function() {
    var textStr = $("#search-inp").val();
    if (textStr.length > 0){
        if (!searchedArr.includes(textStr)) {
            searchedArr.push(textStr);
            renderHistory(searchedArr);
        }
    }
})

function cropHistory(searchedArr) {
    while (searchedArr.length > 10) {
        searchedArr.shift();
    }
    return searchedArr;
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
