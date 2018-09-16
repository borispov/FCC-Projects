$(loadWeather)

const unitChoice = 'metric'
const cel = ' &deg;C'
const far = ' &deg;F'

// main function, loads with the page load. requests to access user's location
function loadWeather() {
  if (
    navigator.geolocation.getCurrentPosition(function(position) {
      var x = position.coords.latitude
      var y = position.coords.longitude
      let apiKey = '72d5271adda69d920581266b4f58bfa4'
      let short =
        'https://api.openweathermap.org/data/2.5/weather?lat=' +
        x +
        '&lon=' +
        y +
        '&units=' +
        unitChoice +
        '&appid=72d5271adda69d920581266b4f58bfa4'
      let xhr = new XMLHttpRequest()

      xhr.open('GET', short, true)
      xhr.onload = xhrOnload
      xhr.send()
    })
  );
}

// City Query from the API
function cityWeather() {
  let inputVal = document.querySelector('input').value
  let apiKey = '72d5271adda69d920581266b4f58bfa4'
  let xhr = new XMLHttpRequest()
  let short =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    inputVal +
    '&units=' +
    unitChoice +
    '&appid=' +
    apiKey
  xhr.open('GET', short, true)
  xhr.onload = xhrOnload
  xhr.send()
}

// separate function for STATUS check & setting HTML accordingly.
function xhrOnload() {
  if (this.status == 200) {
    let weather = JSON.parse(this.responseText)
    let place = weather.name + ', ' + weather.sys.country
    let temp = Math.round(weather.main.temp)
    let summary = weather.weather[0].description
    let icon =
      "<img src='https://openweathermap.org/img/w/" +
      weather.weather[0].icon +
      ".png'>"
    document.getElementById('showC').innerHTML =
      place +
      '<br>' +
      "<span id='temp'>" +
      temp +
      '</span>' +
      '<span " id="units" value="c">' +
      cel +
      '</span>' +
      '<br>' +
      summary +
      '<br>' +
      icon
  } else {
    console.log('404 page not found ..or Error')
  }
  unitsConversion()
}

// event listener for 'Enter' Keypress while in 'input' box.
$('input').keypress(function(e) {
  if (e.keyCode == 13) {
    cityWeather()
  }
})
// click on button eventListener
$('button').on('click', cityWeather)

// function for changing Celcius to Fahrenheit and vice versa
function unitsConversion() {
  // the actual conversion function
  const cToF = c => Math.round((c * 9) / 5 + 32)
  const fToC = f => Math.round(((f - 32) * 5) / 9)

  // event listeners to change the html using above functions
  $('#units').click(function() {
    if ($(this).attr('value') == 'c') {
      $(this).attr('value', 'f')
      $(this).html(far)
      $('#temp').text(cToF($('#temp').text()))
    } else {
      $(this).attr('value', 'c')
      $(this).html(cel)

      $('#temp').text(fToC($('#temp').text()))
    }
  })
}
