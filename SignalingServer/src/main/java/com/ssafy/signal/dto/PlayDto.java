package com.ssafy.signal.dto;

public class PlayDto {
    private String nickname1;
    private String nickname2;
    private long laptime1;
    private long laptime2;

    public String getNickname1() {
        return nickname1;
    }

    public void setNickname1(String nickname1) {
        this.nickname1 = nickname1;
    }

    public String getNickname2() {
        return nickname2;
    }

    public void setNickname2(String nickname2) {
        this.nickname2 = nickname2;
    }

    public long getLaptime1() {
        return laptime1;
    }

    public void setLaptime1(long laptime1) {
        this.laptime1 = laptime1;
    }

    public long getLaptime2() {
        return laptime2;
    }

    public void setLaptime2(long laptime2) {
        this.laptime2 = laptime2;
    }
}
