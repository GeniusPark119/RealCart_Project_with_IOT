package com.ssafy.signal.dto;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class FlagClass {
    private String player1Nickname = "";
    private String player2Nickname = "";
    // playerStatus 0: closed 1: onOpen(ready) 2: gaming
    private int player1Status;
    private int player2Status;
    private int car1Status;
    private int car2Status;
    private int gameStatus;  // 0: Ready, 1: Running
    private Long startTime;
    private Long player1Laptime;
    private Long player2Laptime;
    private String requestBody = "";

    private FlagClass(){}
    private static FlagClass instance = new FlagClass();
    public static FlagClass getInstance(){
        return instance;
    }


    public String getPlayer1Nickname() {
        return player1Nickname;
    }

    public synchronized void setPlayer1Nickname(String player1Nickname) {
        this.player1Nickname = player1Nickname;
    }

    public String getPlayer2Nickname() {
        return player2Nickname;
    }

    public synchronized void setPlayer2Nickname(String player2Nickname) {
        this.player2Nickname = player2Nickname;
    }

    public int getPlayer1Status() {
        return player1Status;
    }

    public synchronized void setPlayer1Status(int player1Status) {
        this.player1Status = player1Status;
    }

    public int getPlayer2Status() {
        return player2Status;
    }

    public synchronized void setPlayer2Status(int player2Status) {
        this.player2Status = player2Status;
    }

    public int getGameStatus() {
        return gameStatus;
    }

    public synchronized void setGameStatus(int gameStatus) {
        this.gameStatus = gameStatus;
    }

    public int getCar1Status() {
        return car1Status;
    }

    public synchronized void setCar1Status(int car1Status) {
        this.car1Status = car1Status;
    }

    public int getCar2Status() {
        return car2Status;
    }

    public synchronized void setCar2Status(int car2Status) {
        this.car2Status = car2Status;
    }

    public Long getStartTime() {
        return startTime;
    }

    public synchronized void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getPlayer1Laptime() {
        return player1Laptime;
    }

    public synchronized void setPlayer1Laptime(Long player1Laptime) {
        this.player1Laptime = player1Laptime;
    }

    public Long getPlayer2Laptime() {
        return player2Laptime;
    }

    public synchronized void setPlayer2Laptime(Long player2Laptime) {
        this.player2Laptime = player2Laptime;
    }

    public String getRequestBody() {
        return requestBody;
    }

    public synchronized void setRequestBody(String requestBody) {
        this.requestBody = requestBody;
    }

    public synchronized void initiateAll() {
        this.player1Nickname = "";
        this.player2Nickname = "";
        this.player1Status = 0;
        this.player2Status = 0;
        this.car1Status = 0;
        this.car2Status = 0;
        this.gameStatus = 0;
        this.startTime = 0L;
        this.player1Laptime = 0L;
        this.player2Laptime = 0L;
        this.requestBody = "";
    }

    @Override
    public String toString() {
        return "FlagClass{" +
                "player1Nickname='" + player1Nickname + '\'' +
                ", player2Nickname='" + player2Nickname + '\'' +
                ", player1Status=" + player1Status +
                ", player2Status=" + player2Status +
                ", car1Status=" + car1Status +
                ", car2Status=" + car2Status +
                ", gameStatus=" + gameStatus +
                ", startTime=" + startTime +
                ", player1Laptime=" + player1Laptime +
                ", player2Laptime=" + player2Laptime +
                ", requestBody='" + requestBody + '\'' +
                '}';
    }

    public synchronized void sendNewGameToBackend() {
        try {
            // EC2에서는 수정
            String url = "http://127.0.0.1:8060/game";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            con.setRequestProperty("Content-Length", Integer.toString(0));
            con.setUseCaches(false);

            try (DataOutputStream dos = new DataOutputStream(con.getOutputStream())) {
                dos.writeBytes("");
            }

            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                    con.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    System.out.println(line);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public synchronized void sendResultToBackend(String requestBody) {
        try {
            // EC2에서는 수정
            String url = "http://127.0.0.1:8060/game/result";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "Application/json;charset=UTF-8");
            con.setRequestProperty("Content-Length", Integer.toString(requestBody.length()));
            con.setUseCaches(false);

            System.out.println(requestBody);
            try (DataOutputStream dos = new DataOutputStream(con.getOutputStream())) {
//                dos.writeBytes(requestBody);
                dos.writeUTF(requestBody);
            }

            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                    con.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    System.out.println(line);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
