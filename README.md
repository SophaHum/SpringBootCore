# SpringBootCore Project

## Overview
A demo project for practicing with Spring Boot, Docker, database integration, and best practices for code readability, reusability, performance, and security.

---

## Step-by-Step Setup Guide

### 1. Set Up Your Development Environment
- Install Java 21
- Install Docker Desktop for Windows
- Install an IDE (e.g., IntelliJ IDEA, VS Code)
- Install Maven (or use the provided wrapper)

### 2. Initialize the Project
- This project is already initialized with Spring Boot and required dependencies (see `pom.xml`).

### 3. Version Control
- Use Git for version control
- Add a `.gitignore` file (see [Java.gitignore](https://github.com/github/gitignore/blob/main/Java.gitignore))

### 4. Configure Database with Docker
- The provided `compose.yaml` sets up a PostgreSQL database:

```yaml
services:
  postgres:
    image: 'postgres:latest'
    environment:
      - 'POSTGRES_DB=springbootdb'
      - 'POSTGRES_PASSWORD=pa$$w0rd'
      - 'POSTGRES_USER=sopha'
    ports:
      - '5431:5432'
```

- Start the database:
  ```sh
  docker compose up -d
  ```

### 5. Configure Spring Boot for Database
- See `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:postgresql://localhost:5431/springbootdb
spring.datasource.username=user
spring.datasource.password=pa$$w0rd
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.flyway.enabled=true
```

- Use Flyway for DB migrations (place SQL files in `src/main/resources/db/migration`).

### 6. Build Your Application
- Create entities, repositories, services, and controllers.
- Use `@Service`, `@Repository`, `@Controller` for separation of concerns.
- Use DTOs for API communication.

### 7. Code Readability & Reusability
- Use meaningful class/method/variable names.
- Apply SOLID principles.
- Use Lombok to reduce boilerplate.
- Modularize code (utility classes, service layers).
- Write Javadoc and comments where necessary.

### 8. Performance Best Practices
- Use pagination for large DB queries.
- Use indexes in the database.
- Avoid N+1 query problems (use fetch joins or `@EntityGraph`).
- Profile and monitor with Spring Actuator.

### 9. Security Best Practices
- Use Spring Security for authentication/authorization.
- Store secrets (DB passwords, tokens) securely (environment variables, not in code).
- Validate and sanitize all user inputs.
- Use HTTPS in production.

### 10. Testing
- Write unit and integration tests (Spring Boot Test, Mockito).
- Use test containers for DB integration tests.

### 11. Dockerize Your Application
- Example Dockerfile:

```dockerfile
FROM eclipse-temurin:21-jre
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

- Build and run your app with Docker:
  ```sh
  mvn clean package
  docker build -t my-spring-app .
  docker run --network="host" my-spring-app
  ```

### 12. Documentation & Maintenance
- Document your API (Swagger/OpenAPI).
- Keep dependencies up to date.
- Regularly review code for improvements.

---

## References
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Guides](https://spring.io/guides)
- [Spring Security Docs](https://docs.spring.io/spring-security/reference/index.html)
- [Docker Docs](https://docs.docker.com/)
