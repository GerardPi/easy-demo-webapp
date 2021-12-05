package io.github.gerardpi.easy.demo;

import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.function.Function;

public class ExceptionFactory {
    public static final BiFunction<UUID, Class<?>, NoSuchElementException> ENTITY_NOT_FOUND_BY_ID = (id, entityClass) ->
            new NoSuchElementException("No '" + entityClass.getSimpleName() + "' for ID '" + id + "' exists.");

    public static final BiFunction<UUID, UUID, Function<Class<?>, NoSuchElementException>> ENTITY_NOT_FOUND_BY_IDS =
            (id1, id2) -> entityClass ->
                    new NoSuchElementException("No '" + entityClass.getSimpleName() + "' for IDs '" + id1 + "' and '" + id2 + "' exists.");

    public static final BiFunction<Class<?>, String, IllegalArgumentException> INVALID_ARGUMENT = (enumClass, validValuesCSv) ->
            new IllegalArgumentException("Invalid argument. Valid values: '" + validValuesCSv + "'");
    public static final BiFunction<UUID, UUID, Function<Class<?>, IllegalArgumentException>> ENTITY_FOR_IDS_ALREADY_EXISTS =
            (id1, id2) -> entityClass ->
                    new IllegalArgumentException("An '" + entityClass + "' for IDs '" + id1 + "' and '" + id2 + "' was not expected to already exist.");

    private ExceptionFactory() {
        // No instantiation allowed.
    }
}
