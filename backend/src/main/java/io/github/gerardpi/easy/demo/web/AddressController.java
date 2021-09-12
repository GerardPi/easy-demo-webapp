package io.github.gerardpi.easy.demo.web;

import io.github.gerardpi.easy.demo.UuidGenerator;
import io.github.gerardpi.easy.demo.domain.addressbook.Address;
import io.github.gerardpi.easy.demo.domain.addressbook.AddressRepository;
import io.github.gerardpi.easy.demo.web.addressbook.AddressDto;
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
@RequestMapping(AddressController.URI)
public class AddressController implements EntityController<Address, AddressDto> {
    public static final String URI = "/api/addresses";

    private final UuidGenerator uuidGenerator;
    private final AddressRepository repository;

    public AddressController(final UuidGenerator uuidGenerator, final AddressRepository personRepository) {
        this.uuidGenerator = uuidGenerator;
        this.repository = personRepository;
    }

    @PostMapping
    public HttpEntity<Void> createOne(@RequestBody final AddressDto addressDto) {
        final Address savedAddress = repository
                .save(addressDto.toEntity(Address.create(uuidGenerator.generate()).build())
                        .build());
        return ResponseEntity.created(toUri(URI, savedAddress.getId().toString()))
                .eTag("" + savedAddress.getEtag())
                .build();
    }

    /**
     * Note that, if a field is missing from the DTO, it will not be changed.
     */
    @PatchMapping("/{id}")
    public HttpEntity<Void> partiallyUpdateOne(
            @PathVariable final UUID id,
            @RequestBody final AddressDto addressDto,
            @RequestHeader(value = HttpHeaders.IF_MATCH) final Integer expectedEtag) {
        final Address existingEntity = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        ControllerUtils.assertEtagEqual(existingEntity, expectedEtag);
        final Address savedEntity = repository.save(addressDto.toEntityNotNull(existingEntity).build());
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
    public HttpEntity<Void> replaceOne(
            @PathVariable final UUID id,
            @RequestBody final AddressDto addressDto) {
        final Address savedEntity = repository.save(addressDto.toEntity(repository.getAddressById(id)).build());
        return ResponseEntity.ok()
                .eTag("" + savedEntity.getEtag())
                .location(toUri(URI, savedEntity.getId().toString()))
                .build();
    }

    @GetMapping("/{id}")
    public HttpEntity<AddressDto> getOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) final Optional<String> ifNoneMatchHeader) {
        final AddressDto dto = AddressDto.fromEntity(repository.getAddressById(id)).build();
        ControllerUtils.assertEtagDifferent(ifNoneMatchHeader, dto.getEtag(),
                toUri(URI, id.toString()).toString());
        return ControllerUtils.okResponse(dto);
    }

    @GetMapping
    public Page<AddressDto> getMany(@PageableDefault(size = 10, sort = {
            Address.PROPNAME_COUNTRYCODE,
            Address.PROPNAME_CITY,
            Address.PROPNAME_STREET,
            Address.PROPNAME_POSTALCODE,
            Address.PROPNAME_HOUSENUMBER}) final Pageable pageable) {
        return repository.findAll(pageable).map(address -> AddressDto.fromEntity(address).build());
    }

    @DeleteMapping("/{id}")
    public HttpEntity<Void> deleteOne(@PathVariable final UUID id, @RequestHeader(value = HttpHeaders.IF_MATCH, required = false) final Integer expectedEtag) {
        final Address entity = repository.getAddressById(id);
        ControllerUtils.assertEtagEqual(entity, expectedEtag);
        repository.delete(entity);
        return ControllerUtils.okNoContent();
    }
}
