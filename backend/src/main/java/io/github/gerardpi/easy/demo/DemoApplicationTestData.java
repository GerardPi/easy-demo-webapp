package io.github.gerardpi.easy.demo;

import io.github.gerardpi.easy.demo.domain.addressbook.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.IntStream;

@Component
public class DemoApplicationTestData {
    private static final Logger LOG = LoggerFactory.getLogger(DemoApplicationTestData.class);

    private final PersonRepository personRepository;
    private final AddressRepository addressRepository;
    private final Supplier<UUID> uuidSupplier;

    public DemoApplicationTestData(PersonRepository personRepository, AddressRepository addressRepository, Environment environment, Supplier<UUID> uuidSupplier) {
        this.personRepository = personRepository;
        this.addressRepository = addressRepository;
        this.uuidSupplier = uuidSupplier;
        boolean populateDatabaseEnabled = environment.getProperty("easy.demo.populatedb.enabled", Boolean.class, false);
        if (populateDatabaseEnabled) {
            populateDatabase();
        }
    }

    private void populateDatabase() {
        long addressCount = addressRepository.count();
        if (addressCount == 0) {
            int requestedCount = 10;
            LOG.info("!!! Populating database with {} addresses", requestedCount);
            populateDatabaseWithAddresses(requestedCount);
        } else {
            LOG.info("!!! Database contains {} addresses", addressCount);
        }
        long personCount = personRepository.count();
        if (personCount == 0) {
            int requestedCount = 10;
            LOG.info("!!! Populating database with {} persons", requestedCount);
            populateDatabaseWithPersons(requestedCount);
        } else {
            LOG.info("!!! Database contains {} persons", personCount);
        }
    }

    private void populateDatabaseWithAddresses(int itemCount) {
        IntStream.range(0, itemCount).forEach(index ->
            addressRepository.save(createTestAddress(index)));
    }
    private void populateDatabaseWithPersons(int itemCount) {
        IntStream.range(0, itemCount).forEach(index ->
                personRepository.save(createTestPerson(index)));
    }

    private Address createTestAddress(int index) {
        return Address.create(uuidSupplier.get())
                .setCountryCode("NL")
                .setCity("testcity" + index)
                .setPostalCode("testpostalCode1" + index)
                .setStreet("teststreet " + index)
                .setHouseNumber("testhn " + index)
                .build();
    }

    private Person createTestPerson(int index) {
        return Person.create(uuidSupplier.get())
                .setName(PersonName.create()
                        .setFirst("testfirst" + index)
                        .setLast("testlast" + index)
                        .build())
                .build();
    }
}
