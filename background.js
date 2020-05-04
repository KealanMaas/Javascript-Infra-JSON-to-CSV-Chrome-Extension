
//Retrieve object from DOM, submit it to Iterate Object for flattening/conversion and generate file based on response
function doStuffWithDom(domContent,type) {
  if(type=="JSON"){
    let docContentJSON = domContent;
    let doc = URL.createObjectURL( new Blob([docContentJSON], {type: 'application/octet-binary'}) );
    chrome.downloads.download({ url: doc, filename: "infrastructure.json", conflictAction: 'overwrite', saveAs: true });
  }
  else if(type=="CSV"){
    let docContentCSV = domContent;
    console.log(JSON.parse(docContentCSV));
    docContentCSV = iterateObject(JSON.parse(docContentCSV));
  
    console.log(docContentCSV);
    let doc = URL.createObjectURL( new Blob([docContentCSV], {type: 'application/octet-binary'}) );
    chrome.downloads.download({ url: doc, filename: "infrastructure.csv", conflictAction: 'overwrite', saveAs: true });
  }
}

//Iterate JSON object, submit each row object to flatten to be flattened. 
//Join response and submit to be converted to CSV
function iterateObject(obj){
  var numberOfObjects= obj.rows.length;
  console.log("Number of objects"+numberOfObjects)
  for(x=0; x<numberOfObjects; x++){
    obj.rows[x]= flatten(obj.rows[x]);
  }
  console.log(obj);
  return convertToCSV(obj);
}

//Recursively call each object in each row object, join path using "-" to flatten
//Return flattened row object 
function flatten (obj) {
  var newObj = {};
  for (var key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      var temp = flatten(obj[key])
      for (var key2 in temp) {
        newObj[key+"-"+key2] = temp[key2];
      }
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

//reduce response object to retrieve single list of unique keys
//map each key to value and generate CSV based on response
function convertToCSV(obj){
  const items = obj.rows
  //New version where we reducde object to retrieve all keys from every object and use them as the unique keys
  const result = Object.keys(Object.assign({}, ...items));
  //console.log(result);
  let csv = items.map(row => result.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(' , '))
  csv.unshift(result.join(' , '))
  csv = csv.join('\r\n')
  return csv;
}

//Helper function to convert null types to _
//Convert instances of commas in CSV value pair to -
function replacer(key, value){
  if(typeof(value)=== 'string'){

  if(value === (null || "" || '')){
    value ='_';
  }
  if(value.indexOf(',') > -1){
    value = value.replace(/,/g, '-');
  }
}
  return value;
}


chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "callBackgroundCSV" )
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "callContent"}, function(response) {
          doStuffWithDom(response.farewell,"CSV");
        });
      });
    }
    else if(request.greeting === "callBackgroundJSON")
    {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "callContent"}, function(response) {
          doStuffWithDom(response.farewell,"JSON");
        });
      });
    }
});

