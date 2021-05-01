const http=require('http');
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.round(((orgVal.main.temp-32)*5/9)/3.8));
    temperature = temperature.replace("{%tempmin%}", Math.round(((orgVal.main.temp_min-32)*5/9)/3.8));
    temperature = temperature.replace("{%tempmax%}", Math.round(((orgVal.main.temp_max-32)*5/9)/3.8));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(`http://api.openweathermap.org/data/2.5/weather?q=Allahabad&appid=cfac9b32052364dc4eab8eead4dd4aa2`)
        .on('data',(chunk) => {                     //data event fired when data is available to read
            const objdata = JSON.parse(chunk);      //to convert JSON to object
            const arrData = [objdata];              //array of the object
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);       
     })
      .on('end', (err) => {                             //event fired when there is no more data to read
       if (err) return console.log('connection closed due to errors', err);
       res.end();
    });
   }
 });

server.listen(2044, "127.0.0.1");
