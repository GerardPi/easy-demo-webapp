package io.github.gerardpi.easy.demo.domain.webshop;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.UUID;

public interface ItemOrderLineRepository extends PagingAndSortingRepository<ItemOrderLine, UUID> {
    List<ItemOrderLine> findByItemOrderId(UUID orderId);
}
