# 1st stage: build with Maven
FROM maven:3.9-eclipse-temurin-24 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 2nd stage: run the app
FROM eclipse-temurin:24-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
