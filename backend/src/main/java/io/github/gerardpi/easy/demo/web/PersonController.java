package io.github.gerardpi.easy.demo.web;

import io.github.gerardpi.easy.demo.UuidGenerator;
import io.github.gerardpi.easy.demo.domain.addressbook.Person;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonRepository;
import io.github.gerardpi.easy.demo.web.addressbook.PersonDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static io.github.gerardpi.easy.demo.web.ControllerUtils.toUri;


@RestController
@RequestMapping(PersonController.URI)
public class PersonController implements EntityController<Person, PersonDto> {
    public static final String URI = "/api/persons";
    private final UuidGenerator uuidGenerator;
    private final PersonRepository repository;

    public PersonController(final UuidGenerator uuidGenerator, final PersonRepository personRepository) {
        this.uuidGenerator = uuidGenerator;
        this.repository = personRepository;
    }

    @PostMapping
    public HttpEntity<Void> createOne(@RequestBody final PersonDto personDto) {
        final Person updatedEntity = personDto.toEntity(Person.create(uuidGenerator.generate()).build()).build();
        final Person savedEntity = repository.save(updatedEntity);
        return ResponseEntity
                .created(toUri(URI, savedEntity.getId().toString()))
                .eTag("" + savedEntity.getEtag())
                .build();
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
        ControllerUtils.assertEtagEqual(existingPerson, expectedEtag);
        final Person updatedEntity = personDto.toEntityNotNull(existingPerson).build();
        final Person savedEntity = repository.save(updatedEntity);
        return ResponseEntity.ok()
                .eTag("" + savedEntity.getEtag())
                .location(toUri(URI, savedEntity.getId().toString()))
                .build();
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
        return ResponseEntity.ok()
                .eTag("" + savedEntity.getEtag())
                .location(toUri(URI, savedEntity.getId().toString()))
                .build();
    }

    @GetMapping("/{id}")
    public HttpEntity<PersonDto> getOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) final Optional<String> ifNoneMatchHeader) {
        final PersonDto dto = PersonDto.fromEntity(repository.getPersonById(id)).build();
        ControllerUtils.assertEtagDifferent(ifNoneMatchHeader, dto.getEtag(),
                toUri(URI, id.toString()).toString());
        return ControllerUtils.okResponse(dto);
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
        ControllerUtils.assertEtagEqual(entity, expectedEtag);
        repository.delete(entity);
        return ControllerUtils.okNoContent();
    }
}
