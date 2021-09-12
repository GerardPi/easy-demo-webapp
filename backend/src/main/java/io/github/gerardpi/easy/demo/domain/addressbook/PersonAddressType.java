package io.github.gerardpi.easy.demo.domain.addressbook;

import com.google.common.base.Strings;
import io.github.gerardpi.easy.demo.ExceptionFactory;

import java.util.Optional;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum PersonAddressType {
    RESIDENCE,
    PROPERTY;
    private static final String VALID_VALUES = Stream.of(values()).map(Enum::name).collect(Collectors.joining(", "));

    public static Optional<PersonAddressType> fromString(String string) {
        if (Strings.isNullOrEmpty(string)) {
            return Optional.empty();
        }
        SortedSet<PersonAddressType> values = Stream.of(values()).collect(Collectors.toCollection(TreeSet::new));
        return Optional.of(values.stream()
                .filter(type -> type.name().equalsIgnoreCase(string))
                .findAny()
                .orElseThrow(() -> ExceptionFactory.INVALID_ARGUMENT.apply(PersonAddressType.class, VALID_VALUES)));
    }
}
