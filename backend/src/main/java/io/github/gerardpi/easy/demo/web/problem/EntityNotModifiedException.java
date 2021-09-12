package io.github.gerardpi.easy.demo.web.problem;

public class EntityNotModifiedException extends IllegalArgumentException {
    public EntityNotModifiedException(String message) {
        super(message);
    }
}
