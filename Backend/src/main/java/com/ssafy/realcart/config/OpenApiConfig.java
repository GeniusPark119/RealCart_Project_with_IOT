package com.ssafy.realcart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {
    
	@Bean
    public OpenAPI realCartApiInfo() {
        return new OpenAPI()
        		.info(new Info().title("RealCart API")
	            .description("Real Cart Play application")
	            .version("v0.0.1"));
    }
}
