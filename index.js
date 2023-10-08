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

//This is the variable that controls all user text.

let user_texts = {};
let name_id_pairs = {};
let isSharing = true;
let isEditing = false;

let soloText = "";
let currentSharingID = "";

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

    //GET handler test
    app.get("/retrieve", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(currentText));
        };
        getData();
    });

    //Get the user's device ID
    //GET handler test
    app.get("/getUserId", function(req, res){
        const getData = async () => {
            const deviceID = req.cookies.deviceID || generateUniqueID();
            res.send(JSON.stringify(deviceID));
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
        //console.log(id_text_pair);

        // Get the deviceID from the cookie or generate a new one
        const deviceID = req.cookies.deviceID || generateUniqueID();

        // Set the deviceID as a cookie to remember it for future requests
        res.cookie("deviceID", deviceID);

        // Update the user_texts variable with the deviceID as the key
        user_texts[deviceID] = id_text_pair.text;

        //console.log("\nuser_texts: ")
        //console.log(user_texts);
        console.log("isSharing: " + isSharing);

        //console.log("\nname_id_pairs: ")
        //console.log(name_id_pairs);

        // Send a response with the updated user_texts
        res.json(user_texts[deviceID]);
        
    });

    // POST handler to update a specific user_text variable based on id
    app.post("/userUpdate/send", function(req, res){
        const newText = req.body.text;
        console.log(newText);

        // Update the user_texts variable with the deviceID as the key
        soloText = newText;

        // Send a response with the updated user_texts
        res.json(newText);
        
    });

    app.get("/userUpdate/retrieve", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(soloText));
        };
        getData();
    });

    //Sets the current sharing id on the server
    app.get("/setSharingID/:new_id", function(req, res){
        const getData = async () => {
            currentSharingID = req.params.new_id;
        };
        getData();
    });

    //Retrieves the current sharing id from the server
    app.get("/getSharingID", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(currentSharingID));
        };
        getData();
    });
    

    // POST handler to update the name_id_pair variable with a new pair
    app.post("/setUsername", function(req, res){
        const username = req.body;
        console.log("req: " + username.username);
        
        // Get the deviceID from the cookie or generate a new one
        let deviceID = req.cookies.deviceID || generateUniqueID();
        res.cookie("deviceID", deviceID);

        // Update the user_texts variable with the deviceID as the key
        name_id_pairs[deviceID] = username.username;

        // Send a response with the updated user_texts
        res.json(user_texts[deviceID]);
        
    });
    

    //GET all user texts
    app.get("/getUserText", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(user_texts));
            //console.log(user_texts);
        };
        getData();
    });

    //GET a specific user text based on id
    app.get("/getUserText/:user_id", function(req, res){
        const getData = async () => {
            console.log("Getting by user id: " + user_texts[req.params.user_id]);
            res.send(JSON.stringify(user_texts[req.params.user_id]));
        };
        getData();
    });



    //GET handler test
    app.get("/getNamePairs", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(name_id_pairs));
            //console.log(user_texts);
        };
        getData();
    });

    //Toggles the isSharing variable.
    app.post("/setShareValue", function(req, res){
        const getData = async () => {

            const newValue = req.body.value;
            console.log("setShareValue body: " + newValue);
            isSharing = newValue;

            // Send a response with the updated user_texts
            res.json(newValue);

        };
        getData();
    });

    //Toggles the isEditing variable.
    app.get("/toggleEditing/:value", function(req, res){
        const getData = async () => {
            if(req.params.value =="true") {
                isEditing = true;
            }
            else if(req.params.value == "false") {
                isEditing = false;
            }
        };
        getData();
    });

    //Returns the value of the isEditing variable
    app.get("/getEditValue", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(isEditing));
        };
        getData();
    });

    //Returns the current value of isSharing
    app.get("/getShareStatus", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(isSharing));
        };
        getData();
    });



    let ip = "10.200.45.183"
    //let ip = "216.249.148.174"
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
    return uniqueID;
}