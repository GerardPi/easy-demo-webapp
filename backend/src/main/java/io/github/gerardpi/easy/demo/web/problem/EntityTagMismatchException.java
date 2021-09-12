package io.github.gerardpi.easy.demo.web.problem;

public class EntityTagMismatchException extends IllegalArgumentException {
    public EntityTagMismatchException(String message) {
        super(message);
    }
}
