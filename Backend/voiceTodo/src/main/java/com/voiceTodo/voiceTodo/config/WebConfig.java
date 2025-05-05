package com.voiceTodo.voiceTodo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {
    public void addCorsMapping(CorsRegistry registry){
        registry.addMapping("/api/**")
                .allowedOrigins("http://127.0.0.1:5502","http://localhost:5502")
                .allowedMethods("GET","POST","DELETE","PUT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}
