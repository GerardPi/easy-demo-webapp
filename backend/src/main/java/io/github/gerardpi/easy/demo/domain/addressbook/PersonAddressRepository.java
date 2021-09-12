package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.ExceptionFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.UUID;

public interface PersonAddressRepository extends PagingAndSortingRepository<PersonAddress, UUID> {
    List<PersonAddress> findByAddressId(UUID addressId);

    List<PersonAddress> findByPersonId(UUID personId);

    Page<PersonAddress> findByPersonId(UUID personId, Pageable pageable);

    Page<PersonAddress> findByAddressId(UUID addressId, Pageable pageable);

    List<PersonAddress> findByPersonIdAndAddressId(final UUID personId, UUID addressId);
    Page<PersonAddress> findByPersonIdAndAddressId(final UUID personId, UUID addressId, Pageable pageable);

    Page<PersonAddress> findByTypeAndPersonId(PersonAddressType type, UUID personId, Pageable pageable);

    Page<PersonAddress> findByTypeAndAddressId(PersonAddressType type, UUID addressId, Pageable pageable);

    List<PersonAddress> findByTypeAndAddressId(PersonAddressType type, UUID addressId);

    default PersonAddress getPersonAddressById(final UUID id) {
        return this.findById(id)
                .orElseThrow(() -> ExceptionFactory.ENTITY_NOT_FOUND_BY_ID.apply(id, PersonAddress.class));
    }
}
