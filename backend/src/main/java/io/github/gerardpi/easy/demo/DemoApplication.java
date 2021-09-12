package io.github.gerardpi.easy.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.gerardpi.easy.demo.json.ObjectMapperHolder;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@SpringBootApplication
public class DemoApplication implements WebMvcConfigurer {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
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
    UuidGenerator uuidGenerator() {
        return UUID::randomUUID;
    }
}
