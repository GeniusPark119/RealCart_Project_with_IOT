package com.ssafy.signal.dto;

import java.io.IOException;

import org.kurento.client.IceCandidate;
import org.kurento.client.WebRtcEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.google.gson.JsonObject;

public class UserSession {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UserSession.class);
	
	private WebSocketSession session;
	private WebRtcEndpoint webRtcEndpoint;
	
	public UserSession(WebSocketSession session) {
		this.session = session;
	}
	
	public void sendMessage(JsonObject message) throws IOException {
		LOGGER.debug("Sending message from user with session Id '{}': {}", session.getId(), message);
		session.sendMessage(new TextMessage(message.toString()));
	}
	
	
	
	public WebSocketSession getSession() {
		return session;
	}

	public void setSession(WebSocketSession session) {
		this.session = session;
	}

	public WebRtcEndpoint getWebRtcEndpoint() {
		return webRtcEndpoint;
	}

	public void setWebRtcEndpoint(WebRtcEndpoint webRtcEndpoint) {
		this.webRtcEndpoint = webRtcEndpoint;
	}
	
	public void addCandidate(IceCandidate candidate) {
		webRtcEndpoint.addIceCandidate(candidate);
	}
}
