const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
// var timeout = express.timeout // express v3 and below
// var timeout = require('connect-timeout'); //express v4

const app = express();
const cron = require("node-cron");
const fs = require('fs');

let num = 0;

cron.schedule("* * * * * ", function() {
    console.log('new users are written')
    num++;
    function getUser(pageNum) {
        return axios.default.get(`https://reqres.in/api/users?page=${pageNum}`).then((response) =>{
            return response.data
        } );
    }
    getUser(num).then((response) => {
        console.log(response);
        response = JSON.stringify(response.data);
        fs.writeFile('./usersFile.txt', response);  

        //everyminute a new page is written in usersFile.txt
    })
  });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:500000, timedout:1000 }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS" 
  );
  next();
});

app.use("/api/users", require("./routes/user"));

app.listen(3000);

console.log("listen on 3000");

module.exports = app;
