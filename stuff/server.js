

const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const upload  = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 300;

app.use(express.static('stuff'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    console.log("Connecting");
    res.sendFile(__dirname + "/index.html");
});

app.post('/analyze', upload.array('myFiles[]'), (req, res) => {
    console.log(req.files[0]);
  });

app.listen(port, function(){
    console.log("Server is running on port " + port);
});