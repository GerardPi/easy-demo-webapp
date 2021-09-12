package io.github.gerardpi.easy.demo.domain.webshop;

import com.fasterxml.jackson.databind.type.TypeFactory;

import javax.persistence.Converter;
import java.util.SortedMap;

@Converter
public class AttributeKeyToStringMapConverter extends AttributeJsonConverter<SortedMap<ItemAttributeKey, String>> {
    public AttributeKeyToStringMapConverter() {
        super(TypeFactory.defaultInstance()
                .constructMapType(SortedMap.class, ItemAttributeKey.class, String.class));
    }
}
