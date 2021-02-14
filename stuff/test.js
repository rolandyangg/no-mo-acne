
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc"); // <---- This isn't working
// import ClarifaiStub from 'clarifai-nodejs-grpc';

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key decc6840c2984eedafb77262b5382802"); // had to get api key from api page

function getAcneLevel(filename) { // take in url from frontend input

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "acne-classifier",
            inputs: [{data: {image: filename}}]
            // https://www.thehealthsite.com/wp-content/uploads/2014/08/pimples1.jpg
            // https://www.byrdie.com/thmb/h3lnZoIj-HyPpvv8VnZ7hnBGbHk=/1238x994/filters:no_upscale():max_bytes(150000):strip_icc()/EMw5nnLXUAEnuvJ-c925bf0b25d941608cc9e6b4607a4395.jpg
        },
        metadata,
        (err, response) => {
            var results = []
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

             console.log("Predicted concepts, with confidence values:")
             for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
        }
    );
}

/*
function upload() {
    const inpFile = document.getElementById("imageInput");
    const previewContainer = document.getElementById("imagePreview");
    const previewImage = previewContainer.querySelector(".image-preview__image");
    const previewDefaultText = previewContainer.querySelector(".image-preview__default-text");

    const file = inpFile.files[0];

    if (file) {
        const reader = new FileReader();

        previewDefaultText.style.display = "none";
        previewImage.style.display = "block";
        
        reader.addEventListener("load", function() {
            previewImage.setAttribute("src", reader.result);
        });

        reader.readAsDataURL(file);
    } else {
        previewDefaultText.style.display = null;
        previewImage.style.display = null;
        previewImage.setAttribute("src", "");
    }

    console.log(file);

    /*
    if (file) { // Make sure file exists
        const reader = new FileReader();

        console.log(reader.readAsDataURL(file));
    }

    console.log(file);
    // getAcneLevel(file); // Takes in the file and runs an analysis on it
    // getAcneLevel(file);
}
*/
var image = new Image();
image.src="/images/doctor.png";
getAcneLevel(image);

