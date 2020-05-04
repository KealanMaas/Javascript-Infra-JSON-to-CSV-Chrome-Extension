chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting == "callContent")
        sendResponse({farewell: document.getElementsByTagName('pre')[0].innerHTML});
    });