package io.github.gerardpi.easy.demo.web.addressbook;

import io.github.gerardpi.easy.demo.domain.addressbook.Person;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonRepository;
import io.github.gerardpi.easy.demo.web.EntityControllerUtils;
import io.github.gerardpi.easy.demo.web.EntityController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

import static io.github.gerardpi.easy.demo.web.EntityControllerUtils.*;


@RestController
@RequestMapping(PersonController.URI)
public class PersonController implements EntityController<Person, PersonDto> {
    public static final String URI = "/api/persons";
    private final Supplier<UUID> uuidSupplier;
    private final Supplier<OffsetDateTime> dateTimeSupplier;
    private final PersonRepository repository;

    public PersonController(final Supplier<UUID> uuidSupplier, Supplier<OffsetDateTime> dateTimeSupplier, final PersonRepository personRepository) {
        this.uuidSupplier = uuidSupplier;
        this.dateTimeSupplier = dateTimeSupplier;
        this.repository = personRepository;
    }

    @PostMapping
    public HttpEntity<Void> createOne(@RequestBody final PersonDto personDto) {
        final Person updatedEntity = personDto.toEntity(Person.create(uuidSupplier.get()).build()).build();
        final Person savedEntity = repository.save(updatedEntity);
        return responseForPost(savedEntity, toUri(URI, savedEntity.getId().toString()));
    }

    /**
     * Note that, if a field is missing from the DTO, it will not be changed.
     */
    @PatchMapping("/{id}")
    public HttpEntity<Void> partiallyUpdateOne(
            @PathVariable final UUID id,
            @RequestBody final PersonDto personDto,
            @RequestHeader(value = HttpHeaders.IF_MATCH) final Integer expectedEtag) {

        final Person existingPerson = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        EntityControllerUtils.assertEtagEqual(existingPerson, expectedEtag);
        final Person updatedEntity = personDto.toEntityNotNull(existingPerson).build();
        final Person savedEntity = repository.save(updatedEntity);
        return responseForPatch(savedEntity, toUri(URI, savedEntity.getId().toString()));
    }

    /**
     * An update can only be used to overwrite an existing entity.
     * <p>
     * In theory, it could be used to create an entity, but that would imply that the ID is known by the client up-front.
     * Since the ID is always generated server-side, that is not allowed.
     * <p>
     * Using a PUT to replace is idempotent, meaning that all fields will be overwritten.
     */
    @PutMapping("/{id}")
    public HttpEntity<Void> replaceOne(@PathVariable final UUID id, @RequestBody final PersonDto personDto) {
        final Person savedEntity = repository.save(personDto.toEntity(repository.getPersonById(id)).build());
        return responseForPut(savedEntity, toUri(URI, savedEntity.getId().toString()));
    }

    @GetMapping("/{id}")
    public HttpEntity<PersonDto> getOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) final Optional<String> ifNoneMatchHeader) {
        final PersonDto dto = PersonDto.fromEntity(repository.getPersonById(id)).build();
        EntityControllerUtils.assertEtagDifferent(ifNoneMatchHeader, dto.getEtag(),
                toUri(URI, id.toString()).toString());
        return responseForGet(dto, dateTimeSupplier);
    }

    @GetMapping
    public Page<PersonDto> getMany(@PageableDefault(size = 10, sort = "name.last") final Pageable pageable) {
        return repository.findAll(pageable).map(person -> PersonDto.fromEntity(person).build());
    }

    @DeleteMapping
    public HttpEntity<Void> deleteOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_MATCH, required = false) final Integer expectedEtag) {
        final Person entity = repository.getPersonById(id);
        EntityControllerUtils.assertEtagEqual(entity, expectedEtag);
        repository.delete(entity);
        return EntityControllerUtils.responseForDelete();
    }
}
