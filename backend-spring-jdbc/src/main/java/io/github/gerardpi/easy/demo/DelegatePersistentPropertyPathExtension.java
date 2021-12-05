package io.github.gerardpi.easy.demo;

import org.springframework.data.mapping.PersistentPropertyPath;
import org.springframework.data.mapping.context.MappingContext;
import org.springframework.data.relational.core.mapping.PersistentPropertyPathExtension;
import org.springframework.data.relational.core.mapping.RelationalPersistentEntity;
import org.springframework.data.relational.core.mapping.RelationalPersistentProperty;

public class DelegatePersistentPropertyPathExtension extends PersistentPropertyPathExtension {
    private final RelationalPersistentEntity<?> leafEntity;

    public DelegatePersistentPropertyPathExtension(
            MappingContext<? extends RelationalPersistentEntity<?>, ? extends RelationalPersistentProperty> mappingContext,
            PersistentPropertyPath<? extends RelationalPersistentProperty> path,
            RelationalPersistentEntity<?> leafEntity) {

        super(mappingContext, path);
        this.leafEntity = leafEntity;
    }

    @Override
    public RelationalPersistentEntity<?> getLeafEntity() {
        return leafEntity;
    }
}
