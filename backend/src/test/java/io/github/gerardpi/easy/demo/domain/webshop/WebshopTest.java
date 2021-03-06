package io.github.gerardpi.easy.demo.domain.webshop;

import com.tngtech.jgiven.Stage;
import com.tngtech.jgiven.annotation.Hidden;
import com.tngtech.jgiven.annotation.Quoted;
import com.tngtech.jgiven.annotation.ScenarioStage;
import com.tngtech.jgiven.junit5.SimpleScenarioTest;
import io.github.gerardpi.easy.demo.*;
import io.github.gerardpi.easy.demo.domain.addressbook.Person;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;


// Allow for overriding beans for testing purposes.
@TestPropertySource(properties = {TestConfig.BEAN_DEF_OVERRIDING_ENABLED})
// Order of configuration classes is important. Some beans are overridden.
@SpringBootTest(classes = {DemoApplication.class, TestConfig.class})
class WebshopTest extends SimpleScenarioTest<WebshopTest.State> {
    private static final Logger LOG = LoggerFactory.getLogger(WebshopTest.class);
    private static final String OFFSET_DATE_TIME_SUFFIX = ".901351+02:00";
    private final Repositories repositories;
    private final Supplier<UUID> uuidSupplier;
    @ScenarioStage
    private State state;

    @Autowired
    WebshopTest(Repositories repositories, Supplier<UUID> uuidGenerator) {
        this.repositories = repositories;
        this.uuidSupplier = uuidGenerator;
    }

    @BeforeEach
    public void init() {
        ((FixedUuidSeriesSupplier) uuidSupplier).reset();
        state.init(uuidSupplier, repositories);
    }

    @Test
    void the_database_contains_orders_for_a_person() {
        final String dateTimeOrder1 = "2021-05-10T18:15:33" + OFFSET_DATE_TIME_SUFFIX;
        final String dateTimeOrder2 = "2021-05-10T19:40:02" + OFFSET_DATE_TIME_SUFFIX;
        given().a_person_$_with_first_name_$_and_last_name_$(1, "A", "B")
                .an_item_$_with_name_$(1, "kaas");
        when()
                .an_order_$_with_date_and_time_$_is_stored_for_person_$(1, dateTimeOrder1, 1)
                .and()
                .that_order_$_contains_$_pieces_of_$_which_cost_$_a_piece(1, 1, 1, new BigDecimal("10.12"))
                .and()
                .an_order_$_with_date_and_time_$_is_stored_for_person_$(2, dateTimeOrder2, 1)
                .and()
                .that_order_$_contains_$_pieces_of_$_which_cost_$_a_piece(2, 1, 2, new BigDecimal("12.73"));
        then().person_$_has_$_orders_with_a_total_amount_of_$(1, 2, new BigDecimal("35.58"))
                .and().the_order_$_has_date_and_time_$(1, dateTimeOrder1)
                .and().the_order_$_has_date_and_time_$(2, dateTimeOrder2);
    }

    static class State extends Stage<State> {
        private final SavedEntities savedEntities = new SavedEntities();
        private Repositories repositories;
        private Supplier<UUID> uuidSupplier;

        @Hidden
        void init(final Supplier<UUID> uuidSupplier, final Repositories repositories) {
            this.uuidSupplier = uuidSupplier;
            this.repositories = repositories;
            repositories.clear();
        }

        State a_person_$_with_first_name_$_and_last_name_$(@Quoted final int number, @Quoted final String nameFirst, @Quoted final String nameLast) {
            final PersonName name = PersonName.create().setFirst(nameFirst).setLast(nameLast).build();
            final Person person = Person.create(uuidSupplier.get())
                    .setDateOfBirth(LocalDate.now())
                    .setName(name)
                    .build();
            this.savedEntities.putPersonId(number, repositories.getPersonRepository().save(person).getId());
            return self();
        }

        State an_item_$_with_name_$(final int itemNumber, @Quoted final String name) {
            final Item item = Item.create(uuidSupplier.get(), "CHS01")
                    .setName(name)
                    .setImageNames(new TreeSet<>())
                    .setAttributes(new TreeMap<>())
                    .setTexts(new TreeMap<>())
                    .build();
            this.savedEntities.putItemId(itemNumber, repositories.getItemRepository().save(item).getId());
            return self();
        }

        State an_order_$_with_date_and_time_$_is_stored_for_person_$(@Quoted final int itemOrderKey, @Quoted final String orderDateTimeStr, final int personKey) {
            final ItemOrder itemOrder = ItemOrder.create(uuidSupplier.get())
                    .setPersonId(this.savedEntities.getPersonId(personKey))
                    .setDateTime(OffsetDateTime.parse(orderDateTimeStr))
                    .build();
            this.savedEntities.putItemOrderId(itemOrderKey, repositories.getItemOrderRepository().save(itemOrder).getId());
            return self();
        }

        State that_order_$_contains_$_pieces_of_$_which_cost_$_a_piece(@Quoted final int itemOrderKey, @Quoted final int itemNumber, @Quoted final int itemCount, @Quoted final BigDecimal amountPerItem) {
            final ItemOrderLine itemOrderLine = ItemOrderLine.create(uuidSupplier.get())
                    .setItemOrderId(savedEntities.getItemOrderId(1))
                    .setItemId(savedEntities.getItemId(itemNumber))
                    .setAmountPerItem(amountPerItem)
                    .setCount(itemCount)
                    .build();
            this.savedEntities.putItemOrderLineId(itemOrderKey, repositories.getItemOrderLineRepository().save(itemOrderLine).getId());
            return self();
        }

        State person_$_has_$_orders_with_a_total_amount_of_$(@Quoted final int personKey, @Quoted final int expectedOrderCount, @Quoted final BigDecimal expectedTotalAmount) {
            final List<ItemOrder> itemOrders = repositories.getItemOrderRepository().findByPersonId(savedEntities.getPersonId(personKey));
            assertThat(itemOrders).hasSize(expectedOrderCount);
            final BigDecimal actualTotalAmount = itemOrders.stream()
                    .map(itemOrder ->
                            repositories.getItemOrderLineRepository().findByItemOrderId(itemOrder.getId()).stream()
                                    .map(orderLine -> orderLine.getAmountPerItem().multiply(new BigDecimal(orderLine.getCount())))
                                    .reduce(BigDecimal.ZERO, BigDecimal::add))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            assertThat(actualTotalAmount).isEqualTo(expectedTotalAmount);
            return self();
        }

        State the_order_$_has_date_and_time_$(@Quoted final int itemOrderKey, @Quoted final String expectedDateTimeOrderStr) {
            final OffsetDateTime expectedDateTime = OffsetDateTime.parse(expectedDateTimeOrderStr);
            final ItemOrder itemOrder = repositories.getItemOrderRepository().findById(savedEntities.getItemOrderId(itemOrderKey)).get();
            assertThat(itemOrder.getDateTime()).isEqualTo(expectedDateTime);
            return self();
        }
    }

}
