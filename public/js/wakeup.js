$(function() {
  var locationLat;
  var locationLong;
  // function sendLocation(position) {
  //   $.ajax({
  //     type: 'POST',
  //     url: '/users/edit',
  //     data: position,
  //     dataType: 'json'
  //   }).done(function(data) {
  //     // ADD LOCATION under button.
  //     //Update weather app
  // }

  function displayPosition(position) {
    locationLong = Number(position.coords.longitude).toFixed(4);
    locationLat = Number(position.coords.latitude).toFixed(4);
    console.log("Location IN");
    $('.locationLat').val(locationLat);
    $('.locationLong').val(locationLong);

  }

  function displayError(error) {
    var errors = {
      1: 'Permission denied',
      2: 'Position unavailable',
      3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
  }

  $('#location').on('click', function(e) {
    e.preventDefault();
    console.log("Button");
    if (navigator.geolocation) {
      var timeoutVal = 10 * 1000 * 1000;
      navigator.geolocation.getCurrentPosition(
        displayPosition,
        displayError,
        { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  });
});
