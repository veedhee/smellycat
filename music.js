//prev: var synth = new Tone.MembraneSynth();
var synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

var actx = Tone.context;
let ind = 0;
let totalTime = 8;
var prevTime;
var chunks = [];
var notes = ['A4', 'E2', 'E4', 'A#2', 'F#2', 'C4', 'D4', 'E#2'];
var audio = document.querySelector("audio");

Tone.Transport.scheduleRepeat(repeat, '8n');

let step_note;

function repeat()
{
    let step = ind % totalTime;
    var currentTime = ".time"+step;
    if(prevTime !== undefined)
        $(prevTime).removeClass("playing");
    $(currentTime).addClass("playing");
    if ($(currentTime).hasClass("selected"))
    {
        //  WHY NOT WORKING???
        //step_note = $(".selected").index(currentTime);
        temp = [];
        var all_notes = $(`${currentTime}.selected`);
        for(var i=0; i<all_notes.length; i++)
        {
          temp.push(notes[parseInt((all_notes[i].className)[4])]);
        }
        console.log(temp);
        synth.triggerAttackRelease(temp, '8n');

        //step_note = parseInt($(`${currentTime}.selected`).attr("class")[4])
        //synth.triggerAttackRelease(notes[step_note], '1');
    }
    prevTime = ".time"+ step;
    ind++;
}

var dest = actx.createMediaStreamDestination();
var recorder = new MediaRecorder(dest.stream);

recorder.ondataavailable = evt => chunks.push(evt.data);
recorder.onstop = evt => {
  let blob = new Blob(chunks, {type: 'audio/ogg; codecs=opus'});
  audio.src = URL.createObjectURL(blob);
};

synth.connect(dest);
synth.toMaster();



$("#begin").click(function(){
    Tone.Transport.start();
});

function start_record()
{
  audio.src = '';
  recorder.start();
}

function stop_record()
{
  recorder.stop();
}

function sing_along()
{
  var inp = new Tone.UserMedia();

  navigator.mediaDevices.getUserMedia ({audio: true})
    .then(function(stream) {
        var source = actx.createMediaStreamSource(stream);
        source.connect(dest);
        }
    )
    .catch(function(err) {
        console.log('Error: ' + err);
    });
}

$("#start_record").click(start_record);
$("#stop_record").click(stop_record);
$("#mic").click(sing_along);