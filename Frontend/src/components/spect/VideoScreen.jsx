/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import kurentoUtils from "kurento-utils";
import Stomp from "stompjs";
import TransparentImg from "../../assets/img/transparent-1px.png";
import WebRtcImg from "../../assets/img/webrtc.png";
import Spinner from "../../assets/img/spinner.gif";
import Advertise from "../../assets/img/advertise.png";

function VideoScreen() {
  const [ws, setWs] = useState(null);
  const [socket, setSocket] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const video = useRef(null);
  const text = useRef(null);
  const [webRtcPeer, setWebRtcPeer] = useState(null);
  const [mediaId, setMediaId] = useState(null);

  function presenterResponse(message) {
    if (message.response != "accepted") {
      var errorMsg = message.message ? message.message : "Unknow error";
      // console.info("Call not accepted for the following reason: " + errorMsg);
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
        message: text.current.value,
        senderId: 7,
        receiverId: 14,
      })
    );
  }

  function viewerResponse(message) {
    if (message.response != "accepted") {
      var errorMsg = message.message ? message.message : "Unknow error";
      // console.info("Call not accepted for the following reason: " + errorMsg);
      dispose();
    } else {
      webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
        if (error) return console.error(error);
      });
    }
  }

  function presenter(num) {
    if (!webRtcPeer) {
      showSpinner(video.current);
    }
    var options = {
      localVideo: video.current,
      onicecandidate: onIceCandidate,
    };
    setMediaId(num);
    const wrp = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
      options,
      function (error) {
        if (error) {
          return console.error(error);
        }
        wrp.generateOffer(onOfferPresenter);
      }
    );
    setWebRtcPeer(wrp);
  }

  function onOfferPresenter(error, offerSdp) {
    if (error) return console.error("Error generating the offer");
    // console.info("Invoking SDP offer callback function " + mediaId);
    var message = {
      id: "presenter",
      sdpOffer: offerSdp,
      mediaId: mediaId,
    };
    sendMessage(message);
  }

  function viewer(num) {
    if (!webRtcPeer) {
      showSpinner(video.current);
    }
    setMediaId(num);
    console.log(num);
    var options = {
      remoteVideo: video.current,
      onicecandidate: onIceCandidate,
    };
    const wrp = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      function (error) {
        if (error) {
          return console.error(error);
        }
        this.generateOffer(onOfferViewer);
      }
    );
    setWebRtcPeer(wrp);
  }

  function onOfferViewer(error, offerSdp) {
    if (error) return console.error("Error generating the offer");
    // console.info("Invoking SDP offer callback function " + mediaId);
    var message = {
      id: "viewer",
      sdpOffer: offerSdp,
      mediaId: mediaId,
    };
    sendMessage(message);
  }

  function onIceCandidate(candidate) {
    // console.log("Local candidate" + JSON.stringify(candidate));

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
      setWebRtcPeer(null);
    }
    hideSpinner(video.current);
  }

  function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log("Sending message: " + jsonMessage);
    ws.send(jsonMessage);
  }

  function showSpinner() {
    for (var i = 0; i < arguments.length; i++) {
      arguments[i].poster = TransparentImg;
      arguments[
        i
      ].style.background = `center transparent url(${Spinner}) no-repeat`;
    }
  }

  function hideSpinner() {
    for (var i = 0; i < arguments.length; i++) {
      arguments[i].src = "";
      arguments[i].poster = Advertise;
      arguments[i].style.background = "";
    }
  }

  useEffect(() => {
    const wsConst = new WebSocket(`${process.env.REACT_APP_MEDIA_URL}/call`);
    const socketConst = new WebSocket(
      `${process.env.REACT_APP_MEDIA_URL}/chat`
    );
    const stompClientConst = Stomp.over(socketConst);
    stompClientConst.connect({}, function () {
      stompClientConst.subscribe("/subscribe", function (greeting) {
        console.log(greeting.body);
      });
    });

    setWs(wsConst);
    setSocket(socketConst);
    setStompClient(stompClientConst);

    return () => {
      wsConst.close();
      socketConst.close();
    };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = function (message) {
        var parsedMessage = JSON.parse(message.data);
        // console.info("Received message: " + message.data);

        switch (parsedMessage.id) {
          case "presenterResponse":
            presenterResponse(parsedMessage);
            break;
          case "viewerResponse":
            viewerResponse(parsedMessage);
            break;
          case "iceCandidate":
            webRtcPeer.addIceCandidate(
              parsedMessage.candidate,
              function (error) {
                if (error)
                  return console.error("Error adding candidate: " + error);
              }
            );
            break;
          case "stopCommunication":
            dispose();
            break;
          default:
            console.error("Unrecognized message", parsedMessage);
        }
      };

      ws.onopen = () => {
        setTimeout(() => {
          viewer(1);
        }, 1000);
      };
    }
  }, [ws]);

  return (
    <div className="App">
      <header>
        <div className="navbar navbar-inverse navbar-fixed-top"></div>
        <textarea id="text" ref={text}></textarea>
        <button onClick={sendChat}>sendMessage</button>
      </header>
      <div>
        <div className="row">
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-12">
                <button
                  onClick={() => {
                    presenter(1);
                  }}
                  id="presenter1"
                  href="#"
                  className="btn btn-success"
                >
                  <span className="glyphicon glyphicon-play"></span> Presenter1{" "}
                </button>
                <button
                  onClick={() => {
                    presenter(2);
                  }}
                  id="presenter2"
                  href="#"
                  className="btn btn-success"
                >
                  <span className="glyphicon glyphicon-play"></span> Presenter2{" "}
                </button>
                <button
                  onClick={() => {
                    presenter(3);
                  }}
                  id="presenter3"
                  href="#"
                  className="btn btn-success"
                >
                  <span className="glyphicon glyphicon-play"></span> Presenter3{" "}
                </button>
                <button
                  onClick={() => {
                    viewer(1);
                  }}
                  id="viewer"
                  href="#"
                  className="btn btn-primary"
                >
                  <span className="glyphicon glyphicon-user"></span> Viewer1
                </button>
                <button
                  onClick={() => {
                    viewer(2);
                  }}
                  id="viewer"
                  href="#"
                  className="btn btn-primary"
                >
                  <span className="glyphicon glyphicon-user"></span> Viewer2
                </button>
                <button
                  onClick={() => {
                    viewer(3);
                  }}
                  id="viewer"
                  href="#"
                  className="btn btn-primary"
                >
                  <span className="glyphicon glyphicon-user"></span> Viewer3
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div id="videoBig">
              <video
                ref={video}
                id="video"
                autoPlay
                width="640px"
                height="480px"
                poster={WebRtcImg}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoScreen;
