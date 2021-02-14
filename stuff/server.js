const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

const app = express();
const port = 300;

app.use(express.static('stuff'));
app.use(bodyParser.urlencoded({
    extended: true
}));

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key decc6840c2984eedafb77262b5382802");

app.get('/', (req, res) => {
    console.log("Connecting");
    res.sendFile(__dirname + "/index.html");
});

app.post('/analyze', upload.array('myFiles[]'), (req, res) => {
    console.log(req.files[0]);

    const fs = require("fs");
    const imageBytes = req.files[0].buffer; // fs.readFileSync("C:\\Users\\noxbo\\Documents\\GitHub Folders\\acne-helper\\stuff\\images\\acneimage.jpg");

    stub.PostModelOutputs({
            model_id: "acne-classifier",
            version_id: "", // This is optional. Defaults to the latest model version.
            inputs: [{
                data: {
                    image: {
                        base64: imageBytes
                    }
                }
            }]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here.
            const output = response.outputs[0];

            console.log("Predicted concepts:");
            var results = [];
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
                results.push(concept.value);
            }
            // json
            res.send(JSON.stringify(output.data.concepts));
        }
    );

});

app.listen(port, function () {
    console.log("Server is running on port " + port);
});