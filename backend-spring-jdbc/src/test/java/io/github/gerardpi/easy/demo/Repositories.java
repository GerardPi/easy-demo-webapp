package io.github.gerardpi.easy.demo;

import io.github.gerardpi.easy.demo.domain.addressbook.AddressRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * This is a convenience clato hold all the repositories in this test environment.
 */
@Component
public class Repositories {
    private final AddressRepository addressRepository;

    public Repositories(
            final AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public AddressRepository getAddressRepository() {
        return addressRepository;
    }

    public void clear() {
        this.addressRepository.deleteAll();
    }

    @SuppressWarnings("unchecked")
    public <T extends Object> Optional<T> fetchEntity(final Class<T> entityClass, final UUID id) {
        switch (entityClass.getSimpleName()) {
            case "Address":
                return (Optional<T>) addressRepository.findById(id);
            default:
                throw new IllegalStateException("Don't know entity class '" + entityClass.getName() + "'");
        }
    }

    public <T extends Object> Object getEntity(final Class<T> entityClass, final UUID id) {
        return fetchEntity(entityClass, id).orElseThrow(() -> new IllegalArgumentException("Could not find entity " + entityClass.getName() + " with id '" + id + "'"));
    }
}
