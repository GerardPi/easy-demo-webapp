package io.github.gerardpi.easy.demo.web.test;

import io.github.gerardpi.easy.demo.domain.addressbook.Address;
import io.github.gerardpi.easy.demo.domain.test.TestAData;
import io.github.gerardpi.easy.demo.web.DataController;
import io.github.gerardpi.easy.demo.web.EntityControllerUtils;
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

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

import static io.github.gerardpi.easy.demo.web.DataControllerUtils.*;
import static io.github.gerardpi.easy.demo.web.EntityControllerUtils.responseForGet;
import static io.github.gerardpi.easy.demo.web.EntityControllerUtils.responseForPatch;
import static io.github.gerardpi.easy.demo.web.EntityControllerUtils.responseForPut;
import static io.github.gerardpi.easy.demo.web.EntityControllerUtils.toUri;

@RestController
@RequestMapping(TestADataController.URI)
public class TestADataController { //implements DataController<TestADataDto> {
    public static final String URI = "/api/testadata";

    private final Supplier<UUID> uuidSupplier;
    private final Supplier<OffsetDateTime> dateTimeSupplier;
    private final Map<UUID, TestAData> testADatas;

    public TestADataController(final Supplier<UUID> uuidSupplier, Supplier<OffsetDateTime> dateTimeSupplier) {
        this.uuidSupplier = uuidSupplier;
        this.dateTimeSupplier = dateTimeSupplier;
        this.testADatas = new HashMap<>();
    }


    @PostMapping
    public HttpEntity<Void> createOne(@RequestBody final TestADataDto testADataDto) {
        UUID id = uuidSupplier.get();
        TestAData testAData = TestADataMapper.INSTANCE.fromDto(testADataDto);
        testADatas.put(id, testAData);

        return ResponseEntity
                .created(toUri(URI, id.toString()))
                .eTag("" + testAData.getEtag())
                .build();
    }

    /**
     * Note that, if a field is missing from the DTO, it will not be changed.
     */
    @PatchMapping("/{id}")
    public HttpEntity<Void> partiallyUpdateOne(
            @PathVariable final UUID id,
            @RequestBody final TestADataDto dto,
            @RequestHeader(value = HttpHeaders.IF_MATCH) final Integer expectedEtag) {
        final TestAData existingEntity = findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        EntityControllerUtils.assertEtagEqual(existingEntity.getEtag(), expectedEtag, TestAData.class, id);
        final Address savedEntity = null; //testADatas.put(id, TestADataMapper.INSTANCE.).save(dto.toEntityNotNull(existingEntity).build());
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
    public HttpEntity<Void> replaceOne(
            @PathVariable final UUID id,
            @RequestBody final AddressDto addressDto) {
        final Address savedEntity = null; //repository.save(addressDto.toEntity(repository.getAddressById(id)).build());
        return responseForPut(savedEntity, toUri(URI, savedEntity.getId().toString()));
    }

    @GetMapping("/{id}")
    public HttpEntity<TestAData> getOne(
            @PathVariable final UUID id,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) final Optional<String> ifNoneMatchHeader) {
        final AddressDto dto = null; //AddressDto.fromEntity(repository.getAddressById(id)).build();
        EntityControllerUtils.assertEtagDifferent(ifNoneMatchHeader, dto.getEtag(),
                toUri(URI, id.toString()).toString());
        return null; //responseForGet(dto, dateTimeSupplier);
    }

    @GetMapping
    public Page<TestAData> getMany(@PageableDefault(size = 10, sort = {
            Address.PROPNAME_COUNTRYCODE,
            Address.PROPNAME_CITY,
            Address.PROPNAME_STREET,
            Address.PROPNAME_POSTALCODE,
            Address.PROPNAME_HOUSENUMBER}) final Pageable pageable) {
        return null; //repository.findAll(pageable).map(address -> AddressDto.fromEntity(address).build());
    }

    @DeleteMapping("/{id}")
    public HttpEntity<Void> deleteOne(@PathVariable final UUID id, @RequestHeader(value = HttpHeaders.IF_MATCH, required = false) final Integer expectedEtag) {
        TestAData entity = testADatas.get(id);
        EntityControllerUtils.assertEtagEqual(entity.getEtag(), expectedEtag, TestAData.class, id);
        testADatas.remove(id);
        return responseForDelete();
    }

    private Optional<TestAData> findById(UUID id) {
        return Optional.ofNullable(testADatas.get(id));
    }
}
