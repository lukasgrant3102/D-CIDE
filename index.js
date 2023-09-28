//Import Dependencies
const express = require('express');
const fs = require('fs');
const app = express(); 
//let ip = "216.249.148.174";
//let ip = "10.200.45.49";
let PORT = 8080; 
const path = require("path");
const bp = require("body-parser");
const cors = require("cors");
const http = require('http').Server(app);

//This is the text at the top of the screen
let currentText = {
    text: "default"
};

//This is the variable that controls all user text.
let user_texts = new Object();
user_texts = {"192.164.1.201": "This is a test entry",
                "192.164.1.202": "This is a test entry also"};


//Must have the user ip to run the program.
fetch('https://api.ipify.org?format=json')
.then(response => response.json())
.then(data => {

    //Start main app here.
    user_ip = data.ip;
    console.log(user_ip);

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


    // POST handler to update the user_texts variable for each users ip
    app.post("/userUpdate", function(req, res){
        const ip_text_pair = req.body;
        console.log(ip_text_pair);
        
        // Update the currentText variable
        user_texts[Object.keys(ip_text_pair)[0]] = ip_text_pair[Object.keys(ip_text_pair)[0]];
        console.log(user_texts);
        
        // Send a response with the updated currentText
        res.json(user_texts[Object.keys(ip_text_pair)[0]]);
        
    });

    //Listen for requests at the specified port
    http.listen(PORT, user_ip, function () {
        console.log('Running at ' + user_ip + ":" + PORT); 
    }); 
});