
const express = require("express");
const https = require("https"); //Since https is native nodejs module, we do not need to install it. This module helps us to make a get request to an external server.
const bodyParser= require("body-parser");
const urlencoded = require("body-parser/lib/types/urlencoded");
const app = express();

app.use(bodyParser.urlencoded({extended:true})); // In order to use body parser on our server.

app.get("/",function(req, res){
  res.sendFile(__dirname + "/index.html");
  
});

// In order to catch the form on our root route, we create a post. This means, when our app get a post request targeting the homepage route, call a function. Also, in order to catch the data coming from a html form, we have to install a body-parser.
app.post("/", function(req,res) {

  
   
  const query= req.body.cityName; //by using body-parser, we can get the cityName which is an input inside the html form.
  const apiKey="15ca0dc5471e1a8cf5d871b2a642b912"
  const unit = "metric"
  // To make a get request by using https we have to write a targeted url related with external server. Be careful, url must start with https !!!
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;

  //when https get a get request targeting the url from our server, it will run a callback function. Inside the function, we cache the response.
  https.get(url, function(response){
    console.log(response.statusCode);

    //when our response object detecs a data, it will call a function showing us the data.
    response.on("data",function(data) {
      const weatherData=JSON.parse(data); //by using JSON.parse , we can convert our data into a Javascript object.
      const temp = weatherData.main.temp; // In this line, we can obtain the temperature data inside the main which is nested inside the weatherData object.

      const icon = weatherData.weather[0].icon;
      const imgUrl= "http://openweathermap.org/img/wn/" + icon +"@2x.png";
      const weatherDescription= weatherData.weather[0].description;
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<img src=" + imgUrl + ">");
      res.send(); // we can send multiline responses by using res.write in combination with our res.send().
  });
});
})

app.listen(3000,function(){
  console.log("Server is running on port 3000.");
});















// Notes

/* const object = {
        name:"Berkay",
        age:24,
      }

      JSON.stringify(object); //This code will do opposite of the JSON.parse. That is, it will turn a Javascript object into a string. */
// We can only have one res.send in the js. We can't send response twice.




