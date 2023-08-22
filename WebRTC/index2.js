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

var ws = new WebSocket("wss://i8a403.p.ssafy.io:8070/call");
var socket = new WebSocket("wss://i8a403.p.ssafy.io:8070/chat");
var video;
var text;
var webRtcPeer;
var mediaId;
window.onload = function () {
  video = document.getElementById("video");
  text = document.getElementById("text");
  video.autoplay = true;
  video.muted = true;
  connect();
  setTimeout(() => {
    presenter(2);
  }, 2000);
};

window.onbeforeunload = function () {
  ws.close();
  socket.close();
};
ws.onopen = function () {
  setTimeout(() => {
    viewer(1);
  }, 2000);
};
// socket.onmessage = function(message){
// 	console.log(message);
// }
ws.onmessage = function (message) {
  var parsedMessage = JSON.parse(message.data);
  console.info("Received message: " + message.data);

  switch (parsedMessage.id) {
    case "presenterResponse":
      presenterResponse(parsedMessage);
      break;
    case "viewerResponse":
      viewerResponse(parsedMessage);
      break;
    case "iceCandidate":
      webRtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
        if (error) return console.error("Error adding candidate: " + error);
      });
      break;
    case "stopCommunication":
      dispose();
      break;
    default:
      console.error("Unrecognized message", parsedMessage);
  }
};

function presenterResponse(message) {
  if (message.response != "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.info("Call not accepted for the following reason: " + errorMsg);
    dispose();
  } else {
    webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
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
function viewerResponse(message) {
  if (message.response != "accepted") {
    var errorMsg = message.message ? message.message : "Unknow error";
    console.info("Call not accepted for the following reason: " + errorMsg);
    dispose();
  } else {
    webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
      if (error) return console.error(error);
    });
  }
}

function presenter(num) {
  if (!webRtcPeer) {
    showSpinner(video);
  }
  var options = {
    localVideo: video,
    onicecandidate: onIceCandidate,
  };
  mediaId = num;
  webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }
      webRtcPeer.generateOffer(onOfferPresenter);
    }
  );
}

function onOfferPresenter(error, offerSdp) {
  if (error) return console.error("Error generating the offer");
  console.info("Invoking SDP offer callback function " + mediaId);
  var message = {
    id: "presenter",
    sdpOffer: offerSdp,
    mediaId: mediaId,
  };
  sendMessage(message);
}

function viewer(num) {
  if (!webRtcPeer) {
    showSpinner(video);
  }
  mediaId = num;
  console.log(num);
  var options = {
    remoteVideo: video,
    onicecandidate: onIceCandidate,
  };
  webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
    options,
    function (error) {
      if (error) {
        return console.error(error);
      }
      this.generateOffer(onOfferViewer);
    }
  );
}

function onOfferViewer(error, offerSdp) {
  if (error) return console.error("Error generating the offer");
  console.info("Invoking SDP offer callback function " + mediaId);
  var message = {
    id: "viewer",
    sdpOffer: offerSdp,
    mediaId: mediaId,
  };
  sendMessage(message);
}

function onIceCandidate(candidate) {
  console.log("Local candidate" + JSON.stringify(candidate));

  var message = {
    id: "onIceCandidate",
    candidate: candidate,
    mediaId: mediaId,
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

function dispose() {
  if (webRtcPeer) {
    webRtcPeer.dispose();
    webRtcPeer = null;
  }
  hideSpinner(video);
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
