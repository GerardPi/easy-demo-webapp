package io.github.gerardpi.easy.demo;


import io.github.gerardpi.easy.demo.domain.addressbook.Person;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonName;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonRepository;

import java.time.LocalDate;
import java.util.UUID;
import java.util.function.Supplier;

public final class TestFunctions {

    private TestFunctions() {
        // No instantation allowed.
    }

    public static Person storeAndReturnPerson(final String nameFirst, final String nameLast, final LocalDate dateOfBirth, final Supplier<UUID> uuidSupplier, final PersonRepository personRepository) {
        final PersonName name = PersonName.create().setFirst(nameFirst).setLast(nameLast).build();
        final Person person = Person.create(uuidSupplier.get())
                .setDateOfBirth(dateOfBirth)
                .setName(name)
                .build();
        return personRepository.save(person);
    }

    public static boolean matchesOrDoesNotMatch(final String isOrIsNotEqual) {
        return textToBoolean("matches", "does not match", isOrIsNotEqual);
    }

    private static boolean textToBoolean(final String trueText, final String falseText, final String textToCheck) {
        if (trueText.equals(textToCheck)) {
            return true;
        }
        if (falseText.equals(textToCheck)) {
            return false;
        }
        throw new IllegalArgumentException("Invalid value '" + textToCheck + "'. Must be either '" + trueText + "' (=true) or '" + falseText + "' (=false).");
    }
}
