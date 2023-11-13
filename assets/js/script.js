
var searchInp = $("#search-inp");
var searchedArr = [];

$("#search-btn").on("click",function() {
    var textStr = searchInp.val();
    if (textStr.length > 0){
        if (!searchedArr.includes(textStr)) {
            searchedArr.push(textStr);
            renderHistory(searchedArr);
        }
    }
})

function renderHistory(searchedArr) {
    var historyDiv = $("#search-history");
    historyDiv.empty();
    for (var i = 0; i < searchedArr.length; i++) {
        var cityBtn = $("<button>");
        cityBtn.text(searchedArr[i]);
        historyDiv.append(cityBtn);
    }
}
