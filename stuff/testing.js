import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: 'decc6840c2984eedafb77262b5382802'
});

app.models.predict("acne-classifier", [{data: {image: {url: "https://www.thehealthsite.com/wp-content/uploads/2014/08/pimples1.jpg"}}}])
		.then(response =>
		{
      		console.log("Test")});