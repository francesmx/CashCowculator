$(document).ready(function(){
  var $_GET = [];
  document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }
    $_GET[decode(arguments[1])] = decode(arguments[2]);
  });
  var amountMade = parseFloat($_GET["amountMade"]);
  var frequency = $_GET["frequency"];

  var numberHoursInAWorkingDayIncludingLunch = 8;
  var timeStartedWorkInMorning = moment('09:00', "HH:mm:ss");
  var numberWorkingDaysInAYear = 260;
  var dayRate;

  switch(frequency) {
    case "hour":
      dayRate = amountMade * numberHoursInAWorkingDayIncludingLunch;
      break;
    case "day":
      dayRate = amountMade;
      break;
    case "week":
      dayRate = amountMade / 7;
      break;
    case "month":
      dayRate = amountMade * 12 / numberWorkingDaysInAYear;
      break;
    case "year":
      dayRate = amountMade / numberWorkingDaysInAYear;
      break;
  }

  var payPerSecond = dayRate / (numberHoursInAWorkingDayIncludingLunch * 60 * 60);
  var keepCounting = true;

  function calculateAmountEarned(startTime = timeStartedWorkInMorning, stopTime = moment()) {

    if (stopTime >= startTime) {
      let numberSecondsWorked = stopTime.diff(startTime, 'seconds');
      // return (numberSecondsWorked * payPerSecond).toFixed(2);
      let amount = (numberSecondsWorked * payPerSecond).toFixed(2);
      if (amount < dayRate) {
        return amount;
      }
      else {
        keepCounting = false;
        return dayRate.toFixed(2);
      }
    }
    else {
      return 0;
    }
  }

  function displayAmountEarned() {
    var amountEarnedSoFarToday = calculateAmountEarned();
    $('#amountEarned').html('&pound;' + amountEarnedSoFarToday.toString());
  }

  var x = setInterval(function() {
    displayAmountEarned();
    console.log(keepCounting);
    if(!keepCounting) {
      clearInterval(x);
    }
  }, 1000);
});
