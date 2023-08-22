package com.ssafy.signal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;

import com.ssafy.signal.RequestStorage;

@Configuration
public class RequestStorageConfig {
	
	@Bean
	@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
	public RequestStorage requestStorage(){
		return new RequestStorage();
	}
}
