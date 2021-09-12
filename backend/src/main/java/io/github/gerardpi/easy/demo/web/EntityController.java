package io.github.gerardpi.easy.demo.web;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpEntity;

import java.util.Optional;
import java.util.UUID;

public interface EntityController<E, D> {
    HttpEntity<Void> createOne(final D personDto);

    HttpEntity<Void> partiallyUpdateOne(final UUID id, final D dto, final Integer expectedEtag);

    HttpEntity<Void> replaceOne(final UUID id, final D dto);

    HttpEntity<D> getOne(final UUID id, final Optional<String> ifNoneMatchHeader);

    Page<D> getMany(@PageableDefault final Pageable pageable);

    HttpEntity<Void> deleteOne(final UUID id, final Integer expectedEtag);
}
