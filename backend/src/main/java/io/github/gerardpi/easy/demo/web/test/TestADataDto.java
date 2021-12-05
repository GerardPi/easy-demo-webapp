package io.github.gerardpi.easy.demo.web.test;

import org.immutables.value.Value;

import java.time.LocalDate;

@Value.Immutable
@Value.Style(visibility = Value.Style.ImplementationVisibility.PACKAGE)
public interface TestADataDto {
    int getEtag();
    LocalDate getBestBeforeDate();

    String getName();

    int getSize();

    class Builder extends ImmutableTestADataDto.Builder {
    }
}
