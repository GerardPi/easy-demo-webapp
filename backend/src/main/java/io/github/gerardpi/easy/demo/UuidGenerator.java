package io.github.gerardpi.easy.demo;

import java.util.UUID;

@FunctionalInterface
public interface UuidGenerator {
    UUID generate();
}
