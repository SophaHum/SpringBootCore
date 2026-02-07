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
    image: "postgres:latest"
    environment:
      - "POSTGRES_DB=springbootdb"
      - "POSTGRES_PASSWORD=passwordSopha123"
      - "POSTGRES_USER=sopha"
    ports:
      - "5431:5432"
```

- Start the database:
  ```sh
  docker compose up -d
  ```

### 5. Configure Spring Boot for Database
- See `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5431/springbootdb
spring.datasource.username=sopha
spring.datasource.password=passwordSopha123
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.flyway.enabled=true
logging.file.name=logs/application.log
```

- Use Flyway for DB migrations (place SQL files in `src/main/resources/db/migration`).

### 6. Run the Application
- The application is configured to run with Maven:
  ```sh
  mvn spring-boot:run
  ```
- The application will start on port 8080.

### 7. API Endpoints
- **GET /**: Returns a greeting message ("Hello, Spring Boot! from Sopha").

### 8. Logging
- Application logs are written to a file for easier debugging:
  - **File:** `logs/application.log`
  - This file captures startup info, errors, and standard output.

### 9. Code Readability & Reusability
- Use meaningful class/method/variable names.
- Apply SOLID principles.
- Use Lombok to reduce boilerplate.
- Modularize code (utility classes, service layers).
- Write Javadoc and comments where necessary.

### 10. Performance Best Practices
- Use pagination for large DB queries.
- Use indexes in the database.
- Avoid N+1 query problems (use fetch joins or `@EntityGraph`).
- Profile and monitor with Spring Actuator.

### 11. Security Best Practices
- Use Spring Security for authentication/authorization.
- Store secrets (DB passwords, tokens) securely (environment variables, not in code).
- Validate and sanitize all user inputs.
- Use HTTPS in production.

### 12. Testing
- Write unit and integration tests (Spring Boot Test, Mockito).
- Use test containers for DB integration tests.

### 13. Documentation & Maintenance
- Document your API (Swagger/OpenAPI).
- Keep dependencies up to date.
- Regularly review code for improvements.

---

## References
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Guides](https://spring.io/guides)
- [Spring Security Docs](https://docs.spring.io/spring-security/reference/index.html)
- [Docker Docs](https://docs.docker.com/)
