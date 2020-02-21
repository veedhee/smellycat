/*var socketio = io.connect('https://' + document.domain + ':' + location.port);

socketio.on("connect", function(){
  console.log("hereee");
})*/
var start_notes;

var socket = io();
socket.on('connect', function() {
        socket.emit('my event', {data: 'I\'m connected!'});
    });

socket.on("test", function(message){
  //changed
  start_notes = message["already_present"];
    for(var key in start_notes)
    {
      if(start_notes[key] == true)
      {
        console.log(key);
        $(key).addClass("selected");
      }
    }
})

socket.on("broadcast_note", function(classes){
  $(classes).toggleClass("selected");
})

