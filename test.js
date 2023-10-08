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
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser')


let isSharing = true;
let currentText = "";

//Must have the user ip to run the program.
fetch('https://api.ipify.org?format=json')
.then(response => response.json())
.then(data => {
    //Start main app here.
    user_ip = data.ip;
    console.log(user_ip);

    //Set up express and its middleware
    app.use(cors());
    app.use(cookieParser());
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

    // POST handler to update a specific user_text variable based on id
    app.post("/setShareValue", function(req, res){
        const newValue = req.body.value;
        console.log("setShareValue body: " + newValue);
        isSharing = newValue;

        // Send a response with the updated user_texts
        res.json(newValue);
        
    });

    app.get("/getShareValue", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(isSharing));
        };
        getData();
    });

    app.get("/getCurrentText", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(currentText));
        };
        getData();
    });

    app.post("/updateCurrentText", function(req, res){
        const text  = req.body;
        
        // Update the currentText variable
        currentText = text;
        
        // Send a response with the updated currentText
        res.json(currentText);
    });


    let ip = "216.249.148.174"
    //let ip = "216.249.148.174"
    //Listen for requests at the specified port
    http.listen(PORT, ip, function () {
        console.log('Running at ' + ip + ":" + PORT); 
    });
});