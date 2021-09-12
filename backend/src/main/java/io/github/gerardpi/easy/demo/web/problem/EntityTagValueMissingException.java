package io.github.gerardpi.easy.demo.web.problem;

public class EntityTagValueMissingException extends IllegalArgumentException {
    public EntityTagValueMissingException(String message) {
        super(message);
    }
}
