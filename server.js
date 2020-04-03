// import express from the node library
var express = require("express");
// import path from the node library
var path = require("path");
// import fs from the node library
var fs = require("fs");
// import db.json file into the server.js file to reference and use fs readFileSync to read contents of the file
var data = fs.readFileSync("./db/db.json", "utf8");
// console.log(data);
// parse the json file
var notesDB = JSON.parse(data);
// console.log(typeof(notesDB));
// since notesDB is an object, we need to turn it into an array of objects
var finalNotesDB = Object.keys(notesDB).map(i => notesDB[i])
// console.log(finalNotesDB);


// instantiate a new express app utilizing the express() method
var app = express();
// declare PORT number so local server can find the application
var PORT = process.env.PORT || 8113;

// middleware will parse the request string and convert the request to a json object that will be referenced later as req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// must reference the public folder for the front end stuff- you have a static folder that does not change where the public facing files lives to interact with the user
app.use(express.static("public"));

// create the HTML get routes
    // client requests an html page on the root route
    // this is the root route - returns the index.html webpage
    app.get("/", function(req, res) {
        // utilize the res.sendFile() method which transfer the given file path and sets the content-type response HTTP header to the appropriate header (example- sends the html path to the browser)
        res.sendFile(path.join(__dirname, "/public/index.html"));
    });
        // then use path.join to combine the directory path of the executing script to the .html file that we want to send to the client      
    // return the notes.html webpage
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "/public/notes.html"));
    });


// create the API get routes
    // set up the notes get route 
    app.get("/api/notes", function(req, res) {
        // response needs to access the notesDB variable in order to send a response
        res.json(finalNotesDB);
        //console.log(finalNotesDB);
    });

// create the API POST routes
    // add data from the database to the json file
    app.post("/api/notes", function(req,res){
        // still need to add a unique id here- change def of newNote on the front end and create unique ID there
        notesDB.push(req.body);
        //notesDB.push("dinner", "pasta")
        // add the new note to the db.json file
        fs.writeFile("./db/db.json", JSON.stringify(notesDB), function(error){
            if (error){
                console.log("Your note did not save");
            }
        })
          // return the new note to the client
          res.json(finalNotesDB);
    })

// create the API delete routes
    app.delete('/api/notes/:id', function (req, res) {
        finalNotesDB.splice(req.params.id);
        res.json("Your note has been deleted")
    })

// return a catch all to the index.html page in case a user types the wrong link
// must be at the very end of the page otherwise it will wipe out all the routes since it is a catch all
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    });
    
// start the server to listen
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});