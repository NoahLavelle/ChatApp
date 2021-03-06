var Scrollbar = window.Scrollbar

var options = {
  'damping': 0.1,
  'thumbMinSize': 20,
  'renderByPixels': true,
  'alwaysShowTracks': true,
  'continuousScrolling': true

}

console.log(Scrollbar)

Scrollbar.init(document.querySelector('.channel'), options);
$('.channel').css('overflow', 'visible')
$('.scrollbar-track-y').css('background-color', '#2E3338')

var socket = io();

let channelName = 'info';

$('#channels').children().each(function () {
  if ($(this).attr('id') !== 'info') {
   $(this).hide();
  }
});

$('#chat').hide();
$('.sidebar').hide();
$('#message').hide();
$('.contentheader').hide();


$('#uname').submit(function (e) {
  if (/([A-Z,a-z,1-2])/.test($('#u').val())) {
  $('.sidebar').fadeIn(() => {
    $('#message').fadeIn();
    $('.contentheader').fadeIn();
  });
  
  e.preventDefault();
  socket.emit('create name', $('#u').val());
  $('#u').val('');
  $('#signup').hide()
  $('#chat').show()
  return false;
}
});

$('#message').submit(function (e) {
  if (/([A-Z,a-z,1-2])/.test($('#m').val())) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val(), channelName);
    $('#m').val('');
    return false;
  }
});

let overflowing = false;

socket.on('chat message', function (msg, username, color, msgChannel) {
  if (validURL(msg) === true) {
    $(`#${msgChannel} > .scroll-content`).append($(`<div class="messageWrapper"><label style="color:#${color}!important" class="messageStyle">${username}</label><a class="messageContent" href="${msg}">${msg}</a>`))
    if (/(?:jpg|gif|png)/.test(msg)) {
      $(`#${msgChannel} > .scroll-content`).append($(`<img src=${msg} class="displayImage">`))
    }
  } else {
    $(`#${msgChannel} > .scroll-content`).append($(`<div class="messageWrapper"><label style="color:#${color}!important;" class="messageLabel">${username}</label><msg class="messageContent">${msg}</msg></div>`))
  }

});

socket.on('append user', function (users) {
  $('#onlineusers').html('')
  let keys = Object.keys(users);
  let final = ''
  
  for (let i of keys) {
    final += `<span style="color:#${users[i][1]};">${users[i][0]}</span><br>`
  }

  $('#onlineusers').html(final)
});

function changeChannel(channel) {
  $(`#${channelName}li`).attr('data-focused', 'false')
  $(`#${channelName}`).hide()
  $(`#${channel}li`).attr('data-focused', 'true')
  $(`#${channel}`).show()
  channelName = channel
  $('#m').attr('placeholder', `Message #${channelName}`);

  $('.contentheader').text(`${channelName} ${$(`#${channelName}`).attr('description')}`)
}

function validURL(str) {
  return /(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6}|:[0-9]{3,4})\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.test(str)
}

// Phone Styling

if ((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))) {
  currentSidebar = 'none'

  $( "body" ).on("swiperight", () => {
    if (currentSidebar === 'onlineUsers') {
      $('.sidebar.right').animate({width: '0'}, 60);
      currentSidebar = 'none'
    } else if (currentSidebar === 'none') {
      $('.sidebar.left').animate({width: '70%'}, 60);
      currentSidebar = 'channels'
    }
  });


  $( "body" ).on("swipeleft", () => {
    if (currentSidebar === 'channels') {
      $('.sidebar.left').animate({width: '0'}, 60);
      currentSidebar = 'none'
    } else if (currentSidebar === 'none') {
      $('.sidebar.right').animate({width: '70%'}, 60);
      currentSidebar = 'onlineUsers'
    }
  });
}