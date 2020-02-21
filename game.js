// DECLARARTIONS
var song_title;
var artist;
var song_el = $("#song_name");
var letter, space;
var chances = 5;
var split_title, new_split_title;
var found;
var hint_no = 0;

var artist, album, release;
var featured;

var artist_el = $(".artist_val");
var album_el = $(".album_val");
var featured_el = $(".featured_val");
var release_el = $(".release_val");
var hints = $(".hint");
var chance_el = $(".chance_val");

var border_list = ["border-black", "border-gray"];
var b_ind = 0;

var temp;

// RANDOM ANGLE
function r(min, max) {
    return Math.random() * (max - min) + min;
}


// GET RANDOM SONG
function callRandomSong()
{
  $.getJSON("/getsong/", function(data){
    song_title = data.song_title;
    artist = data.artist;
    featured = data.featured;
    album = data.album;
    release = data.release;

    artist_el.text(artist);

    layout(song_title);
    // REMOVING SPACES TO MATCH THE INPUT
    new_split_title = split_title.filter(function(value, index, arr){
        return (value  >= "A" && value <= "Z") || (value >= "0" && value <= "9");
    });

    temp = Object.assign([], new_split_title);

  })
  .fail(callRandomSong)
}




// LAYOUT THE BLANKS
function layout(song_title){
    split_title = song_title.split("");
    for(var i=0; i<split_title.length; i++)
    {
        if(split_title[i] != " ")
        {
            if((split_title[i] >= "A" && split_title[i] <= "Z") || (split_title[i] >= "0" && split_title[i] <= "9"))
            {
                letter = $("<span/>", {text: "?", "class": `${border_list[b_ind]} text`});
                song_el.append(letter);
            }
            else
            {
                letter = $("<span/>", {text: split_title[i], "class": `${border_list[b_ind]} correct`});
                song_el.append(letter);
            }
        }
        else
        {
            space = $("<div />").addClass("space");
            song_el.append(space);
            b_ind = 1 - b_ind;
        }
    }
}


// ON USER INPUT CHECK
// - IF THE LETTER EXISTS
// - GET THE INDICES OF ALL OCCURENCES
// - IF NOT PRESENT, DEC CHANCES
function check()
{
    found = [];
    var inp = $("#inp input").val();
    inp = inp.toUpperCase();

    console.log("INP: "+inp);

    if (new_split_title.indexOf(inp) != -1){

        for(var i=0; i<new_split_title.length; i++)
        {
            if(new_split_title[i] == inp)
            {
                found.push(i);
                temp[i] = null;
            }
        }
        updateDOM(letter_found = true, found, inp);
    }

    else{
        chances -= 1;
        updateDOM(letter_found = false);
    }
    $("#inp input").val("");
    complete();

}

// CHECK IF COMPLETE
function complete()
{
  console.log("checking..");
  var flag = 0;
  for(var i=0; i<temp.length; i++)
  {
    if(temp[i] != null)
    {
        console.log(temp);
        flag = 1;
    }
  }

  if(flag == 0){
    console.log("YAYYY");
    // END ANIM TIME
    var end = Date.now() + (2 * 1000);
    // CELEBRATORY ANIMATION
    var interval = setInterval(function() {
    if (Date.now() > end) {
        return clearInterval(interval);
    }

    confetti({
    angle: r(55, 125),
    spread: r(50, 70),
    particleCount: r(50, 100),
    origin: {
        y: 0.6
    }
});
}, 200);

}
}


// UPDATE DOM WHEN USER INPUTS A CHAR
function updateDOM(letter_found, ind, inp)
{
    if(letter_found)
    {
        for(var i=0; i<ind.length; i++)
        {
            $("span.text").eq(ind[i]).addClass("correct").text(`${inp}`);
        }
    }

    else
    {
        chance_el.text(chances);
        if(chances == 0)
        {
            $("input").prop('disabled', true);
        }
    }
}


// GET HINTS
function getHint()
{
    if(hint_no == 0)
    {
        hint_no += 1;
        if(album){
        album_el.text(album);
        chances -= 1;
        }
        else{
            album_el.text("Not Found");
            chances += 1;
        }
    }
    else if(hint_no == 1)
    {
        hint_no += 1;
        if(featured.length > 0){
        featured_el.text(featured);
        chances -= 1;
        }
        else{
            featured_el.text("Not Found");
        }
    }
    else if(hint_no == 2)
    {
        hint_no += 1;
        if(release){
        release_el.text(release);
        chances -= 1;
        }
        else{
            release_el.text("Not Found");
        }
    }
    else
    {
        alert("No More hints available");
    }
    updateDOM(letter_found = false);
}


function start()
{
  $("input").prop('disabled', false);
   $(".answer").text("");
  album_el.text("");
  featured_el.text("");
  release_el.text("");
  chances = 5;
  hint_no = 0;
  featured = 0;
  chance_el.text(chances);
  $("#song_name").empty();
  callRandomSong();
}


$("#guess").click(check);

$(".hint").click(getHint);

$("#new").click(start);
start();

$("#answer").click(function(){
  $(".answer").text(song_title);
  chances = 0;
  updateDOM(letter_found = false);
});