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
public class GameDto {
    private int id;
    private String player1;
    private String player2;
    private String lapTime1;
    private String lapTime2;

}
