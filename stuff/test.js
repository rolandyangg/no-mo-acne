function getAcneLevel() {
    const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key decc6840c2984eedafb77262b5382802"); // had to get api key from api page

    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "acne-classifier", // wdf is the model key?
            inputs: [{data: {image: {url: "https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322931/person-with-acne.jpg"}}}]
        },
        metadata,
        (err, response) => {
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
                document.body.innerHTML += c.name + ": " + c.value;
            }
        }
    );
}