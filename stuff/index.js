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

  inpFile.addEventListener("change", function() {
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