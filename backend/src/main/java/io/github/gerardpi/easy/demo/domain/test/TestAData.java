package io.github.gerardpi.easy.demo.domain.test;

import org.immutables.value.Value;
import java.time.LocalDate;

@Value.Immutable
@Value.Style(visibility = Value.Style.ImplementationVisibility.PACKAGE)
public interface TestAData {
    int getEtag();
    LocalDate getBestBeforeDate();

    String getName();

    int getSize();

    class Builder extends ImmutableTestAData.Builder {
    }
}
