package io.github.gerardpi.easy.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.gerardpi.easy.demo.json.ObjectMapperHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@SpringBootApplication
public class DemoApplication implements WebMvcConfigurer {
    private static final Logger LOG = LoggerFactory.getLogger(DemoApplication.class);
    private final Environment environment;

    public DemoApplication(Environment environment) {
        this.environment = environment;
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Use -Deasy.demo.cors.enabled=true for testing purposes only.
        boolean corsEnabled = environment.getProperty("easy.demo.cors.enabled", Boolean.class, false);
        LOG.info("CORS enabled: '{}'", corsEnabled);
        if (corsEnabled) {
            String corsPathPattern = "/**";
            String corsAllowedOrigins = "http://localhost:8080";
            LOG.warn("!!! Added CORS maping for path pattern '{}' to allow origins '{}' !!!", corsPathPattern, corsAllowedOrigins);
            registry.addMapping(corsPathPattern).allowedOrigins(corsAllowedOrigins);
        }
        WebMvcConfigurer.super.addCorsMappings(registry);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return ObjectMapperHolder.getIntance().getObjectMapper();
    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.stream()
                .filter(MappingJackson2HttpMessageConverter.class::isInstance)
                .map(MappingJackson2HttpMessageConverter.class::cast)
                .forEach(c -> c.setObjectMapper(ObjectMapperHolder.getIntance().getObjectMapper()));
        LoggerFactory.getLogger(ObjectMapperHolder.class).info("Setting an initial objectMapper");
    }

    @Bean
    public Supplier<OffsetDateTime> dateTimeSupplier() {
        return OffsetDateTime::now;
    }

    @Bean
    public Supplier<UUID> uuidSupplier() {
        return UUID::randomUUID;
    }
}
