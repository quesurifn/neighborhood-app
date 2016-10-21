var map;
var service;
var infowindow;

var food = {
  mexican: "mexican food",
  pizza: "italian food",
  coffee: {
    venue: "cafe",
    keyword: "coffee"
  }
};

var geo = {
  local: {
    longitude: "",
    latitude: "",
    positionFound: false
  }
};

geo.location = function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        geo.local.longitude = position.coords.longitude;
        geo.local.latitude = position.coords.latitude;
        geo.local.positionFound = true;
      });
    }
}();

var viewModel = function() {
  this.checkedOption = ko.observable();
  this.mexican = ko.computed({
  
      }
    }
  )

}

console.log(geo.local.latitude + "fooBar");


function initMap() {
      var userLocation = new google.maps.LatLng(geo.local.latitude, geo.local.longitude);
      console.log(geo.local.latitude);
      console.log(geo.local.longitude);


      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 11
      });

    var request = {
    location: userLocation,
    bounds: map.getBounds(),
    query: 'italian food',
    type: 'restaurant',
    openNow: true

  };
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    function createMarker(place) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("<div><strong>" + place.name + "</strong><br>" + place.formatted_address + "<br>" + place.rating );
        infowindow.open(map, this);
      });
    }

setTimeout(function() {
  initMap();
}, 5000);
