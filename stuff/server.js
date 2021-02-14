const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer({dest:'uploads/'});

const app = express();
const port = 300;

app.use(express.static('stuff'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    console.log("Connecting");
    res.sendFile(__dirname + "/index.html");
});

app.post('/analyze', (req, res) => {
    console.log("Received Analyze Request");
    console.log(req.body);
});

app.listen(port, function(){
    console.log("Server is running on port " + port);
});