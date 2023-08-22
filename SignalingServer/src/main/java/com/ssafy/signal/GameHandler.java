package com.ssafy.signal;

import java.io.IOException;

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
import com.ssafy.signal.dto.FlagClass;
import com.ssafy.signal.dto.RcCarStatusDto;
import com.ssafy.signal.mattermost.NotificationManager;

@Component
public class GameHandler extends TextWebSocketHandler{

	private static final Gson gson = new GsonBuilder().create();
	private static final Logger LOGGER = LoggerFactory.getLogger(GameHandler.class);
	private final WebSocketSession[] sessions = new WebSocketSession[2];
	private final FlagClass flag = FlagClass.getInstance();
	private CarServer carServer1;
	private CarServer carServer2;
	
	@Autowired
	private NotificationManager notificationManager;
	
	public GameHandler() throws IOException {
		carServer1 = new CarServer(this, 8041);
		carServer2 = new CarServer(this, 8042);
		carServer1.start();
		carServer2.start();
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		JsonObject jsonMessage = gson.fromJson(message.getPayload(), JsonObject.class);
		switch (jsonMessage.get("id").getAsString()) {
		case "intro":
			if("player1".equals(jsonMessage.get("player").getAsString())){
				flag.setPlayer1Nickname(jsonMessage.get("nickname").getAsString());
				flag.setPlayer1Status(1);
				sessions[0] = session;
				LOGGER.info(flag.getPlayer1Nickname());
				if(sessions[1] != null) gamestart();
			}
			else if("player2".equals(jsonMessage.get("player").getAsString())){
				flag.setPlayer2Nickname(jsonMessage.get("nickname").getAsString());
				flag.setPlayer2Status(2);
				sessions[1] = session;
				LOGGER.info(flag.getPlayer2Nickname());
				if(sessions[0] != null) gamestart();
			}
			break;
		case "key":
			if(session.equals(sessions[0])) {
				carServer1.send(jsonMessage.get("value").getAsInt());
				LOGGER.info(""+jsonMessage.get("value").getAsInt());
			}
			else if(session.equals(sessions[1])) {
				carServer2.send(jsonMessage.get("value").getAsInt());
				LOGGER.info(""+jsonMessage.get("value").getAsInt());
			}
		}
	}

	public void gamestart() {
		if(flag.getCar1Status() != 1 || flag.getCar2Status() != 1 || flag.getPlayer1Status() != 1 || flag.getPlayer2Status() != 1) {
			return;
		}
		for (WebSocketSession webSocketSession : sessions) {
			try {
				webSocketSession.sendMessage(new TextMessage("1"));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
        try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        carServer1.send(49);
        carServer2.send(49);
        flag.setStartTime(System.currentTimeMillis());
        flag.setPlayer1Status(2);
        flag.setPlayer2Status(2);
        flag.setGameStatus(1);
        LOGGER.debug("Game Start >>> " + flag);
		
	}
	
	public void gamefinish(int i) {
		if(sessions[i] != null) {
			try {
				sessions[i].sendMessage(new TextMessage("2"));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			LOGGER.debug("Game Finsish >>> " + i);
			sessions[i] = null;
		}
		
	}

	public void dataSend(int i, RcCarStatusDto rcCarStatus) {
		if(sessions[i] != null) {
			try {
				sessions[i].sendMessage(new TextMessage(rcCarStatus.toString()));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		stop(session);
	}

	private void stop(WebSocketSession session) {
		int index = -1;
		for (int i = 0; i < sessions.length; i++) {
			if(sessions[i] == session) {
				index = i;
				sessions[i] = null;
			}
		}
		if(sessions[0] == null && sessions[1] == null) {
			if("".equals(flag.getPlayer1Nickname()) || "".equals(flag.getPlayer2Nickname())){
				flag.initiateAll();
				flag.sendNewGameToBackend();
			}
			else{
				if(index == 0){
					flag.setRequestBody(flag.getRequestBody() + "," + flag.getPlayer1Nickname() + "," + -1);
				}
				else if(index == 1){
					flag.setRequestBody(flag.getRequestBody() + "," + flag.getPlayer2Nickname() + "," + -1);
				}
				flag.sendResultToBackend(flag.getRequestBody());
			}
		}
		else {
			if(sessions[0] == null) {
				flag.setPlayer1Laptime(-1L);
				flag.setPlayer1Status(0);
			}
			else if(sessions[1] == null) {
				flag.setPlayer2Laptime(-1L);
				flag.setPlayer2Status(0);
			}
		}
	}
}


