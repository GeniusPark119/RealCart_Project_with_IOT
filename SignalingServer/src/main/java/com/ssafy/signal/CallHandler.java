package com.ssafy.signal;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.kurento.client.EventListener;
import org.kurento.client.IceCandidate;
import org.kurento.client.IceCandidateFoundEvent;
import org.kurento.client.KurentoClient;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.jsonrpc.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.ssafy.signal.dto.UserSession;
import com.ssafy.signal.mattermost.NotificationManager;
@Component
public class CallHandler extends TextWebSocketHandler {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CallHandler.class);
	private static final Gson gson = new GsonBuilder().create();
	
	private final ConcurrentHashMap<String, UserSession> presenters = new ConcurrentHashMap<String, UserSession>();
	private final String[] sessions = new String[5];
	private final ConcurrentHashMap<Integer, ConcurrentHashMap<String, UserSession>> viewers = new ConcurrentHashMap<Integer, ConcurrentHashMap<String, UserSession>>();
	
	@Autowired
	private KurentoClient kurento;
	
	@Autowired
	private NotificationManager notificationManager;
	
	
	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			JsonObject jsonMessage = gson.fromJson(message.getPayload(), JsonObject.class);
			LOGGER.debug("Incoming message from session '{}' : {}", session.getId(), jsonMessage);
			switch (jsonMessage.get("id").getAsString()) {
			case "presenter":
				try {
					presenter(session, jsonMessage);
				} catch (Throwable t) {
					handleErrorResponse(t, session, "presenterResponse");
				}
				break;
			case "viewer":
				try {
					viewer(session, jsonMessage);
				} catch (Throwable t) {
					handleErrorResponse(t, session, "viewerResponse");
				}
				break;
			case "onIceCandidate": {
				JsonObject candidate = jsonMessage.get("candidate").getAsJsonObject();
				int mediaId = jsonMessage.get("mediaId").getAsInt(); 
				UserSession user = null;
				if(sessions[mediaId] != null && presenters.get(sessions[mediaId])!= null) {
					if(presenters.get(sessions[mediaId]) == session) {
						user = presenters.get(sessions[mediaId]);
					} else {
						user = viewers.get(mediaId).get(session.getId());
					}
				}
				if(user != null) {
					IceCandidate cand = new IceCandidate(candidate.get("candidate").getAsString(),
							candidate.get("sdpMid").getAsString(), candidate.get("sdpMLineIndex").getAsInt());
					user.addCandidate(cand);
				}
				break;
			}
			case "stop":
				stop(session);
				break;
			default:
				break;
			}
		}catch(Exception e) {
			notificationManager.sendNotification(e, session.getUri().toString(), "Internal Server Error");
			handleErrorResponse(e, session, "Internal Server Error");
		}
	}

	public void stop(WebSocketSession session) throws IOException {
		try {
			String sessionId = session.getId();
			if(presenters.containsKey(sessionId)) {
				int mediaId = -1;
				for (int i = 0; i < sessions.length; i++) {
					if(sessions[i] != null && sessions[i].equals(sessionId)) mediaId = i;
				}
				if(mediaId == -1) {
					LOGGER.debug("Can not find stopped session");
					return;
				}
				for (UserSession viewer : viewers.get(mediaId).values()) {
					JsonObject response = new JsonObject();
					response.addProperty("id", "stopCommunication");
					if(viewer.getSession().isOpen()) {
						viewer.sendMessage(response);
					}
				}
				LOGGER.info("Releasing media pipeline");
				if(presenters.get(sessionId).getWebRtcEndpoint().getMediaPipeline() != null) {
					presenters.get(sessionId).getWebRtcEndpoint().getMediaPipeline().release();
				}
				presenters.remove(sessionId);
			}
		}catch(Exception e) {
			notificationManager.sendNotification(e, session.getUri().toString(), "Stop");
		}
	}

	public void viewer(WebSocketSession session, JsonObject jsonMessage) throws IOException {
		try {
			int mediaId = jsonMessage.get("mediaId").getAsInt(); 
			if (presenters.isEmpty() || sessions[mediaId] == null || presenters.get(sessions[mediaId]) == null) {
				JsonObject response = new JsonObject();
				response.addProperty("id", "viewerResponse");
				response.addProperty("response", "rejected");
				response.addProperty("message", "No active sender now.");
				session.sendMessage(new TextMessage(response.toString()));
			} else {
				UserSession viewer = new UserSession(session);
				viewers.get(mediaId).put(session.getId(), viewer);
				
				String sdpOffer = jsonMessage.getAsJsonPrimitive("sdpOffer").getAsString();
				UserSession presenterUserSession = presenters.get(sessions[mediaId]);
				MediaPipeline pipeline = presenterUserSession.getWebRtcEndpoint().getMediaPipeline();
				WebRtcEndpoint nextWebRtc = new WebRtcEndpoint.Builder(pipeline).build();
				
				nextWebRtc.addIceCandidateFoundListener(new EventListener<IceCandidateFoundEvent>() {
					
					@Override
					public void onEvent(IceCandidateFoundEvent event) {
						JsonObject response = new JsonObject();
						response.addProperty("id", "iceCandidate");
						response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
						try {
							synchronized (session) {
								session.sendMessage(new TextMessage(response.toString()));
							}
						} catch (IOException e) {
							LOGGER.debug(e.getMessage());
						}
					}
				});
				
				viewer.setWebRtcEndpoint(nextWebRtc);
				presenterUserSession.getWebRtcEndpoint().connect(nextWebRtc);
				String sdpAnswer = nextWebRtc.processOffer(sdpOffer);
				
				JsonObject response = new JsonObject();
				response.addProperty("id", "viewerResponse");
				response.addProperty("response", "accepted");
				response.addProperty("sdpAnswer", sdpAnswer);
				
				synchronized (session) {
					viewer.sendMessage(response);
				}
				nextWebRtc.gatherCandidates();
			}
		}catch(Exception e) {
			notificationManager.sendNotification(e, session.getUri().toString(), "Internal Server Error");
			handleErrorResponse(e, session, "Internal Server Error");
		}
		
	}

	public void presenter(WebSocketSession session, JsonObject jsonMessage) throws IOException{
		try {
			String sessionId = session.getId();
			int mediaId = jsonMessage.get("mediaId").getAsInt();
			if(!presenters.containsKey(sessionId)) {
				UserSession presenterUserSession = new UserSession(session);
				MediaPipeline pipeline = kurento.createMediaPipeline();
				presenterUserSession.setWebRtcEndpoint(new WebRtcEndpoint.Builder(pipeline).build());
				WebRtcEndpoint presenterWebRtc = presenterUserSession.getWebRtcEndpoint();
				presenterWebRtc.addIceCandidateFoundListener(new EventListener<IceCandidateFoundEvent>() {
					
					@Override
					public void onEvent(IceCandidateFoundEvent event) {
						JsonObject response = new JsonObject();
						response.addProperty("id", "iceCandidate");
						response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
						try {
							synchronized(session) {
								session.sendMessage(new TextMessage(response.toString()));
							}
						} catch (IOException e) {
							LOGGER.debug(e.getMessage());
						}
					}
					
				});
				
				String sdpOffer = jsonMessage.getAsJsonPrimitive("sdpOffer").getAsString();
				String sdpAnswer = presenterWebRtc.processOffer(sdpOffer);
				
				JsonObject response = new JsonObject();
				response.addProperty("id", "presenterResponse");
				response.addProperty("response", "accepted");
				response.addProperty("sdpAnswer", sdpAnswer);
				
				synchronized (session) {
					presenterUserSession.sendMessage(response);
				}
				presenterWebRtc.gatherCandidates();
				presenters.put(sessionId, presenterUserSession);
				sessions[mediaId] = sessionId;
				ConcurrentHashMap<String, UserSession> newViewers = new ConcurrentHashMap<String, UserSession>();
				if(viewers.getOrDefault(mediaId, null) == null) {
					viewers.put(mediaId, new ConcurrentHashMap<String, UserSession>());
				}
				else {
					for (UserSession viewer : viewers.get(mediaId).values()) {
						response = new JsonObject();
						response.addProperty("id", "startCommunication"+mediaId);
						if(viewer.getSession().isOpen()) {
							WebRtcEndpoint nextWebRtc = new WebRtcEndpoint.Builder(pipeline).build();
							viewer.setWebRtcEndpoint(nextWebRtc);
							presenterWebRtc.connect(nextWebRtc);
							viewer.sendMessage(response);
							newViewers.put(viewer.getSession().getId(), viewer);
						}
					}
					viewers.put(mediaId, newViewers);
				}
				
			} else {
				JsonObject response = new JsonObject();
				response.addProperty("id", "presenterResponse");
				response.addProperty("response", "rejected");
				response.addProperty("message", "Another user is currently acting as sender. Try again later ...");
				session.sendMessage(new TextMessage(response.toString()));
				
			}
		}catch(Exception e) {
			notificationManager.sendNotification(e, session.getUri().toString(), "Internal Server Error");
			handleErrorResponse(e, session, "Internal Server Error");
		}
	}

	public void handleErrorResponse(Throwable t, WebSocketSession session, String responseId) throws IOException{
		try {
			stop(session);
			LOGGER.error(t.getMessage(), t);
			JsonObject response = new JsonObject();
			response.addProperty("id", responseId);
			response.addProperty("response", "rejected");
			response.addProperty("message", t.getMessage());
			session.sendMessage(new TextMessage(response.toString()));
		}catch(Exception e) {
			notificationManager.sendNotification(e, session.getUri().toString(), "Internal Server Error");
		}
		
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		try{
			stop(session);
		}catch(Exception e) {
			notificationManager.sendNotification(e, session.getUri().toString(), "Internal Server Error");
		}
	}
	
}
