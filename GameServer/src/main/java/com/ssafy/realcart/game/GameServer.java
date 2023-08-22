package com.ssafy.realcart.game;

import com.google.gson.Gson;
import org.java_websocket.WebSocket;
import org.java_websocket.server.WebSocketServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

import static com.ssafy.realcart.game.PlayerStatus.*;
import static com.ssafy.realcart.game.RcCarStatus.READY;


public class GameServer {

    private static final int RC_CAR1_SOCKET_PORT = 8081;
    private static final int RC_CAR2_SOCKET_PORT = 8082;
    private static final int PLAYER1_WEBSOCKET_PORT = 8886;
    private static final int PLAYER2_WEBSOCKET_PORT = 8887;

    public static void main(String[] args) {
        Thread thread1 = new Thread(new PlayThread(RC_CAR1_SOCKET_PORT, PLAYER1_WEBSOCKET_PORT));
        Thread thread2 = new Thread(new PlayThread(RC_CAR2_SOCKET_PORT, PLAYER2_WEBSOCKET_PORT));
        thread1.start();
        thread2.start();
    }
}

class PlayThread implements Runnable{

    int socketPort = 0;
    int webSocketPort = 0;
    WebSocketServer webSocketServer = null;
    Gson gson = new Gson();
    private static final FlagClass flag = FlagClass.getInstance();

    PlayThread(int socketPort, int webSocketPort){
        this.socketPort = socketPort;
        this.webSocketPort = webSocketPort;
    }

    @Override
    public void run() {
        try {
            ServerSocket serverSocket = new ServerSocket(socketPort);
            Socket socket = serverSocket.accept();
            BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter pw = new PrintWriter(socket.getOutputStream());
            this.webSocketServer = new WsHandler(webSocketPort, pw);
            webSocketServer.start();

            while(true){
                int dataLength = 100;
                String jsonData = readJson(dataLength, br);
                RcCarDto rcCarStatus = gson.fromJson(jsonData.trim(), RcCarDto.class);
                switch(rcCarStatus.status){
                    case 1:
                        rcCarsReady(rcCarStatus.carNum);
                        allReady();

                        sendToClient("{\"status\":1}");
                        Thread.sleep(5000);

                        sendStartSign(pw);
                        gameStart();
                        break;

                    case 2:
                        Long endTime = rcCarStatus.timestamp;
                        Long labTime = endTime - flag.getGameStartTime();

                        shutDownPlayer(rcCarStatus.timestamp, rcCarStatus.carNum);
                        sendLapTimeToBackend(rcCarStatus.carNum, labTime);

                        initiateAll();
                        break;

                    case 3:
                        sendToClient( jsonData);
                        break;

                    default:

                }
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }

    }

    private String readJson(int dataLength, BufferedReader br) throws IOException{
        String jsonData = "";
        for (int i = 0; i < dataLength; i++) {
            jsonData += (char) br.read();
        }
        return jsonData;
    }

    private void rcCarsReady(int carNum){
        if(carNum == 1){
            flag.setCar1Status(READY);
            if(flag.getCar2Status().equals(READY)){
                flag.sendNewGameToBackend();
            }
        } else if(carNum == 2){
            flag.setCar2Status(READY);
            if(flag.getCar1Status().equals(READY)){
                flag.sendNewGameToBackend();
            }
        }
    }

    private void allReady() throws InterruptedException {
        while (true) {
            if (flag.getCar1Status() == READY &&
                    flag.getCar2Status() == READY &&
                    flag.getPlayer1Status() == ONOPEN &&
                    flag.getPlayer2Status() == ONOPEN) {
                System.out.println("We All Ready >>> " + flag);
                break;
            }
            Thread.sleep(2000);
        }
    }

    private void sendToClient(String message) {
        for (WebSocket client : webSocketServer.getConnections()){
            client.send(message);
        }
    }

    private void sendStartSign(PrintWriter pw) {
        pw.write((byte) '1');
        pw.flush();
    }

    private void gameStart(){
        flag.setGameStartTime(System.currentTimeMillis());
        flag.setPlayer1Status(GAMING);
        flag.setPlayer2Status(GAMING);
        flag.setGameStatus(GameStatus.RUNNING);
        System.out.println("Game Start >>> " + flag);
    }

    private void shutDownPlayer(Long labTime, int carNum){
        for (WebSocket client : webSocketServer.getConnections()) {
            client.send("{\"status\":2, \"labtime\":"+labTime+"}");
            if(carNum == 1){
                flag.setPlayer1Status(CLOSED);
            } else if(carNum == 2){
                flag.setPlayer2Status(CLOSED);
            }
            System.out.println(flag);
            client.close();
        }
    }

    private void sendLapTimeToBackend(int carNum, long labTime){
        String bodySeg = "";
        if (carNum == 1) {
            bodySeg = flag.getPlayer1Nickname() + "," + Long.toString(labTime);
            flag.setPlayer1Laptime(labTime);
        } else if (carNum == 2) {
            bodySeg = flag.getPlayer2Nickname() + "," + Long.toString(labTime);
            flag.setPlayer2Laptime(labTime);
        }

        if (flag.getBackendRequestBody() == "") {
            flag.setBackendRequestBody(flag.getBackendRequestBody() + bodySeg);
        } else {
            flag.setBackendRequestBody(flag.getBackendRequestBody() + "," + bodySeg);
            flag.sendResultToBackend(flag.getBackendRequestBody());
            flag.setGameStatus(GameStatus.READY);
        }
    }

    private void initiateAll(){
        if(flag.getPlayer1Status().equals(CLOSED) && flag.getPlayer2Status().equals(CLOSED)){
            flag.initiateAll();
        }
    }
}
