package io.github.gerardpi.easy.demo.persistence;

import io.github.gerardpi.easy.demo.domain.webshop.AttributeJsonConverter;
import com.fasterxml.jackson.databind.type.TypeFactory;

import javax.persistence.Converter;
import java.util.SortedSet;

@Converter
public class SortedStringSetConverter extends AttributeJsonConverter<SortedSet<String>> {
    public SortedStringSetConverter() {
        super(TypeFactory.defaultInstance().constructCollectionType(SortedSet.class, String.class));
    }
}
