package io.github.gerardpi.easy.demo;

import io.github.gerardpi.easy.demo.domain.webshop.Cheese;
import io.github.gerardpi.easy.demo.domain.webshop.CheeseQualification;
import io.github.gerardpi.easy.demo.json.ObjectMapperHolder;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

class ImmutableTest {
    @Test
    void test() {
        Cheese kaas = new Cheese.Builder()
                .name("Emmenthaler")
                .ageInWeeks(2)
                .fatPercentage(3)
                .bestBeforeDate(LocalDate.of(2022, 1, 1))
                .addQualifications(new CheeseQualification.Builder().text("really gross").build())
                .addQualifications(new CheeseQualification.Builder().text("rather lovely").build())
                .build();
        System.out.println(kaas);
        System.out.println(kaas.getQualifications().hashCode());
        Cheese fatterCheese = new Cheese.Builder()
                .from(kaas)
                .fatPercentage(4)
                .build();
        System.out.println(fatterCheese);
        System.out.println(fatterCheese.getQualifications().hashCode());
        Cheese betterCheese = new Cheese.Builder()
                .from(fatterCheese)
                .addQualifications(new CheeseQualification.Builder()
                        .text("best buy")
                        .build())
                .build();
        System.out.println(betterCheese);
        System.out.println(betterCheese.getQualifications().hashCode());
        System.out.printf("json betterCheese=" + ObjectMapperHolder.getIntance().toJson(betterCheese));
    }
}
