package io.github.gerardpi.easy.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.jdbc.core.convert.DataAccessStrategy;
import org.springframework.data.jdbc.core.convert.JdbcConverter;
import org.springframework.data.jdbc.core.convert.JdbcCustomConversions;
import org.springframework.data.jdbc.core.convert.RelationResolver;
import org.springframework.data.jdbc.core.mapping.JdbcMappingContext;
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration;
import org.springframework.data.relational.core.dialect.Dialect;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;

@Configuration
public class ImmutablesJdbcConfiguration extends AbstractJdbcConfiguration {
    private final ResourceLoader resourceLoader;

    public ImmutablesJdbcConfiguration(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Override
    public JdbcConverter jdbcConverter(
            JdbcMappingContext mappingContext,
            NamedParameterJdbcOperations operations,
            RelationResolver relationResolver,
            JdbcCustomConversions conversions, Dialect dialect) {
        return new ImmutablesJdbcConverter(mappingContext, operations, relationResolver, conversions, dialect, resourceLoader);
    }

    /**
     * <pre>
     * Note: Without @Lazy this is the error message:
     *
     * The dependencies of some of the beans in the application context form a cycle:
     *
     * repositories defined in file [/home/gjpiek/code/easy-demo-webapp/backend-spring-jdbc/target/test-classes/io/github/gerardpi/easy/demo/Repositories.class]
     *            ↓
     * addressRepository
     * ┌─────┐
     * |  jdbcConverter defined in class path resource [io/github/gerardpi/easy/demo/ImmutablesJdbcConfiguration.class]
     * ↑     ↓
     * |  dataAccessStrategyBean defined in class path resource [io/github/gerardpi/easy/demo/ImmutablesJdbcConfiguration.class]
     * └─────┘
     *
     *
     * Action:
     *    Relying upon circular references is discouraged and they are prohibited by default. Update your application to remove the dependency cycle between beans. As a last resort, it may be possible to break the cycle automatically by setting spring.main.allow-circular-references to true.
     * </pre>
     */
    @Override
    public DataAccessStrategy dataAccessStrategyBean(
            NamedParameterJdbcOperations operations,
            @Lazy JdbcConverter jdbcConverter,
            JdbcMappingContext context,
            Dialect dialect) {
        return super.dataAccessStrategyBean(operations, jdbcConverter, context, dialect);
    }
}
