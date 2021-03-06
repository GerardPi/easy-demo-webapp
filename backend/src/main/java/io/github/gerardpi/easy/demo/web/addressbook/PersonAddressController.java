package io.github.gerardpi.easy.demo.web.addressbook;

import io.github.gerardpi.easy.demo.domain.addressbook.PersonAddress;
import io.github.gerardpi.easy.demo.domain.addressbook.PersonAddressRepository;
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

import static io.github.gerardpi.easy.demo.web.EntityControllerUtils.toUri;


@RestController
@RequestMapping(PersonAddressController.URI)
public class PersonAddressController implements EntityController<PersonAddress, PersonAddressDto> {
    public static final String URI = "/api/person-addresses";
    private final Supplier<UUID> uuidSupplier;
    private final Supplier<OffsetDateTime> dateTimeSupplier;
    private final PersonAddressRepository repository;

    public PersonAddressController(final Supplier<UUID> uuidSupplier, Supplier<OffsetDateTime> dateTimeSupplier, final PersonAddressRepository repository) {
        this.uuidSupplier = uuidSupplier;
        this.dateTimeSupplier = dateTimeSupplier;
        this.repository = repository;
    }

    @PostMapping
    public HttpEntity<Void> createOne(@RequestBody final PersonAddressDto dto) {
        final PersonAddress newEntity = dto.toEntity(PersonAddress.create(uuidSupplier.get()).build()).build();
        final PersonAddress savedEntity = repository.save(newEntity);
        return EntityControllerUtils.responseForPost(savedEntity, toUri(URI, savedEntity.getId().toString()));
    }

    /**
     * Note that, if a field is missing from the DTO, that field will not be changed.
     */
    @PatchMapping("/{id}")
    public HttpEntity<Void> partiallyUpdateOne(
            @PathVariable final UUID id,
            @RequestBody final PersonAddressDto dto,
            @RequestHeader(value = HttpHeaders.IF_MATCH) final Integer expectedEtag) {
        final PersonAddress existingEntity = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        EntityControllerUtils.assertEtagEqual(existingEntity, expectedEtag);
        final PersonAddress savedEntity = repository.save(dto.toEntityNotNull(existingEntity).build());
        return EntityControllerUtils.responseForPatch(savedEntity, toUri(URI, savedEntity.getId().toString()));
    }

    /**
     * An update can only be used to overwrite an existing entity.
     * <p>
     * In theory, it could be used to create an entity, but that would imply that the ID is known by the client up-front.
     * Since the ID is always generated server-side, that is not allowed.
     * <p>
     * Using a PUT to replace is idempotent, meaning that after multiple requests, the result is the same.
     */
    @PutMapping("/{id}")
    public HttpEntity<Void> replaceOne(
            @PathVariable final UUID id,
            @RequestBody final PersonAddressDto dto) {
        final PersonAddress replacedEntity = repository.save(dto.toEntity(repository.getPersonAddressById(id)).build());
        return EntityControllerUtils.responseForPut(replacedEntity, toUri(URI, replacedEntity.getId().toString()));
    }

    @GetMapping("/{id}")
    public HttpEntity<PersonAddressDto> getOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) final Optional<String> ifNoneMatchHeader) {
        final PersonAddressDto dto = PersonAddressDto.fromEntity(repository.getPersonAddressById(id)).build();
        EntityControllerUtils.assertEtagDifferent(ifNoneMatchHeader, dto.getEtag(),
                toUri(URI, id.toString()).toString());
        return EntityControllerUtils.responseForGet(dto, dateTimeSupplier);
    }

    @GetMapping
    public Page<PersonAddressDto> getMany(
            @PageableDefault(size = 10, sort = "name.last") final Pageable pageable) {
        return repository.findAll(pageable).map(entity -> PersonAddressDto.fromEntity(entity).build());
    }

    @DeleteMapping("/{id}")
    public HttpEntity<Void> deleteOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_MATCH, required = false) final Integer expectedEtag) {
        final PersonAddress entity = repository.getPersonAddressById(id);
        EntityControllerUtils.assertEtagEqual(entity, expectedEtag);
        repository.delete(entity);
        return EntityControllerUtils.responseForDelete();
    }
}
