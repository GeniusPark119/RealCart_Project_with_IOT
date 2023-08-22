package com.ssafy.signal.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

	@NotNull
	private Long senderId;
	
	private Long receiverId;
	
	@NotBlank
	private String message;
	
}
