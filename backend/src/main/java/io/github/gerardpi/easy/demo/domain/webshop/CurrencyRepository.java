package io.github.gerardpi.easy.demo.domain.webshop;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;
import java.util.UUID;

public interface CurrencyRepository extends PagingAndSortingRepository<io.github.gerardpi.easy.demo.domain.webshop.Currency, UUID> {
    Optional<Currency> findByCode(String code);
}
