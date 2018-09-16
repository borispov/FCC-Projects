let channels = ['freecodecamp', 'projectpt', 'dreadztv', 'dendi', 'esl_csgo', 'raizqt'];
const mainUrl = 'https://api.twitch.tv/helix/'
const streamsUrl = mainUrl + 'streams?';
const usersUrl = mainUrl + 'users?';
const apiKey = 'b3zb15tlepbv8pzqx8kiy453e3uw3x'
// mapping the channels array to 'fit' it into the HTTPRequest. 
const streamQuery = () => usersUrl + channels.map((x) => 'user_login=' + x + '&').join('').slice(0, -1);
const userQuery = () => usersUrl + channels.map((x) => 'login=' + x + '&').join('').slice(0, -1);

// dataObj contains ALL streams fetched with API 
let dataObj = [];
// arrayLis - stores the rendered streams, used to check if stream exists, to avoid duplication
let arrayLis = [];

// fetches API when page loads, channels array hard-coded. 
$(mainLoad)

function mainLoad() {
  $.ajax({
    cache: false,
    url: userQuery(),
    headers: { 'Client-ID': apiKey },
    success: function (users) {

      dataObj = users.data.map((x) => ({ login: x.login, id: x.id, profile: x.profile_image_url, display: x.display_name }));

      $.ajax({
        cache: false,
        url: streamsUrl + '?' + dataObj.map((x) => 'user_id=' + x.id + '&').join('').slice(0, -1),
        headers: { 'Client-ID': apiKey },
        success: function (live) {

          // if user is live, adds ' live: 'live' ' key-value, if offline add ' live: 'off' ' key-value
          // if user live, adds title property. to be rendered on the HTML later. 
          dataObj.map((x) => {
            live.data.some((k) => {
              if (k.user_id === x.id) {
                x.live = 'live';
                x.title = k.title;
              }
            })
          });
          // k.user_id === x.id ? (x.live = 'live', x.title = k.title, console.log(x.display + ':' + x.live)) : x.live = 'off';})

          // map method - IF STREAM IS LIVE, RENDER WITH TITLE, ELSE RENDER WOTHOUT TITLE 
          dataObj.map((x, i) => {
            if (arrayLis.indexOf(x.display) === -1) {
              x.live === 'live' ? renderWithTitle(x, i) : renderNoTitle(x, i);
            }
          })

          // push RENDERED streams into array
          lis();

          // show remove-icon when hover on li's
          $('li').hover(function () {
            $(this).find('.remove').show()
          }, function () {
            $(this).find('.remove').hide()
          })

          // eventListener for removing LI's
          $('.remove').on('click', function () {
            let name = String($(this).closest('li').find('.userSpan').html())
            function deleteByKey(array, key, value) {
              for (let i = 0; i < array.length; i++) {
                if (array[i][key] === value) {
                  array.splice(i, 1);
                }
              }
              return null;
            }
            channels = channels.filter(e => e !== name.toLowerCase());
            arrayLis = arrayLis.filter(e => e !== name)
            deleteByKey(dataObj, 'display', name);
            $(this).closest('li').remove();
          })


        }, error: function (err) { console.log('Oops.. error: ' + err) }
      })
    },

    error: function (error) {
      console.log('Something went wrong: ' + error);
    }
  })
}

// input search keypress eventListener
$('input[type=text]').keypress((e) => {
  if (e.keyCode === 13) {
    let input = document.querySelector('input').value.toLowerCase();
    // if search is empty, DO nothing  / prevent default behavior
    if (input === '') {
      e.preventDefault();
    } else {
      $('input').val('');
      channels.indexOf(input) === -1 ? (channels.push(input.toLowerCase()), mainLoad()) : alert("channel's already in the list");
    }
  }
})


// render HTML with title when stream's live.
let renderWithTitle = (x, i) => {
  if (arrayLis.indexOf(x.display) == -1) {
    $('.user-list ul').append("<li class='online'><a href='https://twitch.tv/" + x.display + "' target='_blank'><img src='" + x.profile + "'><span class='userSpan'>" + x.display + "</a></span>" + "<span class='remove'><i class='fas fa-trash-alt'></i></span><span class='onlineText'>Online</span>" + "<p class='title'>" + x.title + "</p>")
  } else {
    return;
  }
}

// render HTML for offline streams
let renderNoTitle = (x, i) => {
  if (arrayLis.indexOf(x.display) == -1) {
    $('.user-list ul').append("<li class='offline'><a href='https://twitch.tv/" + x.display + "' target='_blank'><img src='" + x.profile + "'><span class='userSpan'>" + x.display + "</a></span><span class='remove'><i class='fas fa-trash-alt'></i></span>")
  }
  return null;
}

// Gather all usernames that are Rendered insde the HTML. 
function lis() {
  let spans = document.getElementsByClassName('userSpan')
  arrayLis = [].map.call(spans, user => user.innerHTML);
}


// Listeners for SHow Online, Show Offline & Show All Streamers   & REMOVE button 
$('#showonline').on('click', function () {
  $('.offline').hide('slow');
  $('.online').show('slow');
})

$('#showoffline').on('click', function () {
  $('.online').hide('slow');
  $('.offline').show('slow');
})

$('#showall').on('click', function () {
  $('.online, .offline').show('fast');
})
// end of show stream eventListeners

