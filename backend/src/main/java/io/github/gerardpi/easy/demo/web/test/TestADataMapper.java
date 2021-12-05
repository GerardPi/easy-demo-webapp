package io.github.gerardpi.easy.demo.web.test;

import io.github.gerardpi.easy.demo.domain.test.TestAData;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TestADataMapper {
    TestAData fromDto(TestADataDto dto);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_DEFAULT)
    TestAData fromDtoNotNull(TestADataDto dto);
    TestADataDto toDto(TestAData testAData);
    TestADataMapper INSTANCE = Mappers.getMapper(TestADataMapper.class);
}
