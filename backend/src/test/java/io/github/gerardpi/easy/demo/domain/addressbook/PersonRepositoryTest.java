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
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;

// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class PersonRepositoryTest {
    private final Repositories repositories;
    private final Supplier<UUID> uuidSupplier;

    @Autowired
    PersonRepositoryTest(Repositories repositories, Supplier<UUID> uuidSupplier) {
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
        PersonName personName = PersonName.create()
                .setLast("Pietersen").build();
        Person person1 = Person.create(uuidSupplier.get())
                .setName(personName)
                .setDateOfBirth(LocalDate.of(1973, 2, 2))
                .build();
        Person person2 = Person.create(uuidSupplier.get())
                .setName(personName)
                .setDateOfBirth(LocalDate.of(1958, 1, 1))
                .build();
        Person person3 = Person.create(uuidSupplier.get())
                .setName(personName)
                .setDateOfBirth(LocalDate.of(1997, 8, 1))
                .build();
        // When
        repositories.getPersonRepository().save(person1);
        repositories.getPersonRepository().save(person2);
        repositories.getPersonRepository().save(person3);
        // Then
        assertThat(repositories.getPersonRepository().findAll()).hasSize(3);
    }
}
