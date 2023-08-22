package com.ssafy.realcart.data.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class DeviceDto {
    private int id;
    private String model;
    private String type;
    private String name;
    private String status;
    private String createdTime;
    private String modifiedTime;
}
