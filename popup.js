function popupCSV() {
    chrome.runtime.sendMessage({greeting: "callBackgroundCSV"},
        function (response) {
        });
}
function popupJSON() {
    chrome.runtime.sendMessage({greeting: "callBackgroundJSON"},
        function (response) {
        });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("csvButton").addEventListener("click", popupCSV);
  document.getElementById("JSONButton").addEventListener("click", popupJSON);
});