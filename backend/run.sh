#!/bin/sh

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Deasy.demo.cors.enabled=true -Deasy.demo.security.enabled=false"
