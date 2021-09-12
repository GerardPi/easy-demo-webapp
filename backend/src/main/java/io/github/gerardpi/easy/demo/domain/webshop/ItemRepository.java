package io.github.gerardpi.easy.demo.domain.webshop;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.UUID;

public interface ItemRepository extends PagingAndSortingRepository<Item, UUID> {
}
