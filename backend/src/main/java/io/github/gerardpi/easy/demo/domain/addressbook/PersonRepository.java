package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.ExceptionFactory;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PersonRepository extends PagingAndSortingRepository<Person, UUID> {
    default Person getPersonById(final UUID id) {
        return this.findById(id)
                .orElseThrow(() -> ExceptionFactory.ENTITY_NOT_FOUND_BY_ID.apply(id, Person.class));
    }
}
