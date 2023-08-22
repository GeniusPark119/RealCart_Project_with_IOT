package com.ssafy.signal.controller;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.validation.Valid;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.signal.dto.ChatRequest;
import com.ssafy.signal.filtering.Trie;

@RestController
public class ChattingController {
	private final SimpMessagingTemplate simpMessagingTemplate;
	private Trie trie;
	
	public ChattingController(SimpMessagingTemplate simpMessagingTemplate) throws IOException {
		this.simpMessagingTemplate = simpMessagingTemplate;
		Resource resource = new ClassPathResource("fword_list.txt");
		InputStream is = resource.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		trie = new Trie();
		while(true) {
			String s = br.readLine();
			if(s == null) break;
			trie.addNewWord(s);
		}
		trie.findFail();
	}
	
	@MessageMapping("/messages")
	public void chat(@Valid ChatRequest chatRequest) {
		char[] answer = trie.match(trie.getRoot(), chatRequest.getMessage().toCharArray(), 0, 0);
		StringBuilder sb = new StringBuilder();
		for (char c : answer) {
			sb.append(c);
		}
		simpMessagingTemplate.convertAndSend("/subscribe", sb.toString());
	}
	
	
}
