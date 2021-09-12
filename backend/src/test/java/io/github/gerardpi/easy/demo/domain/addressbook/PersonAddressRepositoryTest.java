package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.DemoApplication;
import io.github.gerardpi.easy.demo.Repositories;
import io.github.gerardpi.easy.demo.TestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;

// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class PersonAddressRepositoryTest {
    private final Repositories repositories;
    private final Supplier<UUID> uuidSupplier;

    @Autowired
    PersonAddressRepositoryTest(Repositories repositories, Supplier<UUID> uuidSupplier) {
        this.repositories = repositories;
        this.uuidSupplier = uuidSupplier;
    }

    @BeforeEach
    private void setup() {
        repositories.clear();
    }

    @Test
    public void test() {
        // Given
        PersonName personName = PersonName.create()
                .setLast("Pietersen").build();
        Person person = Person.create(uuidSupplier.get()).setName(personName).setDateOfBirth(LocalDate.of(1973, 2, 2)).build();
        Address address = Address.create(uuidSupplier.get())
                .setCountryCode("NL")
                .setCity("Amsterdam")
                .setPostalCode("1000AA")
                .setStreet("Vierwindenstraat")
                .setHouseNumber("2")
                .build();

        repositories.getAddressRepository().save(address);
        repositories.getPersonRepository().save(person);
        // When
        PersonAddress ownedAddress = PersonAddress.create(uuidSupplier.get())
                .setAddressId(address.getId())
                .setPersonId(person.getId())
                .setDescription("bla bla")
                .setFromDate(LocalDate.of(1994, 2, 1))
                .setType(PersonAddressType.PROPERTY)
                .build();
        repositories.getPersonAddressRepository().save(ownedAddress);
        PersonAddress occupiedAddress = PersonAddress.create(uuidSupplier.get())
                .setAddressId(address.getId())
                .setPersonId(person.getId())
                .setDescription("bla bla")
                .setFromDate(LocalDate.of(1994, 2, 1))
                .setType(PersonAddressType.RESIDENCE)
                .build();
        repositories.getPersonAddressRepository().save(occupiedAddress);
        List<PersonAddress> savedPersonAddresses = repositories.getPersonAddressRepository().findByPersonIdAndAddressId(person.getId(), address.getId());
        // Then
        assertThat(savedPersonAddresses).contains(occupiedAddress);
        assertThat(savedPersonAddresses).contains(ownedAddress);
    }
}
