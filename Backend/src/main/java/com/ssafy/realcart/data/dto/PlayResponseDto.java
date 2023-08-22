package com.ssafy.realcart.data.dto;

import java.time.LocalDateTime;

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
public class PlayResponseDto {

	private String nickname;
    private String lapTime;
    private byte isWin;
    private String oppo;
    private String oppoLapTime;;
    private int gameId;
    private LocalDateTime gameTime;
}
