package io.github.gerardpi.easy.demo.domain.test;

import io.github.gerardpi.easy.demo.json.ObjectMapperHolder;

import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;

class TestATest {
    @org.junit.jupiter.api.Test
    void test() {
        TestAData testAData1 = new TestAData.Builder()
                .name("Emmenthaler")
                .bestBeforeDate(LocalDate.of(2022, 1, 1))
                .size(10)
                .build();
        assertThat(testAData1.toString()).isEqualTo(
                "TestAData{bestBeforeDate=2022-01-01, name=Emmenthaler, size=10}");
        TestAData testAData2 = new TestAData.Builder()
                .from(testAData1)
                .size(4)
                .build();
        assertThat(testAData2.toString()).isEqualTo(
                "TestAData{bestBeforeDate=2022-01-01, name=Emmenthaler, size=4}");
        TestAData testAData3 = new TestAData.Builder()
                .from(testAData2)
                .size(3)
                .build();
        assertThat(testAData3.toString()).isEqualTo(
            "TestAData{bestBeforeDate=2022-01-01, name=Emmenthaler, size=3}");
    }
}
