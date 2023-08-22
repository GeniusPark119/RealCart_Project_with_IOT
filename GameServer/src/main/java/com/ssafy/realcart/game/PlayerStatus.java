package com.ssafy.realcart.game;

public enum PlayerStatus {
    CLOSED(0),
    ONOPEN(1),
    GAMING(2);

    final private int code;
    private PlayerStatus(int code) {
        this.code = code;
    }

    public int getCode(){
        return code;
    }
}
