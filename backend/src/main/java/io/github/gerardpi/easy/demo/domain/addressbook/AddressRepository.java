package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.ExceptionFactory;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AddressRepository extends PagingAndSortingRepository<Address, UUID> {
    Optional<Address> findByCountryCodeAndPostalCodeAndHouseNumber(String contryCode, String postalCode, String houseNumber);

    default Address getAddressById(final UUID id) {
        return this.findById(id)
                .orElseThrow(() -> ExceptionFactory.ENTITY_NOT_FOUND_BY_ID.apply(id, Address.class));
    }
}
