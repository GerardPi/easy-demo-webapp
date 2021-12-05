package io.github.gerardpi.easy.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.function.Supplier;

@Configuration
@EnableTransactionManagement
@Transactional
public class TestConfig {
    private static final Logger LOG = LoggerFactory.getLogger(TestConfig.class);
    /**
     * Allow for overriding beans for testing purposes.
     */
    public static final String BEAN_DEF_OVERRIDING_ENABLED = "spring.main.allow-bean-definition-overriding=true";

    public TestConfig() {
        LOG.info("######## {} ##########", TestConfig.class.getSimpleName());
    }

    @Bean
    Supplier<UUID> uuidSupplier() {
        return new FixedUuidSeriesSupplier();
    }

    @Bean
    Supplier<OffsetDateTime> dateTimeSupplier() {
        return new TestDateTimeSupplier();
    }
}
