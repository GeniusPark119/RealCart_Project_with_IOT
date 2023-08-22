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
public class CommentDto {
    private int id;
    private String nickname;
    private String content;
    private LocalDateTime createdTime;
    private LocalDateTime modifiedTime;
}
