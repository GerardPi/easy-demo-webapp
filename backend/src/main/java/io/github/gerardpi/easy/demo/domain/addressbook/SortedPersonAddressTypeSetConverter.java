package io.github.gerardpi.easy.demo.domain.addressbook;

import io.github.gerardpi.easy.demo.domain.webshop.AttributeJsonConverter;
import com.fasterxml.jackson.databind.type.TypeFactory;

import javax.persistence.Converter;
import java.util.SortedSet;

@Converter
public class SortedPersonAddressTypeSetConverter extends AttributeJsonConverter<SortedSet<PersonAddressType>> {
    public SortedPersonAddressTypeSetConverter() {
        super(TypeFactory.defaultInstance().constructCollectionType(SortedSet.class, PersonAddressType.class));
    }
}
