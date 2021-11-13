#!/bin/sh


echo "## Dependencies updates ##"
mvn versions:display-dependency-updates

echo "## Plugin updates ##"
mvn versions:display-plugin-updates

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Deasy.demo.cors.enabled=true -Deasy.demo.security.enabled=false -Deasy.demo.populatedb.enabled=true"
