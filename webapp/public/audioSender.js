var session = {
    audio: true,
    video: false
};
var recordRTC = null;

navigator.getUserMedia = ( navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia);

navigator.getUserMedia(session, initializeRecorder, function(err){ console.log(err); });

function initializeRecorder(stream) {
    var audioContext = window.AudioContext;
    var context = new audioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;
    // create a javascript node
    //var recorder = context.createJavaScriptNode(bufferSize, 1, 1);
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);

    // specify the processing function
    recorder.onaudioprocess = recorderProcess;
    // connect stream to our recorder
    audioInput.connect(recorder);
    // connect our recorder to the previous destination
    recorder.connect(context.destination);
}

var i=0,
    time = performance.now();

function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
}

var socket = io('http://localhost:8000');


//var time = performance.now();

function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    var dataToSend = convertFloat32ToInt16(left);

   // console.log(performance.now()-time);
   // time = performance.now();


    socket.emit('audioData', {
        audioBuffer: dataToSend
    });
}

