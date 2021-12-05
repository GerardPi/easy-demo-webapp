package io.github.gerardpi.easy.demo.domain.addressbook;

import org.immutables.value.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.lang.Nullable;
import org.springframework.lang.NonNull;

import java.util.UUID;
// This @Table annotation is required because Spring Data JDBC will derive the
// table name from the implementation class name which is ImmutableAddress.
@Table("ADDRESS")
@Value.Immutable
@Value.Style(visibility = Value.Style.ImplementationVisibility.PACKAGE)
public interface Address {
  @NonNull
  @Id
  UUID getId();
  @Nullable
  @Version
  Integer getEtag();
  @Nullable String getCountryCode();
  @Nullable String getCity();
  @NonNull String getPostalCode();
  @Nullable String getStreet();
  @NonNull String getHouseNumber();
  class Builder extends ImmutableAddress.Builder {
  }
  static Address.Builder create(UUID id) {
    return new Address.Builder().id(id);
  }
  default Address.Builder modify() {
    return new Address.Builder()
            .id(this.getId())
            .etag(this.getEtag())
            .countryCode(this.getCountryCode())
            .city(this.getCity())
            .postalCode(this.getPostalCode())
            .street(this.getStreet())
            .houseNumber(this.getHouseNumber());
  }
}
