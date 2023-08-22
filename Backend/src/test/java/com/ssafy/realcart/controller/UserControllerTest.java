package com.ssafy.realcart.controller;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.google.gson.Gson;
import com.ssafy.realcart.data.dto.UserDto;
import com.ssafy.realcart.service.UserService;


@WebMvcTest(UserController.class)
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	UserService userService;
	
	@Test
	@DisplayName("MockMvc를 통한 User 데이터 가져오기 테스트")
	void getAllUsersTest() throws Exception{
		
		given(userService.getAllUsers()).willReturn(
				new ArrayList<UserDto>());
		
		mockMvc.perform(
				get("/user")).andExpect(status().isOk()).andDo(print());
		
		verify(userService).getAllUsers();
		
	}
	
	@Test
	@DisplayName("User 데이터 생성 테스트")
	void createUser() throws Exception{
		UserDto userDto = UserDto.builder().nickname("brianpsw").password("1234").email("brianpsw@naver.com").username("park").build();
		given(userService.createUser(userDto)).willReturn(true);
		
		
		Gson gson = new Gson();
		String content = gson.toJson(userDto);
		
		mockMvc.perform(
				post("/user")
				.content(content)
				.contentType(MediaType.APPLICATION_JSON))
		.andExpect(status().isOk())
		.andExpect(jsonPath("$.nickname").exists())
		.andExpect(jsonPath("$.password").exists())
		.andExpect(jsonPath("$.email").exists())
		.andExpect(jsonPath("$.username").exists())
		.andDo(print());
		
		verify(userService).createUser(userDto);
		
	}
}
