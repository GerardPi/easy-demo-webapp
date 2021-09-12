package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.DemoApplication;
import io.github.gerardpi.easy.demo.Repositories;
import io.github.gerardpi.easy.demo.TestConfig;
import io.github.gerardpi.easy.demo.UuidGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class AddressRepositoryTest {
    private final Repositories repositories;
    private final UuidGenerator uuidGenerator;

    @Autowired
    AddressRepositoryTest(Repositories repositories, UuidGenerator uuidGenerator) {
        this.repositories = repositories;
        this.uuidGenerator = uuidGenerator;
    }

    @BeforeEach
    private void setup() {
        repositories.clear();
    }

    @Test
    void test() {
        // Given
        Address address = Address.create(uuidGenerator.generate())
                .setCountryCode("NL")
                .setCity("Amsterdam")
                .setPostalCode("1000AA")
                .setStreet("Vierwindenstraat")
                .setHouseNumber("2")
                .build();

        // When
        repositories.getAddressRepository().save(address);
        // Then
        assertThat(repositories.getAddressRepository().findAll()).hasSize(1);
    }
}
