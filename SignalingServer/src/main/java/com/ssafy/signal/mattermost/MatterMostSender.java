package com.ssafy.signal.mattermost;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import com.google.gson.Gson;
import com.ssafy.signal.mattermost.dto.MatterMostMessageDto.Attachment;
import com.ssafy.signal.mattermost.dto.MatterMostMessageDto.Attachments;
@Component
@RequiredArgsConstructor
public class MatterMostSender {
	private final Logger LOGGER = LoggerFactory.getLogger(MatterMostSender.class);
	@Value("${notification.mattermost.enabled}")
	private boolean mmEnabled;
	@Value("${notification.mattermost.webhook-url}")
	private String webhookUrl;
	
	private final RestTemplate RESTTEMPLATE;
	private final MattermostProperties MMPROPERTIES;
	
	
	public void sendMessage(Exception exception, String uri, String params) {
		if(!mmEnabled)
			return;
		
		try {
			Attachment attachment = Attachment.builder().pretext(MMPROPERTIES.getPretext()).title(MMPROPERTIES.getTitle()).text(MMPROPERTIES.getText()).footer(MMPROPERTIES.getFooter()).build();
			attachment.addExceptionInfo(exception, uri, params);
			Attachments attachments = new Attachments(attachment);
			attachments.addProps(exception);
			String payload = new Gson().toJson(attachments);
			
			HttpHeaders headers = new HttpHeaders();
			headers.set("Content-tyoe", MediaType.APPLICATION_JSON_VALUE);
			HttpEntity<String> entity = new HttpEntity<>(payload, headers);
			RESTTEMPLATE.postForEntity(webhookUrl, entity, String.class);
		} catch (Exception e) {
			LOGGER.error("#### ERROR!! Notification Manager : {}", e);
		}
	}
}
