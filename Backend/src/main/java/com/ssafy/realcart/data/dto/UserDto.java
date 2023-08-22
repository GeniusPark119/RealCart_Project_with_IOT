package com.ssafy.realcart.data.dto;

import com.ssafy.realcart.data.entity.auth.ProviderType;

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
public class UserDto {
    private int userId;
    private String username;
    private String email;
    private String nickname;
    private String password;
    private String salt;
    private String intro;
    private String profileImageUrl;
    private String refreshToken;
    private ProviderType providerType;
}
