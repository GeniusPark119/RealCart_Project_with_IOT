/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var ws = new WebSocket('ws://13.125.13.39:8100/call');
var socket = new WebSocket('ws://13.125.13.39:8100/chat');
var game = new WebSocket('ws://13.125.13.39:8010/gamenet')
var video1;
var video2;
var text;
var webRtcPeer1;
var webRtcPeer2;
var mediaId;
window.onload = function() {
	
	video1 = document.getElementById('video1');
  video2 = document.getElementById('video2');
	text = document.getElementById('text');
	// video.autoplay = true;
	video1.muted = true;
  video2.muted = true;
	connect();
}
// window.onkeydown = (e) => sendChat();
window.onbeforeunload = function() {
	ws.close();
	socket.close();
}
ws.onopen = function(){
	setTimeout(() => {
    viewer1();
  }, 1000);
  setTimeout(() => {
    viewer2();
  }, 2000);
  // viewer(2);
	  
}
socket.onmessage = function(message){
	console.log(message);
}
ws.onmessage = function (message) {
  var parsedMessage = JSON.parse(message.data);
  console.info("Received message: " + message.data);

  switch (parsedMessage.id) {
    case "presenterResponse1":
      presenterResponse1(parsedMessage);
      break;
    case "viewerResponse1":
      viewerResponse1(parsedMessage);
      break;
    case "iceCandidate1":
      webRtcPeer1.addIceCandidate(parsedMessage.candidate, function (error) {
        if (error) return console.error("Error adding candidate: " + error);
      });
      break;
    case "stopCommunication1":
      dispose1();
      break;
    case "presenterResponse2":
      presenterResponse2(parsedMessage);
      break;
    case "viewerResponse2":
      viewerResponse2(parsedMessage);
      break;
    case "iceCandidate2":
      webRtcPeer2.addIceCandidate(parsedMessage.candidate, function (error) {
        if (error) return console.error("Error adding candidate: " + error);
      });
      break;
    case "stopCommunication2":
      dispose2();
      break;
    default:
      console.error("Unrecognized message", parsedMessage);
  }
};
function gameintro(){
  game.send(
    JSON.stringify({
      id: "intro",
      player: "player2",
      nickname: "sojung",
      receiverId: 14,
    })
  )
}
function gamekey(){
  game.send(
    JSON.stringify({
      id: "key",
      nickname: "sojung",
      value: 39,
    })
  )
}
function presenterResponse1(message) {
  if (message.response != "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.info("Call not accepted for the following reason: " + errorMsg);
    dispose1();
  } else {
    webRtcPeer1.processAnswer(message.sdpAnswer, function (error) {
      if (error) return console.error(error);
    });
  }
}

function presenterResponse2(message) {
  if (message.response != "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.info("Call not accepted for the following reason: " + errorMsg);
    dispose2();
  } else {
    webRtcPeer2.processAnswer(message.sdpAnswer, function (error) {
      if (error) return console.error(error);
    });
  }
}

function connect() {
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function () {
    stompClient.subscribe("/subscribe", function (greeting) {
      console.log(greeting.body);
    });
  });
}

function sendChat() {
  stompClient.send(
    "/publish/messages",
    {},
    JSON.stringify({
      message: text.value,
      senderId: 7,
      receiverId: 14,
    })
  );
}
function viewerResponse1(message) {
  if (message.response != "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.info("Call not accepted for the following reason: " + errorMsg);
    dispose1();
  } else {
    webRtcPeer1.processAnswer(message.sdpAnswer, function (error) {
      if (error) return console.error(error);
    });
  }
}
function viewerResponse2(message) {
  if (message.response != "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.info("Call not accepted for the following reason: " + errorMsg);
    dispose2();
  } else {
    webRtcPeer2.processAnswer(message.sdpAnswer, function (error) {
      if (error) return console.error(error);
    });
  }
}

function presenter1() {
  if (!webRtcPeer1) {
    showSpinner(video1);
  }
  var options = {
    localVideo: video1,
    onicecandidate: onIceCandidate1,
  };
  webRtcPeer1 = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }
      webRtcPeer1.generateOffer(onOfferPresenter1);
    }
  );
}

function presenter2() {
  if (!webRtcPeer2) {
    showSpinner(video1);
  }
  var options = {
    localVideo: video1,
    onicecandidate: onIceCandidate2,
  };
  webRtcPeer2 = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }
      webRtcPeer2.generateOffer(onOfferPresenter2);
    }
  );
}

function onOfferPresenter1(error, offerSdp) {
  if (error) return console.error("Error generating the offer");
  console.info("Invoking SDP offer callback function " + mediaId);
  var message = {
    id: "presenter",
    sdpOffer: offerSdp,
    mediaId: 1,
  };
  sendMessage(message);
}
function onOfferPresenter2(error, offerSdp) {
  if (error) return console.error("Error generating the offer");
  console.info("Invoking SDP offer callback function " + mediaId);
  var message = {
    id: "presenter",
    sdpOffer: offerSdp,
    mediaId: 2,
  };
  sendMessage(message);
}

function viewer1() {
  if (!webRtcPeer1) {
    showSpinner(video1);
  }
  var options = {
    remoteVideo: video1,
    onicecandidate: onIceCandidate1,
  };

  webRtcPeer1 = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }
      this.generateOffer(onOfferViewer1);
    }
  );
}

function viewer2() {
  if (!webRtcPeer2) {
    showSpinner(video2);
  }
  var options = {
    remoteVideo: video2,
    onicecandidate: onIceCandidate2,
  };

  webRtcPeer2 = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }
      this.generateOffer(onOfferViewer2);
    }
  );
}

function onOfferViewer1(error, offerSdp) {
  if (error) return console.error("Error generating the offer");
  console.info("Invoking SDP offer callback function " + 1);
  var message = {
    id: "viewer",
    sdpOffer: offerSdp,
    mediaId: 1,
  };
  sendMessage(message);
}

function onOfferViewer2(error, offerSdp) {
  if (error) return console.error("Error generating the offer");
  console.info("Invoking SDP offer callback function " + 2);
  var message = {
    id: "viewer",
    sdpOffer: offerSdp,
    mediaId: 2,
  };
  sendMessage(message);
}

function onIceCandidate1(candidate) {
  console.log("Local candidate" + JSON.stringify(candidate));

  var message = {
    id: "onIceCandidate",
    candidate: candidate,
    mediaId: 1,
  };
  sendMessage(message);
}

function onIceCandidate2(candidate) {
  console.log("Local candidate" + JSON.stringify(candidate));

  var message = {
    id: "onIceCandidate",
    candidate: candidate,
    mediaId: 2,
  };
  sendMessage(message);
}

function stop() {
  var message = {
    id: "stop",
  };
  sendMessage(message);
  dispose();
}

function dispose1() {
  if (webRtcPeer1) {
    webRtcPeer1.dispose();
    webRtcPeer1 = null;
  }
  hideSpinner(video1);
}

function dispose2() {
  if (webRtcPeer2) {
    webRtcPeer2.dispose();
    webRtcPeer2 = null;
  }
  hideSpinner(video1);
}

function sendMessage(message) {
  var jsonMessage = JSON.stringify(message);
  console.log("Sending message: " + jsonMessage);
  ws.send(jsonMessage);
}

function showSpinner() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].poster = "./img/transparent-1px.png";
    arguments[i].style.background =
      'center transparent url("./img/spinner.gif") no-repeat';
  }
}

function hideSpinner() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].src = "";
    arguments[i].poster = "./img/webrtc.png";
    arguments[i].style.background = "";
  }
}