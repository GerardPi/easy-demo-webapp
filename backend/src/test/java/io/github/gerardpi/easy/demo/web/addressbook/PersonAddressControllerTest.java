package io.github.gerardpi.easy.demo.web.addressbook;

import com.google.common.collect.ImmutableMap;
import com.tngtech.jgiven.Stage;
import com.tngtech.jgiven.annotation.Format;
import com.tngtech.jgiven.annotation.Hidden;
import com.tngtech.jgiven.annotation.Quoted;
import com.tngtech.jgiven.annotation.ScenarioStage;
import com.tngtech.jgiven.junit5.SimpleScenarioTest;
import io.github.gerardpi.easy.demo.*;
import io.github.gerardpi.easy.demo.domain.addressbook.Address;
import io.github.gerardpi.easy.demo.domain.addressbook.Person;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonAddressType;
import io.github.gerardpi.easy.demo.json.ObjectMapperHolder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.function.Supplier;

import static io.github.gerardpi.easy.demo.TestFunctions.storeAndReturnPerson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class PersonAddressControllerTest extends SimpleScenarioTest<PersonAddressControllerTest.State> {
    private static final Logger LOG = LoggerFactory.getLogger(PersonAddressControllerTest.class);
    private final SavedEntities savedEntities;
    private final Supplier<UUID> uuidSupplier;
    private final Repositories repositories;
    private final Supplier<OffsetDateTime> testDateTimeSupplier;
    private final WebApplicationContext wac;

    @ScenarioStage
    private State state;

    @Autowired
    PersonAddressControllerTest(Supplier<UUID> uuidSupplier, Repositories repositories, Supplier<OffsetDateTime> testDateTimeSupplier, WebApplicationContext wac) {
        this.savedEntities = new SavedEntities();
        this.uuidSupplier = uuidSupplier;
        this.repositories = repositories;
        this.testDateTimeSupplier = testDateTimeSupplier;
        this.wac = wac;
    }

    @BeforeEach
    public void init() {
        ((FixedUuidSeriesSupplier) uuidSupplier).reset();
        repositories.clear();
        state.init(uuidSupplier, repositories, new MockMvcExecutor(wac), savedEntities,
                (TestDateTimeSupplier) testDateTimeSupplier);
    }

    @Test
    void get_persons_addresses() {
        given()
                .person_$_is_stored_in_the_database_with_first_name_$_and_last_name_$_and_date_of_birth_$_in_the_database(
                        1, "Frits", "Jansma", "2001-11-23")
                .and()
                .person_$_is_stored_in_the_database_with_first_name_$_and_last_name_$_and_date_of_birth_$_in_the_database(
                        2, "Albert", "Fles", "2002-11-24")
                .and()
                .an_address_$_is_stored_in_the_database_with_values_$(1,
                        AddressDto.create()
                                .setCountryCode("NL")
                                .setCity("Amsterdam")
                                .setStreet("Alkmaarstraat")
                                .setPostalCode("1010AA")
                                .setHouseNumber("1a")
                                .build())
                .and()
                .an_address_$_is_stored_in_the_database_with_values_$(1,
                        AddressDto.create()
                                .setCountryCode("NL")
                                .setCity("Amsterdam")
                                .setStreet("Alblasserdamstraat")
                                .setPostalCode("1010AA")
                                .setHouseNumber("1b")
                                .build());

        when().an_HTTP_$_on_$_is_performed("GET", "/api/persons");
        then().the_HTTP_status_code_is_$(HttpStatus.OK)
                .and().the_number_of_items_received_is_$(2);
        when().an_HTTP_$_on_$_is_performed("GET", "/api/addresses");
        then().the_HTTP_status_code_is_$(HttpStatus.OK)
                .and().the_number_of_items_received_is_$(2);
        when().an_HTTP_$_on_$_with_the_id_for_entity_$_is_performed("GET", "/api/persons/", 1);
        when().an_HTTP_$_on_$_is_performed_with_body_$("POST", "/api/person-addresses",
                ObjectMapperHolder.getIntance().toJson(PersonAddressDto.create()
                                .setAddressId(savedEntities.getAddressId(1))
                                .setPersonId(savedEntities.getPersonId(1))
                                .setDescription("this is where the person lived")
                                .setFromDate(LocalDate.of(1994, 1, 1))
                                .setThruDate(LocalDate.of(2013, 8, 12))
                                .setType(PersonAddressType.RESIDENCE)
                        .build()));
        then().the_HTTP_status_code_is_$(HttpStatus.CREATED)
                .and().the_location_in_the_response_is_$("/api/person-addresses/00000004-1111-2222-3333-444444444444")
                .and().the_etag_in_the_response_is_$("0");
    }

//    @Test
//    void post_person() {
//        when().an_HTTP_$_on_$_is_performed_with_body_$("POST", "/api/persons",
//                ObjectMapperHolder.getIntance().toJson(
//                        PersonDto.create()
//                                .setName(PersonName.create()
//                                        .setFirst("first")
//                                        .setLast("last")
//                                        .build())
//                                .setDateOfBirth(LocalDate.of(1998, 10, 22))
//                                .build()));
//        then().the_HTTP_status_code_is_$(HttpStatus.OK)
//                .and().no_exception_was_thrown();
//    }


    static class State extends Stage<State> {
        private SavedEntities savedEntities;
        private MockMvcExecutor mockMvcExecutor;
        private Supplier<UUID> uuidGenerator;
        private Repositories repositories;
        private Exception exception;
        private ResultActions resultActions;
        private TestDateTimeSupplier testDateTimeSupplier;

        private static MockMvc createMockMvc(final Object controller, final String uri) {
            return MockMvcBuilders.standaloneSetup(controller)
                    .defaultRequest(get(uri).accept(MediaType.APPLICATION_JSON))
                    .alwaysExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                    .build();
        }

        @Hidden
        void init(final Supplier<UUID> uuidGenerator,
                  final Repositories repositories,
                  final MockMvcExecutor mockMvcExecutor,
                  final SavedEntities savedEntities,
                  final TestDateTimeSupplier testDateTimeSupplier) {
            this.savedEntities = savedEntities;
            this.repositories = repositories;
            this.uuidGenerator = uuidGenerator;
            this.mockMvcExecutor = mockMvcExecutor;
            this.testDateTimeSupplier = testDateTimeSupplier;
        }

        State person_$_is_stored_in_the_database_with_first_name_$_and_last_name_$_and_date_of_birth_$_in_the_database(
                @Quoted final int testId, @Quoted final String nameFirst, @Quoted final String nameLast, @Quoted final String dateOfBirth) {
            final Person person = storeAndReturnPerson(nameFirst, nameLast, LocalDate.parse(dateOfBirth), uuidGenerator, repositories.getPersonRepository());
            this.savedEntities.putPersonId(testId, person.getId());
            return self();
        }

        State an_address_$_is_stored_in_the_database_with_values_$(@Quoted final int testId, @Quoted final AddressDto addressDto) {
            Address storedAddress = repositories.getAddressRepository().save(
                    addressDto.toEntity(Address.create(uuidGenerator.get()).build())
                            .build());
            this.savedEntities.putAddressId(testId, storedAddress.getId());
            return self();
        }

        State an_HTTP_$_on_$_is_performed(@Quoted final String httpMethod, @Quoted final String uri) {
            this.resultActions = mockMvcExecutor.executeHttpRequest(httpMethod, uri);
            return self();
        }

        State an_HTTP_$_on_$_with_the_id_for_entity_$_is_performed(@Quoted final String httpMethod, @Quoted final String uri, @Quoted final int testId) {
            an_HTTP_$_on_$_with_the_id_for_entity_with_id_$_is_performed(httpMethod, uri, savedEntities.getPersonId(testId).toString());
            return self();
        }

        State an_HTTP_$_on_$_with_the_id_for_entity_with_id_$_is_performed(@Quoted final String httpMethod, @Quoted final String uri, @Quoted final String id) {
            this.resultActions = mockMvcExecutor.executeHttpRequest(httpMethod, uri + "/" + id);
            return self();
        }

        State the_HTTP_status_code_is_$(@Quoted final HttpStatus httpStatus) {
            assertThat(resultActions).isNotNull();
            assertThat(resultActions.andReturn().getResponse().getStatus()).isEqualTo(httpStatus.value());
            return self();
        }

        State the_response_contains_header_$_with_value_$(@Quoted String expectedHeader, @Quoted String expectedHeaderValue) {
            assertThat(resultActions.andReturn().getResponse().getHeader(expectedHeader.toString())).isEqualTo(expectedHeaderValue);
            return self();
        }

        State the_location_in_the_response_is_$(@Quoted String expectedLocation) {
            return the_response_contains_header_$_with_value_$(HttpHeaders.LOCATION, expectedLocation);
        }

        State the_etag_in_the_response_is_$(@Quoted String expectedEtag) {
            assertThat(resultActions.andReturn().getResponse().getHeader(HttpHeaders.ETAG)).isEqualTo("\"" + expectedEtag + "\"");
            return self();
        }

        State no_exception_was_thrown() {
            assertThat(this.exception).isNull();
            return self();
        }

        State in_the_response_$_is_equal_to_$(@Quoted final String jsonPath, @Quoted final String expectedValue) {
            try {
                resultActions.andExpect(jsonPath(jsonPath, is(expectedValue)));
            } catch (final Exception e) {
                LOG.info("Caught exception '{}': '{}'" + e.getClass().getName(), e.getMessage());
                this.exception = e;
            }

            return self();
        }

        State the_number_of_items_received_is_$(final int expectedSize) {
            try {
                resultActions
                        .andExpect(jsonPath("$.content").isArray())
                        .andExpect(jsonPath("$.content", hasSize(expectedSize))
                        );
            } catch (final Exception e) {
                LOG.info("Caught exception '{}': '{}'" + e.getClass().getName(), e.getMessage());
                this.exception = e;
            }
            return self();
        }

        State an_HTTP_$_on_$_is_performed_with_body_$(@Quoted final String httpMethod, @Quoted final String uri, @Format(JgivenJsonPrettyFormatter.class) final String personDtoJson) {
            //this.resultActions = mockMvcExecutor.executeHttpRequest(httpMethod, uri, personDtoJson);
            this.resultActions = mockMvcExecutor.executeHttpRequest(httpMethod, uri,
                    ImmutableMap.of(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE),
                    personDtoJson);
            return self();
        }

        State the_response_contains_body_equals_$(@Format(JgivenJsonPrettyFormatter.class) final String expectedJson) {
            try {
                assertThat(this.resultActions.andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8))
                        .isEqualTo(expectedJson);
            } catch (final UnsupportedEncodingException e) {
                LOG.info("Caught exception '{}': '{}'" + e.getClass().getName(), e.getMessage());
                this.exception = e;
            }
            return self();
        }

        State the_the_current_date_and_time_is_$(@Quoted final OffsetDateTime givenDateTime) {
            testDateTimeSupplier.fixDateTime(givenDateTime);
            return self();
        }

        State the_the_current_date_and_time_is_$(final String givenDateTime) {
            testDateTimeSupplier.fixDateTime(OffsetDateTime.parse(givenDateTime));
            return self();
        }

    }
}
