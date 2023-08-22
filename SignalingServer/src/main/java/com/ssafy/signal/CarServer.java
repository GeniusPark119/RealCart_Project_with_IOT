package com.ssafy.signal;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ssafy.signal.dto.FlagClass;
import com.ssafy.signal.dto.RcCarStatusDto;

public class CarServer extends Thread{
	private static final Gson gson = new GsonBuilder().create();
	ServerSocket serverSocket;
	Socket socket;
	private int port = 5420;
	private PrintWriter out;
	private BufferedReader br;
	private GameHandler gameHandler;
	private final FlagClass flag = FlagClass.getInstance();
	
	public CarServer(GameHandler gameHandler, int port) {
		this.gameHandler = gameHandler;
		this.port = port;
		System.out.println("Init Server");
	}
	
	public void send(int i) {
		if(out != null) {
			out.write(i);
			out.flush();
		}
	}
	public void run() {
		try {
			serverSocket = new ServerSocket(port);
			serverSocket.setReuseAddress(true);
			while(true) {
				socket = serverSocket.accept();
				out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8")), true);
				br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
				while(true) {
	                int dataLen = 100;
	                String jsonData = "";
	                for (int i = 0; i < dataLen; i++) {
	                    jsonData += (char) br.read();
	                }
	                RcCarStatusDto rcCarStatus = gson.fromJson(jsonData.trim(), RcCarStatusDto.class);
	                System.out.println(rcCarStatus);
	                // 0: NULL, 1: Ready, 2: Finish, 3: Running
	                switch (rcCarStatus.getStatus()) {
	                    /*
	                    1일 때...(Ready)
	                    1. 만일 모두 준비가 완료되었다면 flag.gamestatus를 1로 만든다.
	                    2. Frontend 서버에 5초 뒤 게임을 시작한다는 신호(1)를 wss를 통해 보낸다.
	                    3. Thread.sleep(5000)으로 5초 쉬고 RC카에 start 신호를 보낸다.
	                    4. 스타트 타임을 flag에 기록하고 gameStatus를 1으로 바꾼다.
	                     */
	                    case 1:
	                        if(rcCarStatus.getCarNum() == 1){
	                            flag.setCar1Status(1);
	                            if(flag.getCar2Status() == 1){
	                                flag.sendNewGameToBackend();
	                            }
	                        }else if(rcCarStatus.getCarNum() == 2){
	                            flag.setCar2Status(1);
	                            if(flag.getCar1Status() == 1){
	                                flag.sendNewGameToBackend();
	                            }
	                        }
	                        break;
	                    /*
	                    2일 때..(Finish)
	                    1-1. 게임끝 신호 "2" 를 프론트에게 보낸다.
	                    1-2. 플레이어 상태를 0으로 만든다.
	                    1-3. 웹소켓 연결을 끊는다.
	                    2. 기록을 위해 timestamp를 받는다.
	                    3. 백엔드로 랩타임을 넘기고 setGameStatus(0)을 실행
	                    4. initiateAll()로 모두 초기화한다.
	                     */
	                    case 2:
	                        // 1
	                    	if(rcCarStatus.getCarNum() == 1) {
	                    		gameHandler.gamefinish(0);
	                    		flag.setPlayer1Status(0);
	                    	}
	                    	else if(rcCarStatus.getCarNum() == 2) {
	                    		gameHandler.gamefinish(1);
	                    		flag.setPlayer2Status(0);
	                    	}
	                        // 2
	                        Long endTime = rcCarStatus.getTimestamp();
	                        Long labTime = endTime - flag.getStartTime();
	                        // 3
	                        String bodySeg = "";
	                        if (rcCarStatus.getCarNum() == 1) {
	                            bodySeg = flag.getPlayer1Nickname() + "," + Long.toString(labTime);
	                            flag.setPlayer1Status(0);
	                        } else if (rcCarStatus.getCarNum() == 2) {
	                            bodySeg = flag.getPlayer2Nickname() + "," + Long.toString(labTime);
	                            flag.setPlayer2Status(0);
	                        }
	                        if (flag.getRequestBody() == "") {
	                            flag.setRequestBody(flag.getRequestBody() + bodySeg);
	                        } else {
	                            flag.setRequestBody(flag.getRequestBody() + "," + bodySeg);
	                            flag.sendResultToBackend(flag.getRequestBody());
	                            flag.setGameStatus(0);
	                        }
	                        // 4
	                        if(flag.getPlayer1Status() == 0 && flag.getPlayer2Status() == 0){
	                            flag.initiateAll();
	                        }
	                        break;
	                    case 3:
	                    	if(rcCarStatus.getCarNum() == 1) {
	                    		gameHandler.dataSend(0, rcCarStatus);
	                    		flag.setPlayer1Status(0);
	                    	}
	                    	else if(rcCarStatus.getCarNum() == 2) {
	                    		gameHandler.dataSend(1, rcCarStatus);
	                    		flag.setPlayer2Status(0);
	                    	}
	                    	break;
	                    default:
	                    	break;
	                }
				}
			}
		}catch(IOException e) {
			e.printStackTrace();
		}
	}
}
