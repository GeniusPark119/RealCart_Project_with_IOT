package com.ssafy.realcart.game;

public class RcCarDto {
    int carNum;
    Long timestamp;
    int speed;
    int gateNo;
    int status;  // 1: Ready, 2: Finish, 3: Running

    public RcCarDto(int carNum, Long timestamp, int speed, int gateNo, int status) {
        this.carNum = carNum;
        this.timestamp = timestamp;
        this.speed = speed;
        this.gateNo = gateNo;
        this.status = status;
    }

    @Override
    public String toString() {
        return "RcCarStatusDto{" +
                "carNum=" + carNum +
                ", timestamp=" + timestamp +
                ", speed=" + speed +
                ", gateNo=" + gateNo +
                ", status=" + status +
                '}';
    }
}
