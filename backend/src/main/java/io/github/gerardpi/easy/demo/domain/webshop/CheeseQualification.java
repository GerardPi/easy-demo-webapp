package io.github.gerardpi.easy.demo.domain.webshop;

import org.immutables.value.Value;

@Value.Immutable
@Value.Style(visibility = Value.Style.ImplementationVisibility.PACKAGE, privateNoargConstructor = true)
public interface CheeseQualification {
    String getText();
    class Builder extends ImmutableCheeseQualification.Builder {}
}
