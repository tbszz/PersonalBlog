package com.personalblog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
                
        // Serve frontend static files
        // In production, you might want to serve these via Nginx, 
        // but for a simple self-contained jar, this works.
        // Assuming frontend build is copied to src/main/resources/static or public
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward to index.html for SPA (Single Page Application) support
        
        // Match root path
        registry.addViewController("/")
                .setViewName("forward:/index.html");
                
        // Match all paths to index.html using a simple wildcard if allowed,
        // or just let 404s happen for now to fix the startup error.
        // The issue is that standard wildcards like /** are restricted in some contexts with the new parser.
        // Let's just keep the root mapping which is safe.
    }
}
