package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.DemoApplication;
import io.github.gerardpi.easy.demo.Repositories;
import io.github.gerardpi.easy.demo.SavedEntities;
import io.github.gerardpi.easy.demo.TestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;

// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class AddressRepositoryTest {
    private final Repositories repositories;
    private final Supplier<UUID> uuidSupplier;

    @Autowired
    AddressRepositoryTest(Repositories repositories, Supplier<UUID> uuidSupplier) {
        this.repositories = repositories;
        this.uuidSupplier = uuidSupplier;
    }

    @BeforeEach
    private void setup() {
        repositories.clear();
    }

    @Test
    void test() {
        // Given
        Address unsavedAddress = new Address.Builder()
                        .id(uuidSupplier.get())
                        .countryCode("NL")
                        .city("Amsterdam")
                        .postalCode("1000AA")
                        .street("Vierwindenstraat")
                        .houseNumber("2")
                        .build();

        // When
        Address savedAddress = repositories.getAddressRepository().save(unsavedAddress);
        // Then
        assertThat(unsavedAddress.getEtag()).isNull();
        assertThat(savedAddress.getEtag()).isEqualTo(0);
        assertThat(repositories.getAddressRepository().findAll()).hasSize(1);
        Address fetchedAddress = repositories.getAddressRepository().getAddressById(unsavedAddress.getId());
        assertThat(fetchedAddress.getEtag()).isEqualTo(0);
        Address modifiedAddress = fetchedAddress.modify().city("Delft").build();
        repositories.getAddressRepository().save(modifiedAddress);
        Address fetchedAddress2 = repositories.getAddressRepository().getAddressById(unsavedAddress.getId());
        assertThat(fetchedAddress2.getEtag()).isEqualTo(1);
        assertThat(fetchedAddress2.getCity()).isEqualTo("Delft");
    }
}
