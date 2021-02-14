const express = require('express');
const bodyParse = require("body-parser");

const app = express();
const port = 300;

app.get('/', (req, res) => {
    console.log("Success");
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, function(){
    console.log("Server is running on port " + port);
});