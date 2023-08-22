package com.ssafy.realcart.service.inter;

import com.ssafy.realcart.data.dto.UserDto;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
public interface IUserService {

    boolean createUser(UserDto userDto) throws NoSuchAlgorithmException;
    List<UserDto> getAllUsers();
    boolean banUser(String nickname);
    UserDto login(UserDto userDto) throws NoSuchAlgorithmException;
    boolean checkEmail(String email);
    boolean checkNickname(String nickname);
    boolean verifyEmail(String email, String salt);
	boolean clearUserBan(String nickname);

    boolean findPwd(String email);

    UserDto getUser(String username);
	boolean changePwd(String email);

    UserDto updateNickname(UserDto userDto);

    UserDto updatePassword(UserDto userDto);
}
