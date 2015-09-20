var express = require('express');
var Promise = require("bluebird");
var async = require("async");
var app = express();
var fs = require("fs");
var http = require('http');
var https = require('https');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
   if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  } else {
    return next();
  }
});

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.get('/getStubData', function (req, res) {
   fs.readFile( __dirname + "/public/" + "data.json", 'utf8', function (err, data) {
       res.end( data );
   });
})

app.get('/getWeather', function (req, response) {
   console.log("getting weather data...");
//   var http = require('http');
//   var url = "https://api.wunderground.com/api/b44b1327c40539f8/forecast10day/q";
   var data = "";
   
   var options = {
    protocol: 'http:'
    , host: 'api.wunderground.com'
    , port: 80
    , path: '/api/b44b1327c40539f8/forecast10day/q/CA/San_Francisco.json'
   };

   var request = http.get(options, function(res) {
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function() {
            response.end(data);
        });
        res.on('errors', function(e){
            console.log("There was an error: " + e.message)
        });
    });
})

app.get('/getOutlookEvents', function (req, response) {
   console.log("getting outlook events data...");
   var data = "";
   
   var options = {
    host: ' outlook.office365.com',
    path: '/api/v1.0/me/events?$select=Subject,Organizer,Start,End',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW5AaHJvb2tkZW1vMTEub25taWNyb3NvZnQuY29tOnBhc3NAd29yZDE='
    }
   };

   var request = https.get(options, function(res) {
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function() {
            response.end(data);
        });
        res.on('error', function(e){
            console.log("There was an error: " + e.message)
        });
    });
});


// app.get('/getOutlookEvents', function (req, response) {
// //   console.log("getting outlook events...");
// //   var http = require('http');
// //   var url = "https://outlook.office365.com/api/v1.0/me/events?$select=Subject,Organizer,Start,End";
//   var data = "";
   
//   var options = {
//       host: 'outlook.office365.com',
//       path: '/api/v1.0/me/events?$select=Subject,Organizer,Start,End',
//         headers: {
//             'Authorization': 'Basic YWRtaW5AaHJvb2tkZW1vMTEub25taWNyb3NvZnQuY29tOnBhc3NAd29yZDE='
//         }
//   };
   
//     // do the GET request
//     var reqGet = https.request(options, function(res) {
//         console.log("statusCode: ", res.statusCode);
     
//         res.on('data', function(chunk) {
//             data += chunk;
//         });
     
//     });
     
//     reqGet.on('end', function(){
//         response.end(JSON.stringify(data));
//     });
//     reqGet.on('error', function(e) {
//         console.error(e);
//     });
// });

app.get('/getWalmartData', function (req, response) {
    var walmart = require('walmart')('s4uxqy9mcskf98g3gpzuvj2h');
    var data = "";
    // walmart.search("male summer").then(
    //     function() {
    //         response.end(data);
    //     },
    //     function(error) {
    //         console.log("There was an error: " + error.message);
    //     },
    //     function(progress) {
    //         data += progress;
    //     }
    // );
    
    walmart.search("summer").then(function(val) {
        console.log(val.success);
        response.end(val);
    })
    .catch(SyntaxError, function(e) {
        console.error("unable to make the walmart api quert");
    })
    .catch(function(e) {
        console.error("unable to make the search");
    });
});


app.get('/get123',function(req,res) {
    // Array to hold async tasks
    var asyncTasks = [];
    var data = "";

    asyncTasks.push(function(callback){
        for(var i = 1; i <10000; i++) {
            data += i;
            
        }
        callback();
    });
    
    asyncTasks.push(function(callback){
        for(var i = 10000; i <20000; i++) {
            data += "xxxxxxx";
            
        }
        callback();
    });
    
    
    // Now we have an array of functions doing async tasks
    // Execute all async tasks in the asyncTasks array
    async.parallel(asyncTasks, function(){
        // All tasks are done now
        data += "Infinity comes last"
        res.end(data);
    });
});





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
