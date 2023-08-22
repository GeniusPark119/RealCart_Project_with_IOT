/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import kurentoUtils from "kurento-utils";
import TransparentImg from "../../assets/img/transparent-1px.png";
import WebRtcImg from "../../assets/img/webrtc.png";
import Spinner from "../../assets/img/spinner.gif";
import Advertise from "../../assets/img/advertise.png";

function Viewer2() {
  const [ws, setWs] = useState(null);
  const video = useRef(null);
  const [webRtcPeer, setWebRtcPeer] = useState(null);

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
    // console.info("Invoking SDP offer callback function " + 2);
    var message = {
      id: "presenter",
      sdpOffer: offerSdp,
      mediaId: 2,
    };
    sendMessage(message);
  }

  function viewer(num) {
    if (!webRtcPeer) {
      showSpinner(video.current);
    }
    console.log(2);
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
    // console.info("Invoking SDP offer callback function " + 2);
    var message = {
      id: "viewer",
      sdpOffer: offerSdp,
      mediaId: 2,
    };
    sendMessage(message);
  }

  function onIceCandidate(candidate) {
    // console.log("Local candidate" + JSON.stringify(candidate));

    var message = {
      id: "onIceCandidate",
      candidate: candidate,
      mediaId: 2,
    };
    sendMessage(message);
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
    // console.log("Sending message: " + jsonMessage);
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

    setWs(wsConst);

    return () => {
      wsConst.close();
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
            if (webRtcPeer) {
              webRtcPeer.addIceCandidate(
                parsedMessage.candidate,
                function (error) {
                  if (error)
                    return console.error("Error adding candidate: " + error);
                }
              );
            } else {
              // console.log("webRtcPeer object is not initialized.");
            }
            break;
          case "stopCommunication":
            dispose();
            break;
          case "startCommunication2":
            viewer(2);
            break;
          default:
            console.error("Unrecognized message", parsedMessage);
        }
      };

      ws.onopen = () => {
        setTimeout(() => {
          viewer(2);
        }, 1000);
      };
    }
  }, [ws, webRtcPeer]);

  return (
    <div className="App">
      <div>
        <div className="row">
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-12">
                <button
                  onClick={() => {
                    viewer(2);
                  }}
                  id="viewer"
                  href="#"
                  className="btn btn-primary"
                  style={{ color: "white", backgroundColor: "black" }}
                >
                  <span className="glyphicon glyphicon-user"></span> reload
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
                muted
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewer2;
