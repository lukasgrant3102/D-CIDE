//Import Dependencies
const express = require('express');
const fs = require('fs');
const app = express(); 
let ip = "216.249.148.174";
//let ip = "10.200.45.49";
let PORT = 8080; 
const path = require("path");
const bp = require("body-parser");
const cors = require("cors");
const http = require('http').Server(app);

let currentText = {
    text: "default"
};

//Set up express and its middleware
app.use(cors());
app.use('/', express.static(path.join(__dirname, './')));
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

// Set the appropriate MIME type for CSS files
app.use('/styles', express.static(path.join(__dirname, './styles'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.css') {
        res.setHeader('Content-Type', 'text/css');
      }
    }
}));
  

//Basic, unused, GET
app.get("/", function(req, res){
    res.send("Running at Port " + PORT);
});

//GET handler test
app.get("/retrieve", function(req, res){
    const getData = async () => {
        res.send(JSON.stringify(currentText));
    };
    getData();
});

// POST handler to update currentText
app.post("/update", function(req, res){
    const { text } = req.body;
    
    // Update the currentText variable
    currentText.text = text;
    
    // Send a response with the updated currentText
    res.json(currentText);
});


//Listen for requests at the specified port
http.listen(PORT, ip, function () {
    console.log('Running at ' + ip + ":" + PORT); 
}); 