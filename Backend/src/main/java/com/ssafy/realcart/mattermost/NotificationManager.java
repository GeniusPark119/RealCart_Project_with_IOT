package com.ssafy.realcart.mattermost;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationManager {
	private final Logger LOGGER = LoggerFactory.getLogger(NotificationManager.class);
	
	@Autowired
	private MatterMostSender mmSender;
	
	public void sendNotification(Exception e, String uri, String params) {
		LOGGER.info("#### SEND Notification");
		mmSender.sendMessage(e, uri, params);
	}
}
