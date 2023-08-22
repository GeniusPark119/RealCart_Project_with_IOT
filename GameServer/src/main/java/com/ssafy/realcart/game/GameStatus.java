package com.ssafy.realcart.game;

public enum GameStatus {
    READY(0),
    RUNNING(1);

    final private int code;
    private GameStatus(int code) {
        this.code = code;
    }

    public int getCode(){
        return code;
    }
}
