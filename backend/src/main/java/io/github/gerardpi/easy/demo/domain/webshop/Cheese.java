package io.github.gerardpi.easy.demo.domain.webshop;


import org.immutables.value.Value;

import java.time.LocalDate;
import java.util.List;

@Value.Immutable
@Value.Style(visibility = Value.Style.ImplementationVisibility.PACKAGE, privateNoargConstructor = true)
public interface Cheese {
    LocalDate getBestBeforeDate();
    String getName();
    int getAgeInWeeks();
    int getFatPercentage();
    List<CheeseQualification> getQualifications();
    class Builder extends ImmutableCheese.Builder {}
}
