package com.ssafy.realcart.game;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.io.PrintWriter;
import java.net.InetSocketAddress;

import static com.ssafy.realcart.game.PlayerStatus.CLOSED;
import static com.ssafy.realcart.game.PlayerStatus.ONOPEN;

class WsHandler extends WebSocketServer {

    int port;
    PrintWriter pw;
    FlagClass flag = FlagClass.getInstance();

    public WsHandler(int port, PrintWriter pw){
        super(new InetSocketAddress(port));
        this.port = port;
        this.pw = pw;
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println(conn.getLocalSocketAddress() + " is on open.");
        if(port == 8886){
            flag.setPlayer1Status(ONOPEN);
        } else if (port == 8887){
            flag.setPlayer2Status(ONOPEN);
        } else {
            System.out.println("Invalidate port is opened");
        }
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        if(port == 8886){
            // 게임 시작 전에 한명이 나가면
            if(flag.getPlayer1Status().equals(ONOPEN)){
                if(flag.getPlayer1Status().equals(CLOSED)
                        || flag.getPlayer2Status().equals(CLOSED)){
                    flag.sendNewGameToBackend();
                }
                // 게임 중에 나가면
            } else if(flag.getPlayer1Status().equals(PlayerStatus.GAMING)){
                // 2
                Long endTime = 0L;
                Long labTime = endTime - flag.getGameStartTime();
                // 3
                String bodySeg = "";
                bodySeg = flag.getPlayer1Nickname() + "," + Long.toString(labTime);
                if (flag.getBackendRequestBody() == "") {
                    flag.setBackendRequestBody(flag.getBackendRequestBody() + bodySeg);
                } else {
                    flag.setBackendRequestBody(flag.getBackendRequestBody() + "," + bodySeg);
                    flag.sendResultToBackend(flag.getBackendRequestBody());
                }
                flag.setPlayer1Status(CLOSED);
                if(flag.getPlayer1Status().equals(CLOSED)
                        && flag.getPlayer2Status().equals(CLOSED)){
                    flag.initiateAll();
                }
            }
            flag.setPlayer1Status(CLOSED);
            System.out.println("websocket closed on " + port + " >>> " + flag);
        } else if (port == 8887){
            // 게임 시작 전에 한명이 나가면
            if(flag.getPlayer2Status().equals(ONOPEN)){
                if(flag.getPlayer1Status().equals(CLOSED)
                        || flag.getPlayer2Status().equals(CLOSED)){
                    flag.sendNewGameToBackend();
                }
                // 게임 중에 나가면
            } else if(flag.getPlayer2Status().equals(CLOSED)){
                // 2
                Long endTime = 0L;
                Long labTime = endTime - flag.getGameStartTime();
                // 3
                String bodySeg = "";
                bodySeg = flag.getPlayer2Nickname() + "," + Long.toString(labTime);
                if (flag.getBackendRequestBody() == "") {
                    flag.setBackendRequestBody(flag.getBackendRequestBody() + bodySeg);
                } else {
                    flag.setBackendRequestBody(flag.getBackendRequestBody() + "," + bodySeg);
                    flag.sendResultToBackend(flag.getBackendRequestBody());
                }
                flag.setPlayer2Status(CLOSED);
                if(flag.getPlayer1Status().equals(CLOSED)
                        && flag.getPlayer2Status().equals(CLOSED)){
                    flag.initiateAll();
                }
            }
            flag.setPlayer2Status(CLOSED);
            System.out.println("websocket closed on " + port + " >>> " + flag);
        } else {
            System.out.println("Invalidate port is closed");
        }
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        if(flag.getGameStatus().equals(GameStatus.RUNNING)){
            pw.write(Integer.parseInt(message));
            pw.flush();
        } else {
            if(port == 8886){
                flag.setPlayer1Nickname(message);
            } else if(port == 8887){
                flag.setPlayer2Nickname(message);
            }
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.out.println("WebSocket on error.");
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println("WebSocket server started on port " + this.port);
    }
}
