package com.ssafy.signal;

import org.kurento.client.KurentoClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SignalApplication{

	public static void main(String[] args) {
		SpringApplication.run(SignalApplication.class, args);
	
	}
	
	@Bean
	public KurentoClient kurentoClient() {
		return KurentoClient.create();
	}
	
}

