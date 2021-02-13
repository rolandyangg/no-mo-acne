const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key decc6840c2984eedafb77262b5382802"); // had to get api key from api page
function getAcneLevel(filename) {
    // var results = []; // put results in here

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "acne-classifier",
            inputs: [{data: {image: {url: filename}}}]
            //https://www.thehealthsite.com/wp-content/uploads/2014/08/pimples1.jpg
            // https://mindbodygreen-res.cloudinary.com/images/w_767,q_auto:eco,f_auto,fl_lossy/org/zf7a8y99cjt0cpxj9/is-it-acne-or-rosacea-how-to-spot-the-difference-according-to-a-derm.jpg
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
                results.push(c.value); // putting results in an array
            }
            return results;
        }
    );
}

function upload() {
    const file = document.getElementById("imageInput").value;

    /*
    if (file) { // Make sure file exists
        const reader = new FileReader();

        console.log(reader.readAsDataURL(file));
    }

    console.log(file);
    */
    getAcneLevel(file); // Takes in the file and runs an analysis on it
}

