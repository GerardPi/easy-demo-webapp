package io.github.gerardpi.easy.demo.web;

import io.github.gerardpi.easy.demo.persistence.EntityDtoWithTag;
import io.github.gerardpi.easy.demo.persistence.PersistableEntityWithTag;
import io.github.gerardpi.easy.demo.web.problem.EntityNotModifiedException;
import io.github.gerardpi.easy.demo.web.problem.EntityTagMismatchException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

public final class DataControllerUtils {
    private DataControllerUtils() {
        // No instantiation allowed/
    }

    public static void assertEtagDifferent(final Optional<String> ifNoneMatchHeader, final String currentEtagValue, final String path) {
        ifNoneMatchHeader.ifPresent(eTag -> {
            if (currentEtagValue.equalsIgnoreCase(eTag)) {
                throw new EntityNotModifiedException("The version " + eTag + " is the current version of " + path);
            }
        });
    }
    public static void assertEtagDifferent(final Optional<String> ifNoneMatchHeader, final String currentEtagValue, final URI uri) {
        ifNoneMatchHeader.ifPresent(eTag -> {
            if (currentEtagValue.equalsIgnoreCase(eTag)) {
                throw new EntityNotModifiedException("The version " + eTag + " is the current version of " + uri);
            }
        });
    }

    public static void assertEtagDifferent(final Optional<String> ifNoneMatchHeader, final int currentEtagValue, final URI uri) {
        assertEtagDifferent(ifNoneMatchHeader, "" + currentEtagValue, uri);
    }

    public static <T extends PersistableEntityWithTag> void assertEtagEqual(final T entity, final String expectedEtagValue) {
        if (entity.getEtag() == null) {
            throw new IllegalStateException("Field " + PersistableEntityWithTag.PROPNAME_ETAG + " was not set. This must never happen!");
        }
        if (!expectedEtagValue.equalsIgnoreCase("" + entity.getEtag())) {
            throw new EntityTagMismatchException("The entity " + entity.getClass().getSimpleName() + " to update with ID " + entity.getId()
                    + " does not have expected etag " + expectedEtagValue
                    + " (actual etag = " + entity.getEtag() + ").");
        }
    }
    public static <T extends PersistableEntityWithTag> void assertEtagEqual(final T entity, final int expectedEtagValue) {
        assertEtagEqual(entity, "" + expectedEtagValue);
    }

    public static <T extends EntityDtoWithTag> HttpEntity<T> okResponse(final T entityDto) {
        return ResponseEntity.ok()
                .cacheControl(cacheForOneMinute())
                .eTag(entityDto.getEtag())
                .lastModified(ZonedDateTime.now())
                .body(entityDto);
    }

    public static HttpEntity<Void> okNoContentResponse() {
        return ResponseEntity.noContent().build();
    }

    public static HttpEntity<Void> responseForDelete() {
        return okNoContentResponse();
    }

    public static <D extends EntityDtoWithTag> HttpEntity<D> okWithCacheControlEtagAndLastModifiedResponse(D dto, Supplier<OffsetDateTime> dateTimeSupplier) {
        return ResponseEntity
                .ok()
                .cacheControl(cacheForOneMinute())
                .eTag(dto.getEtag())
                .lastModified(dateTimeSupplier.get().toZonedDateTime())
                .body(dto);
    }

    public static <D extends EntityDtoWithTag> HttpEntity<D> responseForGet(D dto, Supplier<OffsetDateTime> dateTimeSupplier) {
        return okWithCacheControlEtagAndLastModifiedResponse(dto, dateTimeSupplier);
    }

    public static <E extends PersistableEntityWithTag> HttpEntity<Void> responseForPost(E entity, URI location) {
        return createdResponse(entity, location);
    }

    public static <E extends PersistableEntityWithTag> HttpEntity<Void> responseForPatch(E entity, URI location) {
        return createdResponse(entity, location);
    }

    public static <E extends PersistableEntityWithTag> HttpEntity<Void> createdResponse(E entity, URI location) {
        return ResponseEntity
                .created(location)
                .eTag("" + entity.getEtag())
                .build();
    }

    public static <E extends PersistableEntityWithTag> HttpEntity<Void> responseForPut(E entity, URI location) {
        return okNoContentResponse(entity, location);
    }

    public static <E extends PersistableEntityWithTag> HttpEntity<Void> okNoContentResponse(E entity, URI location) {
        return ResponseEntity.noContent()
                .location(location)
                .eTag("" + entity)
                .build();
    }

    public static CacheControl cacheForOneMinute() {
        return CacheControl.maxAge(1, TimeUnit.MINUTES);
    }

    public static URI toUri(final String... parts) {
        return URI.create(String.join("/", parts));
    }
}
