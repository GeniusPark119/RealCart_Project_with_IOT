package com.ssafy.signal.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RcCarStatusDto {
    int carNum;
    Long timestamp;
    int speed;
    int gateNo;
    int status;  // 0: prepare, 1: ready, 2: start, 3: running, 4: finish

    public RcCarStatusDto(int carNum, Long timestamp, int speed, int gateNo, int status) {
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
