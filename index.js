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

//This is the text at the top of the screen
let currentText = {
    text: "default"
};

let name_id_pairs = {};

//This is the variable that controls all user text.
let user_texts = {};

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
    
    //Basic, unused, GET
    app.get("/", function(req, res){
        res.send("Running at Port " + PORT);
    });

    //Initial setup
    app.post("/setUsername", function(req, res){
        console.log("The set username request works");

        const { username } = req.body;
        console.log(username);
        

        // Get the deviceID from the cookie or generate a new one
        let deviceID = req.cookies.deviceID || generateUniqueID();
        console.log(deviceID);

        // Set the deviceID as a cookie to remember it for future requests
        res.cookie("deviceID", deviceID);

        name_id_pairs[deviceID] = username;
        console.log("new username set");
        console.log(name_id_pairs);

        res.send("Username set!");
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

        const id_text_pair = req.body;

        // Get the deviceID from the cookie or generate a new one
        deviceID = req.cookies.deviceID

        // Set the deviceID as a cookie to remember it for future requests
        res.cookie("deviceID", deviceID);

        // Update the user_texts variable with the deviceID as the key
        user_texts[deviceID] = id_text_pair.text;

        console.log("\nuser_texts: ");
        console.log(user_texts);

        //Shows the current name id pairs on loop
        console.log("\nname_id_pairs: ");
        console.log(name_id_pairs);

        // Send a response with the updated user_texts
        res.json(user_texts[deviceID]);
        
    });

    //GET handler test
    app.get("/getUserText", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(user_texts));
            console.log(user_texts);
        };
        getData();
    });

    let ip = "10.200.44.189";
    //let ip = "216.249.148.174";
    //Listen for requests at the specified port
    http.listen(PORT, ip, function () {
        console.log('Running at ' + ip + ":" + PORT); 
    }); 
});




// Generate a unique ID for a device
function generateUniqueID() {
    // You can use any method to generate a unique ID here.
    // For simplicity, you can use a random string or a timestamp-based ID.
    const uniqueID = Math.random().toString(36).substring(2) + Date.now().toString(36);
    console.log("This id was just generated:" + uniqueID);
    return uniqueID;
}