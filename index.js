//Import Dependencies
const express = require('express');
const fs = require('fs');
const app = express(); 
const { exec } = require('child_process');
//let ip = "216.249.148.174";
//let ip = "10.200.45.49";
let PORT = 8080; 
const path = require("path");
const bp = require("body-parser");
const cors = require("cors");
const http = require('http').Server(app);
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

//This is the text at the top of the screen
let currentText = {
    text: "default"
};


//This is the variable that controls all user text.
let user_texts = {};
let user_console_texts = {};
let name_id_pairs = {};
let status_id_pairs = {};
let isSharing = true;
let isEditing = false;

let soloText = "";
let currentSharingID = "";
let file_count = 0;

//Must have the user ip to run the program.
fetch('https://api.ipify.org?format=json')
.then(response => response.json())
.then(data => {

    //Start main app here.
    user_ip = data.ip;
    //console.log(user_ip);

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
        deviceID = req.cookies.deviceID

        // Set the deviceID as a cookie to remember it for future requests
        res.cookie("deviceID", deviceID);

        // Update the user_texts variable with the deviceID as the key
        user_texts[deviceID] = id_text_pair.text;


        //console.log("\nuser_texts: ")
        //console.log(user_texts);
        //console.log("isSharing: " + isSharing);

        //console.log("\nname_id_pairs: ")
        //console.log(name_id_pairs);


        //Shows the current name id pairs on loop
        console.log("\nname_id_pairs: ");
        console.log(name_id_pairs);

        // Send a response with the updated user_texts
        res.json(user_texts[deviceID]);
        
    });

    // POST handler to update a specific user_text variable based on id
    app.post("/userUpdate/send", function(req, res){
        const newText = req.body.text;
        //console.log(newText);

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
    app.post("/setSharingID", function(req, res){
        const new_id = req.body.id;
        currentSharingID = new_id;
        res.json(new_id);
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
        status_id_pairs[deviceID] = "yellow";

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
            //console.log("Getting by user id: " + user_texts[req.params.user_id]);
            res.send(JSON.stringify(user_texts[req.params.user_id]));
        };
        getData();
    });

    //GET the list of name-id pairs
    app.get("/getNamePairs", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(name_id_pairs));
        };
        getData();
    });


    //GET the list of status-id pairs
    app.get("/getStatusPairs", function(req, res){
        const getData = async () => {
            res.send(JSON.stringify(status_id_pairs));
        };
        getData();
    });

    //GET the list of status-id pairs
    app.get("/resetStatus", function(req, res){
        const getData = async () => {
            for(var id in status_id_pairs) {
                status_id_pairs[id] = "yellow";
            }
        };
        getData();
    });

    

    //Toggles the isSharing variable.
    app.post("/setShareValue", function(req, res){
        const getData = async () => {

            const newValue = req.body.value;
            //console.log("setShareValue body: " + newValue);
            isSharing = newValue;

            // Send a response with the updated user_texts
            res.json(newValue);

        };
        getData();
    });

    //Toggles the isSharing variable.
    app.post("/setEditValue", function(req, res){
        const getData = async () => {

            const newValue = req.body.value;
            //console.log("setEditValue body: " + newValue);
            isEditing = newValue;

            // Send a response with the updated user_texts
            res.json(newValue);

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


    //Run code - In progress
    app.post('/execute-java', (req, res) => {
        file_count += 1;
        // Receive Java code from the POST request
        const uniqueID_PRE = uuidv4();
        let uniqueID = uniqueID_PRE.replace(/-/g, "_");


        let javaCode = req.body.code;
        let match = javaCode.match(/public class (\w+)/);
        let className = match ? match[1] : null; // Initial class name before modification
        let newClassName = "NoClassDefined";

        if (match) {
            newClassName = `${className}_${uniqueID}`;
            // Replace the class declaration with the new name including the uniqueID
            javaCode = javaCode.replace(match[0], `public class ${newClassName}`);

            // Regular expression to match the constructor declarations and class instantiations
            const pattern = `\\b${className}\\b`;
            const regex = new RegExp(pattern, 'g');

            // Replace all occurrences of the class name with the new name including the uniqueID
            javaCode = javaCode.replace(regex, newClassName);
        }



        let deviceID = req.cookies.deviceID || generateUniqueID();

      
        // Write the Java code to a temporary file
        fs.writeFile('JavaFiles/' + newClassName + '.java', javaCode, (writeError) => {
          if (writeError) {
            user_console_texts[deviceID] = writeError;
            res.status(500).json({ error: 'Error writing Java code to file' });
            return;
          }
          
          
          // Compile the Java source code into a class
            exec('javac JavaFiles/' + newClassName + '.java', (compileError) => {
                if (compileError) {
                    status_id_pairs[deviceID] = "red";
                    user_console_texts[deviceID] = compileError.message;
                    
                    //Delete file
                    fs.unlink('JavaFiles/' + newClassName + '.java', (unlinkError) => {
                        if (unlinkError) {
                            console.error('Error deleting temporary Java file');
                        }
                    });

                    res.status(500).json({ error: "Error compiling code: \n" + javaCode });
                    return;
                }
            
                // Execute the compiled Java class
                exec('java -cp JavaFiles ' + newClassName, (executionError, stdout, stderr) => {
                    if (executionError) {
                        status_id_pairs[deviceID] = "red";
                        user_console_texts[deviceID] = stderr;

                        //Delete files
                        fs.unlink('JavaFiles/' + newClassName + '.java', (unlinkError) => {
                            if (unlinkError) {
                                console.error('Error deleting temporary Java file');
                            }
                        });
                        fs.unlink('JavaFiles/' + newClassName + '.class', (unlinkError) => {
                            if (unlinkError) {
                                console.error('Error deleting temporary class file');
                            }
                        }); 

                        res.status(500).json({ error: 'Error executing Java code: \n' + executionError });
                    } else {
                        // Capture the output of the executed code
                        status_id_pairs[deviceID] = "green";
                        user_console_texts[deviceID] = stdout;
                        //console.log(stdout);
                        res.json({ output: stdout });
                    }
                    
                    // Clean up: Remove the temporary files
                    fs.unlink('JavaFiles/' + newClassName + '.java', (unlinkError) => {
                        if (unlinkError) {
                            console.error('Error deleting temporary Java file');
                        }
                    });
                    fs.unlink('JavaFiles/' + newClassName + '.class', (unlinkError) => {
                        if (unlinkError) {
                            console.error('Error deleting temporary class file');
                        }
                    }); 

                    // Check and delete .class files generated due to anonymous inner classes
                    fs.readdir('JavaFiles', (err, files) => {
                        if (err) {
                            console.error('Error reading the JavaFiles directory');
                            return;
                        }

                        // Filter and delete files matching the pattern
                        files.filter(file => file.startsWith(newClassName + "$") && file.endsWith('.class'))
                            .forEach(file => {
                                fs.unlink('JavaFiles/' + file, unlinkErr => {
                                    if (unlinkErr) {
                                        console.error(`Error deleting ${file}`);
                                    }
                                });
                            });
                    });
                });
            });
        }); 
    });

    //Gets the text for the console for each user
    app.get("/getConsoleOutput", function(req, res){
        let deviceID = req.cookies.deviceID || generateUniqueID();

        const getData = async () => {
            res.send(JSON.stringify(user_console_texts[deviceID]));
            //console.log(JSON.stringify(user_console_texts[deviceID]));
        };
        getData();
    });



    let ip = "216.249.148.174";
    //let ip = "216.249.148.174"
    //let ip = "172.26.88.82";

    //Listen for requests at the specified port
    http.listen(PORT, ip, function () {
        console.log('Running at ' + ip + ":" + PORT + "/main.html"); 
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