package com.ssafy.realcart.game;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.ssafy.realcart.game.GameStatus.READY;
import static com.ssafy.realcart.game.PlayerStatus.CLOSED;
import static com.ssafy.realcart.game.RcCarStatus.NULL;

public class FlagClass {
    private String player1Nickname = "";
    private String player2Nickname = "";
    private PlayerStatus player1Status;
    private PlayerStatus player2Status;
    private RcCarStatus car1Status=NULL;
    private RcCarStatus car2Status=NULL;
    private GameStatus gameStatus;
    private Long gameStartTime;
    private Long player1Laptime;
    private Long player2Laptime;
    private String backendRequestBody = "";

    private FlagClass(){}
    private static FlagClass instance = new FlagClass();
    public static FlagClass getInstance(){
        return instance;
    }

    public String getPlayer1Nickname() {
        return player1Nickname;
    }

    public void setPlayer1Nickname(String player1Nickname) {
        this.player1Nickname = player1Nickname;
    }

    public String getPlayer2Nickname() {
        return player2Nickname;
    }

    public void setPlayer2Nickname(String player2Nickname) {
        this.player2Nickname = player2Nickname;
    }

    public PlayerStatus getPlayer1Status() {
        return player1Status;
    }

    public void setPlayer1Status(PlayerStatus player1Status) {
        this.player1Status = player1Status;
    }

    public PlayerStatus getPlayer2Status() {
        return player2Status;
    }

    public void setPlayer2Status(PlayerStatus player2Status) {
        this.player2Status = player2Status;
    }

    public RcCarStatus getCar1Status() {
        return car1Status;
    }

    public void setCar1Status(RcCarStatus car1Status) {
        this.car1Status = car1Status;
    }

    public RcCarStatus getCar2Status() {
        return car2Status;
    }

    public void setCar2Status(RcCarStatus car2Status) {
        this.car2Status = car2Status;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public Long getGameStartTime() {
        return gameStartTime;
    }

    public void setGameStartTime(Long gameStartTime) {
        this.gameStartTime = gameStartTime;
    }

    public Long getPlayer1Laptime() {
        return player1Laptime;
    }

    public void setPlayer1Laptime(Long player1Laptime) {
        this.player1Laptime = player1Laptime;
    }

    public Long getPlayer2Laptime() {
        return player2Laptime;
    }

    public void setPlayer2Laptime(Long player2Laptime) {
        this.player2Laptime = player2Laptime;
    }

    public String getBackendRequestBody() {
        return backendRequestBody;
    }

    public void setBackendRequestBody(String backendRequestBody) {
        this.backendRequestBody = backendRequestBody;
    }

    public static void setInstance(FlagClass instance) {
        FlagClass.instance = instance;
    }

    public synchronized void initiateAll() {
        this.player1Nickname = "";
        this.player2Nickname = "";
        this.player1Status = CLOSED;
        this.player2Status = CLOSED;
        this.car1Status = NULL;
        this.car2Status = NULL;
        this.gameStatus = READY;
        this.gameStartTime = 0L;
        this.player1Laptime = 0L;
        this.player2Laptime = 0L;
        this.backendRequestBody = "";
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
                ", gameStartTime=" + gameStartTime +
                ", player1Laptime=" + player1Laptime +
                ", player2Laptime=" + player2Laptime +
                ", backendRequestBody='" + backendRequestBody + '\'' +
                '}';
    }

    public synchronized void sendNewGameToBackend() {
        try {
            String url = "http://localhost:8060/game";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "text/plain");
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
            String url = "http://localhost:8060/game/result";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();

            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "text/plain");
            con.setRequestProperty("Content-Length", Integer.toString(requestBody.length()));

            con.setUseCaches(false);


            System.out.println(requestBody);
            try (DataOutputStream dos = new DataOutputStream(con.getOutputStream())) {
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
