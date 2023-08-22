package com.ssafy.realcart.controller;

import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.ssafy.realcart.common.ApiResponse;
import com.ssafy.realcart.config.auth.AppProperties;
import com.ssafy.realcart.data.entity.User;
import com.ssafy.realcart.data.entity.auth.AuthReqModel;
import com.ssafy.realcart.data.entity.auth.UserPrincipal;
import com.ssafy.realcart.data.repository.IUserRepository;
import com.ssafy.realcart.service.auth.AuthToken;
import com.ssafy.realcart.service.auth.AuthTokenProvider;
import com.ssafy.realcart.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.realcart.data.dto.UserDto;
import com.ssafy.realcart.service.inter.IUserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final AppProperties appProperties;
    private final AuthTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final IUserRepository userRepository;
    private final static long THREE_DAYS_MSEC = 259200000;
    private final static String REFRESH_TOKEN = "refresh_token";
    private final Logger LOGGER = LoggerFactory.getLogger(UserController.class);




    @GetMapping(value="/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        LOGGER.info("getAllUsers 메서드가 userController에서 호출되었습니다.");
        List<UserDto> userList = userService.getAllUsers();
        return new ResponseEntity<List<UserDto>>(userList, HttpStatus.OK);
    }

    @GetMapping()
    public ApiResponse getUser() {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserDto user = userService.getUser(principal.getUsername());
        
        return ApiResponse.success("user", user);
    }

    @GetMapping(value="/checkemail")
    public ResponseEntity<String> checkEmail(@RequestParam String email) {
        LOGGER.info("checkEmail 메서드가 userController에서 호출되었습니다.");
        if(userService.checkEmail(email)){
            String msg = "Unique";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
        else{
            String msg = "Duplicate";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
    }


    @GetMapping(value="/checknickname")
    public ResponseEntity<String> checkNickname(@RequestParam String nickname) {
        LOGGER.info("checkNickname 메서드가 userController에서 호출되었습니다.");
        if(userService.checkNickname(nickname)){
            String msg = "Unique";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
        else{
            String msg = "Duplicate";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
    }

    @GetMapping(value="/verifyemail/{email}/{salt}")
    public ResponseEntity<String> verifyEmail(@PathVariable("email") String email, @PathVariable("salt") String salt) {
        LOGGER.info("verifyemail 메서드가 userController에서 호출되었습니다.");
        if(userService.verifyEmail(email, salt)){
            String msg = "회원가입 성공!";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
        else{
            String msg = "유효한 코드가 아닙니다.";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
    }

    @PostMapping(value="/register")
    public ResponseEntity<String> createUser(@RequestBody UserDto userDto){
        LOGGER.info("createUser 메서드가 userController에서 호출되었습니다.");
        
        try {
            if(userService.createUser(userDto)){
//            	userService.preprocessMail(userDto);
            	
            	String msg = "회원가입 성공";
                return new ResponseEntity<String>(msg, HttpStatus.OK);
            }
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        String msg = "회원가입 실패";
        return new ResponseEntity<String>(msg, HttpStatus.BAD_REQUEST);
    }

    @PostMapping()
    public ResponseEntity<UserDto> login(@RequestBody UserDto userDto){
        LOGGER.info("Login 메서드가 userController에서 호출되었습니다.");
        try {
            UserDto loginUser = userService.login(userDto);
            if(loginUser != null){
                return new ResponseEntity<UserDto>(loginUser, HttpStatus.OK);
            }
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
    @PutMapping(value = "/nickname")
    public ResponseEntity<UserDto> updateNickname(@RequestBody UserDto userDto){
        LOGGER.info("updateUser 메서드가 userController에서 호출되었습니다.");

        UserDto loginUser = userService.updateNickname(userDto);
        if(loginUser != null){
            return new ResponseEntity<UserDto>(loginUser, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping(value ="/password")
    public ResponseEntity<UserDto> updatePassword(@RequestBody UserDto userDto){
        LOGGER.info("updateUser 메서드가 userController에서 호출되었습니다.");

        UserDto loginUser = userService.updatePassword(userDto);
        if(loginUser != null){
            return new ResponseEntity<UserDto>(loginUser, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value="/login")
    public ApiResponse login(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody AuthReqModel authReqModel
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authReqModel.getId(),
                        authReqModel.getPassword()
                )
        );
        LOGGER.warn("authReqModel.getId() : " + authReqModel.getId());
        LOGGER.warn("authReqModel.getPassword() : " + authReqModel.getPassword());
        System.out.println("authReqModel.getId() : " + authReqModel.getId());
        System.out.println("authReqModel.getPassword() : " + authReqModel.getPassword());

        String userId = authReqModel.getId();
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Date now = new Date();
        AuthToken accessToken = tokenProvider.createAuthToken(
                userId,
                ((UserPrincipal) authentication.getPrincipal()).getRoleType().getCode(),
                new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())    // 만료 시점
        );

        // New refresh token
        long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();
        AuthToken refreshToken = tokenProvider.createAuthToken(
                appProperties.getAuth().getTokenSecret(),
                new Date(now.getTime() + refreshTokenExpiry)
        );

        // userId refresh token 으로 DB 확인
        User user = userRepository.findByEmail(userId);
        if (user == null){
            return ApiResponse.fail();
        }
        String userRefreshToken = user.getRefreshToken();
        if (userRefreshToken == null) {
            // 없는 경우 새로 등록
            userRefreshToken = refreshToken.getToken();
            user.setRefreshToken(userRefreshToken);
            userRepository.saveAndFlush(user);
        } else {
            // DB에 refresh 토큰 업데이트
            user.setRefreshToken(refreshToken.getToken());
            userRepository.saveAndFlush(user);
        }

        int cookieMaxAge = (int) refreshTokenExpiry / 60;
        CookieUtil.deleteCookie(request, response, REFRESH_TOKEN);
        CookieUtil.addCookie(response, REFRESH_TOKEN, refreshToken.getToken(), cookieMaxAge);

        return ApiResponse.success("token", accessToken.getToken());
    }

    @PostMapping("/ban/{nickname}")
    public ResponseEntity<String> banUser(@PathVariable String nickname){
        LOGGER.info("banUser 메서드가 userController에서 호출되었습니다.");
        if(userService.banUser(nickname)) {
        	return new ResponseEntity<String>("유저 밴 성공", HttpStatus.OK);
        }
        return new ResponseEntity<String>("유저 밴 실패", HttpStatus.BAD_REQUEST);
    }
    
    @DeleteMapping("/ban/{nickname}")
    public ResponseEntity<String> clearUserBan(@PathVariable String nickname){
        LOGGER.info("clearUserBan 메서드가 userController에서 호출되었습니다.");
        if(userService.clearUserBan(nickname)) {
        	return new ResponseEntity<String>("유저 밴 해제 성공", HttpStatus.OK);
        }
        return new ResponseEntity<String>("유저 밴 해제 실패", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/findpwd")
    public ResponseEntity<String> findPwd(@RequestBody Map<String, String> emailMap){
        LOGGER.info("findPwd 메서드가 userController에서 호출되었습니다.");
        if(userService.findPwd(emailMap.get("email"))) {
            return new ResponseEntity<String>("이메일 확인하세요.", HttpStatus.OK);
        }
        return new ResponseEntity<String>("가입하지 않은 유저입니다.", HttpStatus.BAD_REQUEST);
    }

    
    @GetMapping(value="/bcrypt/{email}")
    public ResponseEntity<String> changePwd(@PathVariable("email") String email) throws NoSuchAlgorithmException {
        LOGGER.info("changePwd 메서드가 userController에서 호출되었습니다.");
        if(userService.changePwd(email)){
            String msg = "비밀번호 변경 성공";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
        else{
            String msg = "유효한 코드가 아닙니다.";
            return new ResponseEntity<>(msg, HttpStatus.OK);
        }
    }
}
