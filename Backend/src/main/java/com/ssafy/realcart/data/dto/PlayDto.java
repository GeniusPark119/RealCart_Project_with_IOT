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
public class PlayDto {
	
	private int id;
    private String nickname1;
    private String nickname2;
    private long laptime1;
    private long laptime2;

}
