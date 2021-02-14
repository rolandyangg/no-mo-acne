var pos;
var map;
var bounds;
var service;
var zip;
var infoWindow;
var currentInfoWindow;

function initialize() {
  var geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow;
  currentInfoWindow = infoWindow;
  bounds = new google.maps.LatLngBounds();
  map = new google.maps.Map(document.getElementById("map1"), {
    zoom: 4.5,
    center: {
      lat: 38,
      lng: -95.7
    }
  });
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("zip").value;
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      zip = results[0].geometry.location;
      resultsMap.setCenter(zip);
      resultsMap.setZoom(13);
      bounds.extend(zip);
      getNearbyPlaces(zip);
    } else {
      zip = {
        lat: 40,
        lgn: -70
      };
      map = new google.maps.Map(document.getElementById('map1'), {
        center: pos,
        zoom: 15
      });
      getNearbyPlaces(zip);
    }
  });
}

function getNearbyPlaces(position) {
  let request = {
    location: position,
    rankBy: google.maps.places.RankBy.DISTANCE,
    keyword: 'dermatologist'
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
}

function createMarkers(places) {
  places.forEach(place => {
    let marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name
    });

    google.maps.event.addListener(marker, 'click', () => {
      let request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'geometry', 'website', 'rating', 'price_level', 'opening_hours']
      };
      service.getDetails(request, (placeResult, status) => {
        showDetails(placeResult, marker, status)
      });
    });
    bounds.extend(place.geometry.location);
  });
  map.fitBounds(bounds);
}

function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var placeInfowindow = new google.maps.InfoWindow();
    var name, address, rating, website;
    if (placeResult.name) {
      var name = placeResult.name;
    } else {
      name = "N/A"
    }
    if (placeResult.rating) {
      var rating = "<b>" + placeResult.rating + " / 5.0 &#9734";
    } else {
      rating = "N/A"
    }
    if (placeResult.formatted_address) {
      var address = placeResult.formatted_address;
    } else {
      address = "N/A"
    }
    if (placeResult.website) {
      var website = placeResult.website;
    } else {
      website = "N/A"
    }
    placeInfowindow.setContent("<div>" +
      "Name: <b>" + name + "</b>" +
      "<br>" + "Address: " + address +
      "<br>" + "Website: " + website +
      "<br>" + "Rating: " + rating +
      "</div>"
    );
  }
  placeInfowindow.open(marker.map, marker);
  currentInfoWindow.close();
  currentInfoWindow = placeInfowindow;

}

// INTERACTIVE WEBPAGE

const inpFile = document.getElementById("imageInput");
const previewContainer = document.getElementById("imagePreview");
const previewImage = previewContainer.querySelector(".image-preview__image");
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text");
const form = document.getElementById("submission-form");

// Image Preview
inpFile.addEventListener("change", function () {
  const file = inpFile.files[0];

  if (file) {
    const reader = new FileReader();

    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";

    reader.addEventListener("load", function () {
      previewImage.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(file);
  } else {
    previewDefaultText.style.display = null;
    previewImage.style.display = null;
    previewImage.setAttribute("src", "");
  }
});

// Ajax Post
form.onsubmit = function (event) {
  const file = inpFile.files[0];

  event.preventDefault() // prevent form from posting without JS

  console.log("Clicked Submit");

  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  for (const file of inpFile.files) {
    formData.append("myFiles[]", file);
  }

  console.log(formData);

  jQuery.ajax({
    url: '/analyze',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function (data) {
      // Where the magic happens
      var jsondata = JSON.parse(data);
      useData(jsondata);
    }
  });
  console.log("Data Sent");
}

function useData(data) {
  var dataresult = "<h2>Here are your results: </h2>"
  var topNotFound = true;
  for (const concept of data) { // goes in order from highest to lowest
    let level = concept.name;
    switch (level) {
      case "level-1-acne":
        level = "Mild";
        break;
      case "level-2-acne":
        level = "Moderate";
        break;
      case "level-3-acne":
        level = "Severe"
        break;
      default:
        level = "NA" // Hopefully this doesn't happen just a failsafe tho :eyes:
    }
    if (topNotFound) {
      setToResult(level.toLowerCase());
      topNotFound = false;
    }
    dataresult += "<h5>" + level + ": " + (concept.value * 100).toFixed(2) + "%</h5><br>";
  }
  $('#pills-results').html(dataresult);
}

function setToResult(level) {
  fetch('descriptions/' + level + "-diagnosis.txt")
  .then(function(response){
    return response.text();
  })
  .then(function(data){
    $('#pills-diagnosis').html(data);
  })
  .catch(function(error){
    console.log(error) // welp
  })

  fetch('descriptions/' + level + "-treatment.txt")
  .then(function(response){
    return response.text();
  })
  .then(function(data){
    $('#pills-treatment').html(data);
  })
  .catch(function(error){
    console.log(error) // welp[1]
  })
}