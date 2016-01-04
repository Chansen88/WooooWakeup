$(function() {
  var locationLat;
  var locationLong;
  var $newwakeup = $('.newwakeup');
  var $mainContainer = $('.main-container');
  var path = $('.userid').val();
  $newwakeup.hide();
  var el = $(this);

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

  $('.main-container').on('click', '.delete', function(e) {
    $.ajax({
      type: 'POST',
      url: path + '/wakeups/' + $(this).attr('data-wakeupid') + '?_method=delete',
    });
    $(this).parent().parent().parent().remove();
  });

  $('.main-container').on('click', '.on-off', function(e) {
    $.ajax({
      type: 'POST',
      url: path + '/wakeups/' + $(this).attr('data-wakeupid') + '?_method=put',
    });
  });

  $('.main-container').on('click', '#new', function(e) {
    $('#wakeuptime').timepicker({ 'scrollDefault': 'now', 'timeFormat': 'H:i', 'step': 15 });
    $newwakeup.toggle();
  });

  $('.main-container').on('click', '#postnew',function(e) {
    var wakeup = {};
    wakeup.title = $('#wakeuptitle').val();
    wakeup.date = $('#wakeupdate').val();
    wakeup.time = $('#wakeuptime').val();
    if ((moment(moment(wakeup.date + ' ' + wakeup.time)._d).unix() - moment(moment(el.attr("datetime"))._d).unix()) > 300) {
      $.ajax({
        type: 'POST',
        url: path + '/wakeups',
        data: wakeup
      }).done(function(data) {
        $('#newpanel').remove();
        $mainContainer.append(data);
        $newwakeup = $('.newwakeup');
        $newwakeup.hide();
      });
    } else {
      alert('Alarms need to be in the future');
    }
  });
});
