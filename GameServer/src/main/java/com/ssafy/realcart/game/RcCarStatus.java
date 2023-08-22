package com.ssafy.realcart.game;

public enum RcCarStatus {
    NULL(0),
    READY(1),
    FINISH(2),
    RUNNING(3);

    final private int code;
    private RcCarStatus(int code) {
        this.code = code;
    }

    public int getCode(){
        return code;
    }
}
