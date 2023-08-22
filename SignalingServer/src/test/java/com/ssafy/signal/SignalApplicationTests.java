package com.ssafy.signal;

import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.signal.mattermost.NotificationManager;

@SpringBootTest
class SignalApplicationTests {

	@Autowired
	private NotificationManager notificationManager;
	
	@Test
	void contextLoads() {
	}
	
	@Test
	public void notificationTest() {
		notificationManager.sendNotification(new IOException(), "http://127.0.0.1", "abc");
	}

}
