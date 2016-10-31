var map, service, infowindow;
var results, allResults = [];
var self = this;
self.markerResults = ko.observableArray([]);
self.content = ko.observable();
self.allResults = [];

var food = {
  mexican: "mexican food",
  pizza: "italian food",
  venue: {
    keyword: "restaurant"
  }
};

var cafe = {
  venue: "cafe",
  keyword: "coffee"
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
console.log(geo.local.latitude + "fooBar");


function initMap() {
      var userLocation = new google.maps.LatLng(geo.local.latitude, geo.local.longitude);
      console.log(geo.local.latitude);
      console.log(geo.local.longitude);


      map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 11
      });

    var request = {
    location: userLocation,
    bounds: map.getBounds(),
    query: queryL(),
    type: typeL(),
    openNow: true,
  }


  console.log(queryL());
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}



    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK){
          markerResults(results);
          //console.log(markerResults);
          //console.log(allResults);
          for (var j = 0; j < results.length; j++) {
            createMarker(results[j]);
            allResults.push(results[j]);
            }
            console.log(allResults);

          }
        }


    function createMarker(place) {
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
      });



      google.maps.event.addListener(marker, "click", function(){
        map.setCenter(this.getPosition());
        map.setZoom(11);
        if (place.rating == undefined) {
          content("<div><strong>" + place.name + "</strong><br>" + place.formatted_address + "<br>");
        } else {
          content("<div><strong>" + place.name + "</strong><br>" + place.formatted_address + "<br>" + "Stars: " + place.rating );
        }
        infowindow.setContent(content());
        infowindow.open(map, this);
      });
    }

contentSet = function (data){
  if (this.rating == undefined) {
    return self.content("<div><strong>" +this.name + "</strong><br>" + this.formatted_address + "<br>");
  } else {
    return self.content("<div><strong>" + this.name + "</strong><br>" + this.formatted_address + "<br>" + "Stars: " + this.rating );
  }
}

gotoMarker = function(clickedMarkerName){
  var clickedName = clickedMarkerName.name;
  for (var key in allResults) {
    if (clickedName === allResults[key].name) {
      map.panTo(allResults[key].geometry.location);
      map.setZoom(11);
      contentSet(allResults[key])
      infowindow.open(map, allResults[key]);
      console.log(allResults[key]);
      }
    }
  }

var viewModel = function() {
  var self = this;
  self.food = ko.observable(food);
  self.cafe = ko.observable(cafe);
  self.queryL = ko.observable("");
  self.typeL = ko.observable("");
  self.typeOfFood = ko.observable();
  self.markerResults;

self.tacos = function() {
  self.queryL(self.food().mexican);
  self.typeL(self.food().venue.keyword);
  console.log(self.food().mexican);
  console.log(self.food().venue.keyword);
  self.initMap();
};

self.pizza = function() {
  self.queryL(self.food().pizza);
  self.typeL(self.food().venue.keyword);
  console.log(self.food().pizza);
  console.log(self.food().venue.keyword);
  self.initMap();
};

self.coffee = function() {
  self.queryL(self.cafe().keyword);
  self.typeL(self.cafe().venue);
  console.log(self.cafe().keyword);
  console.log(self.cafe().venue);
  self.initMap();
};



  /*self.logMarker = function(clickedMarkerName){
      var clickedName = clickedMarkerName;
      for (var key in allResults) {
      if (clickedName === allResults[key].name) {
        console.log(self.allResults[key].geomerty.location);
      }
    }
  }*/
}
ko.applyBindings(viewModel);
