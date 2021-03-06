package io.github.gerardpi.easy.demo.web.addressbook;

import com.tngtech.jgiven.Stage;
import com.tngtech.jgiven.annotation.Hidden;
import com.tngtech.jgiven.annotation.Quoted;
import com.tngtech.jgiven.annotation.ScenarioStage;
import com.tngtech.jgiven.junit5.SimpleScenarioTest;
import io.github.gerardpi.easy.demo.*;
import io.github.gerardpi.easy.demo.domain.IntegrationTestUtils;
import io.github.gerardpi.easy.demo.domain.addressbook.*;
import io.github.gerardpi.easy.demo.persistence.PersistableEntityWithTag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

import static io.github.gerardpi.easy.demo.TestFunctions.storeAndReturnPerson;
import static org.assertj.core.api.Assertions.assertThat;

// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class AddressbookTest extends SimpleScenarioTest<AddressbookTest.State> {
    private final Repositories repositories;
    private final Supplier<UUID> uuidSupplier;
    private final WebApplicationContext wac;

    @ScenarioStage
    private State state;

    @Autowired
    AddressbookTest(Repositories repositories, Supplier<UUID> uuidSupplier, WebApplicationContext wac) {
        this.repositories = repositories;
        this.uuidSupplier = uuidSupplier;
        this.wac = wac;
    }

    @BeforeEach
    public void init() {
        ((FixedUuidSeriesSupplier) uuidSupplier).reset();
        repositories.clear();
        // Repositories repositories = new Repositories(personRepository, addressRepository, personAddressRepository, itemRepository, itemOrderRepository, itemOrderLineRepository);
        state.init(uuidSupplier, repositories, IntegrationTestUtils.createMockMvc(wac));
    }

    @Test
    void optimisticLockingVersionNumberIncreasesWithUpdates() {
        when().person_$_is_created_with_first_name_$_and_last_name_$_in_the_database(1, "Frits", "Jansma", "2001-11-23");
        then().that_$_$_has_ID_$(Person.class, 1, "00000000-1111-2222-3333-444444444444");
        then().that_$_with_number_$_has_optimistic_locking_version_number_$(Person.class, 1, 0);
        when().updating_a_person_$_with_first_name_$(1, "Klaas")
                .and()
                .updating_a_person_$_with_date_of_birth_$(1, "1985-01-01");
        then().that_$_with_number_$_has_optimistic_locking_version_number_$(Person.class, 1, 2).and().the_person_with_key_$_has_date_of_birth_$(1, "1985-01-01");
        when().updating_a_person_$_with_first_name_$(1, "Piet");
        then().that_$_with_number_$_has_optimistic_locking_version_number_$(Person.class, 1, 3);
        when().creating_an_address_$_with_data_$_$_$_$_$(1, "NL", "Amsterdam", "1234AA", "Damstraat", "1");
        then().that_$_$_has_ID_$(Address.class, 1, "00000001-1111-2222-3333-444444444444")
                .and().that_$_with_number_$_has_optimistic_locking_version_number_$(Address.class, 1, 0);
        when().updating_an_address_$_with_$_$(1, "postalCode", "1234AB");
        then().that_$_with_number_$_has_optimistic_locking_version_number_$(Address.class, 1, 1);
    }

    @Test
    void personAddressCanBeUsedToLinkAPersonToAnAddress() {
        given().person_$_is_created_with_first_name_$_and_last_name_$_in_the_database(1, "Frits", "Jansma", "2001-11-27")
                .and().creating_an_address_$_with_data_$_$_$_$_$(1, "NL", "Amsterdam", "1234AA", "Damstraat", "1");
        when().a_relation_is_created_$_between_person_$_and_address_$_with_type_$(1, 1, 1, "RESIDENCE")
                .and().a_relation_is_created_$_between_person_$_and_address_$_with_type_$(1, 1, 1, "PROPERTY");
        then().the_person_$_can_be_found_via_address_$_using_postal_code_$_house_number_$_and_person_address_type_$(1, 1, "NL", "1234AA", "1", "RESIDENCE");
        then().the_person_$_can_be_found_via_address_$_using_postal_code_$_house_number_$_and_person_address_type_$(1, 1, "NL", "1234AA", "1", "PROPERTY");
    }

    static class State extends Stage<State> {
        private final SavedEntities savedEntities = new SavedEntities();
        private Repositories repositories;
        private Supplier<UUID> uuidGenerator;
        private MockMvc mockMvc;

        @Hidden
        void init(final Supplier<UUID> uuidGenerator, final Repositories repositories, final MockMvc mockMvc) {
            this.uuidGenerator = uuidGenerator;
            this.repositories = repositories;
            this.mockMvc = mockMvc;
        }

        State person_$_is_created_with_first_name_$_and_last_name_$_in_the_database(
                @Quoted final int number, @Quoted final String nameFirst, @Quoted final String nameLast, @Quoted final String dateOfBirth) {
            final Person person = storeAndReturnPerson(nameFirst, nameLast, LocalDate.parse(dateOfBirth), uuidGenerator, repositories.getPersonRepository());
            this.savedEntities.putPersonId(number, person.getId());
            return self();
        }

        <T> State that_$_$_has_ID_$(final Class<T> entityClass, final int number, @Quoted final String expectedId) {
            switch (entityClass.getSimpleName()) {
                case "Person":
                    final Person person = repositories.getPersonRepository().findById(savedEntities.getPersonId(number)).get();
                    assertThat(this.savedEntities.getPersonId(number)).hasToString(expectedId);
                    break;
                case "Address":
                    final Address address = repositories.getAddressRepository().findById(savedEntities.getAddressId(number)).get();
                    assertThat(this.savedEntities.getAddressId(number)).hasToString(expectedId);
                    break;
                default:
                    throw new IllegalStateException("No clue what to do");
            }
            return self();
        }

        State that_$_with_number_$_has_optimistic_locking_version_number_$(
                final Class<?> entityClass, final int number, @Quoted final int expectedOptLockVersion) {
            assertThat(getEntity(entityClass, number).getEtag()).isEqualTo(expectedOptLockVersion);
            return self();
        }

        PersistableEntityWithTag getEntity(final Class<?> entityClass, final int number) {
            switch (entityClass.getSimpleName()) {
                case "Person":
                    return repositories.getPersonRepository().findById(savedEntities.getPersonId(number)).get();
                case "Address":
                    return repositories.getAddressRepository().findById(savedEntities.getAddressId(number)).get();
                case "PersonAddress":
                    return repositories.getPersonAddressRepository().findById(savedEntities.getPersonAddressId(number)).get();
                default:
                    throw new IllegalStateException("Don't know entity class '" + entityClass.getName() + "'");
            }
        }

        State creating_an_address_$_with_data_$_$_$_$_$(
                final int number,
                @Quoted final String countryCode,
                @Quoted final String city,
                @Quoted final String postalCode,
                @Quoted final String street,
                @Quoted final String houseNumber) {
            final Address address = Address.create(uuidGenerator.get())
                    .setCountryCode(countryCode)
                    .setCity(city)
                    .setPostalCode(postalCode)
                    .setStreet(street)
                    .setHouseNumber(houseNumber)
                    .build();
            this.savedEntities.putAddressId(number, repositories.getAddressRepository().save(address).getId());
            return self();
        }

        State updating_a_person_$_with_first_name_$(@Quoted final int number, @Quoted final String newNameFirst) {
            final Person person = repositories.getPersonRepository().findById(savedEntities.getPersonId(number)).get();
            final PersonName newName = person.getName().modify().setFirst(newNameFirst).build();
            repositories.getPersonRepository().save(person.modify().setName(newName).build());
            return self();
        }

        State updating_a_person_$_with_date_of_birth_$(@Quoted final int personKey, @Quoted final String newDateOfBirth) {
            final Person person = repositories.getPersonRepository().findById(savedEntities.getPersonId(personKey)).get();
            repositories.getPersonRepository().save(person.modify().setDateOfBirth(LocalDate.parse(newDateOfBirth, DateTimeFormatter.ISO_DATE)).build());
            return self();
        }

        State the_person_with_key_$_has_date_of_birth_$(@Quoted final int personKey, @Quoted final String expectedDateOfBirth) {
            final Person person = repositories.getPersonRepository().findById(savedEntities.getPersonId(personKey)).get();
            assertThat(person.getDateOfBirth()).isEqualTo(LocalDate.parse(expectedDateOfBirth, DateTimeFormatter.ISO_DATE));
            return self();
        }

        State updating_an_address_$_with_$_$(@Quoted final int number, @Quoted final String propName, @Quoted final String newValue) {
            final Address address = repositories.getAddressRepository().findById(savedEntities.getAddressId(number)).get();
            switch (propName) {
                case "postalCode":
                    repositories.getAddressRepository().save(address.modify().setPostalCode(newValue).build());
                    break;
                default:
                    throw new IllegalStateException("No clue what to do");
            }
            return self();
        }

        State a_relation_is_created_$_between_person_$_and_address_$_with_type_$(
                @Quoted final int personAddressNumber,
                @Quoted final int personNumber,
                @Quoted final int addressNumber,
                @Quoted final String personAddressType) {
            final PersonAddress.Builder builder = PersonAddress.create(uuidGenerator.get())
                    .setPersonId(savedEntities.getPersonId(personNumber))
                    .setType(PersonAddressType.valueOf(personAddressType))
                    .setAddressId(savedEntities.getAddressId(addressNumber));
            final PersonAddress personAddress = repositories.getPersonAddressRepository().save(builder.build());
            savedEntities.putPersonAddressId(personAddressNumber, personAddress.getId());
            return self();
        }

        State the_person_$_can_be_found_via_address_$_using_postal_code_$_house_number_$_and_person_address_type_$(
                @Quoted final int personNumber,
                @Quoted final int addressNumber,
                @Quoted final String countryCode,
                @Quoted final String postalCode,
                @Quoted final String houseNumber,
                @Quoted final String personAddressType) {
            final Address address = repositories.getAddressRepository().findByCountryCodeAndPostalCodeAndHouseNumber(countryCode, postalCode, houseNumber).get();
            assertThat(savedEntities.getAddressId(addressNumber)).isEqualTo(address.getId());

            final List<PersonAddress> personAddresses = repositories.getPersonAddressRepository()
                    .findByTypeAndAddressId(PersonAddressType.valueOf(personAddressType), address.getId());
            assertThat(personAddresses).hasSize(1);
            final PersonAddress personAddress = personAddresses.get(0);
            final Person person = repositories.getPersonRepository().findById(personAddress.getPersonId()).get();
            assertThat(savedEntities.getPersonId(personNumber)).isEqualTo(person.getId());
            return self();
        }
    }
}
