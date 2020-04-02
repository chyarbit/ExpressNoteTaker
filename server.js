// import express from the node library
var express = require("express");
// import path from the node library
var path = require("path");
// import fs from the node library
var fs = require("fs");
// import db.json file into the server.js file to reference
var notesDB = require("./develop/db/db.json");
//console.log(json)

// instantiate a new express app utilizing the express() method
var app = express();
// declare PORT number so local server can find the application
var PORT = 8113;

// middleware will parse the request string and convert the request to a json object that will be referenced later as req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// must reference the public folder for the front end stuff
app.use(express.static("develop/public"));

// create the HTML get routes
    // client requests an html page on the root route
    // this is the root route - returns the index.html webpage
    app.get("/", function(req, res) {
        // utilize the res.sendFile() method which transfer the given file path and sets the content-type response HTTP header to the appropriate header (example- sends the html path to the browser)
        res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
    });
        // then use path.join to combine the directory path of the executing script to the .html file that we want to send to the client      
    // return the notes.html webpage
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
    });
    // return a catch all to the index.html page in case a user types the wrong link
    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
    });

// create the API get routes
    // set up the notes get route 
    app.get("/api/notes", function(req, res) {
        // response needs to access the notesDB variable in order to send a response
        res.json(notesDB);
    });

// create the API POST routes
    // add data from the database to the json file
    app.post("/api/notes", function(req,res){
        notesDB.push(req.body);
        //notesDB.push("dinner", "pasta")
        // add the new note to the db.json file
        fs.readFile("./develop/db/db.json", "utf-8", function (error){
            req.body.push(notesDB);
        })
        fs.writeFile("./develop/db/db.json", JSON.stringify(notesDB), function(error){
          req.body
      })
          // return the new note to the client
          res.json(notesDB);
    })

// create the API delete routes

// start the server to listen
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});