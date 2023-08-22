package com.ssafy.realcart;

import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.realcart.mattermost.NotificationManager;

@SpringBootTest
class RealcartApplicationTests {

	@Autowired
	private NotificationManager notificationManager;
	@Test
	void contextLoads() {
	}
	
	@Test
	public void NotificationTest() {
		notificationManager.sendNotification(new IOException(), "http://127.0.0.1", "abc");
	}

}
