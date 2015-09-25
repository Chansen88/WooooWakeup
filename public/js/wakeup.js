$(function() {
  var locationLat;
  var locationLong;
  var $newwakeup = $('.newwakeup');
  var $mainContainer = $('.main-container');
  var path = $('.userid').val();
  var $newpanel = $('#newpanel');
  $newwakeup.hide();
  var el = $(this);
  console.log(moment(el.attr("datetime")));

  $.ajax({
    type: 'get',
    url: path + '/weathers'
  }).done(function(data) {
    $('.weather-div').append(data);
  });

  function displayPosition(position) {
    locationLong = Number(position.coords.longitude).toFixed(4);
    locationLat = Number(position.coords.latitude).toFixed(4);
    console.log('Location IN');
    $('.locationLat').val(locationLat);
    $('.locationLong').val(locationLong);

  }

  function displayError(error) {
    var errors = {
      1: 'Permission denied',
      2: 'Position unavailable',
      3: 'Request timeout'
    };
    alert('Error: ' + errors[error.code]);
  }

  $('#location').on('click', function(e) {
    e.preventDefault();
    if (navigator.geolocation) {
      var timeoutVal = 10 * 1000 * 1000;
      navigator.geolocation.getCurrentPosition(
        displayPosition,
        displayError,
        { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  });

  //I don't remove the UI portions with a done, because then the performances is terrible

  $('.delete').on('click', function(e) {
    $.ajax({
      type: 'POST',
      url: path + '/wakeups/' + $(this).attr('data-wakeupid') + '?_method=delete',
    });
    $(this).parent().parent().parent().remove();
  });

  $('.on-off').on('click', function(e) {
    $.ajax({
      type: 'POST',
      url: path + '/wakeups/' + $(this).attr('data-wakeupid') + '?_method=put',
    });
  });

  $('#new').on('click', function(e) {
    $newwakeup.toggle();
  });

  $('#postnew').on('click', function(e) {
    var wakeup = {};
    wakeup.title = $('#wakeuptitle').val();
    wakeup.date = $('#wakeupdate').val();
    wakeup.time = $('#wakeuptime').val();
    $.ajax({
      type: 'POST',
      url: path + '/wakeups',
      data: wakeup
    }).done(function(data) {
      console.log('work');
      $newpanel.remove();
      $mainContainer.append(data);
      $newwakeup = $('.newwakeup');
      $newwakeup.hide();
    });
  });
});
