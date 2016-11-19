var session = {
    audio: true,
    video: false
};
var recordRTC = null;
navigator.getUserMedia(session, initializeRecorder, onError);

