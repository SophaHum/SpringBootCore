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
- **Base URL:** `http://localhost:8080/springbootcore`

### 7. API Endpoints

#### User API (`/springbootcore/api/users`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/springbootcore/api/users/` | Create a new user |
| GET | `/springbootcore/api/users/{id}` | Get user by ID |
| PUT | `/springbootcore/api/users/{id}` | Update user by ID |
| DELETE | `/springbootcore/api/users/{id}` | Delete user by ID |

**User Request Body:**

```json
{
  "username": "sopha_hum",
  "fullName": "Sopha Hum",
  "email": "sopha@example.com",
  "password": "securePassword123"
}
```

#### Todo API (`/springbootcore/api/todos`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/springbootcore/api/todos/{userId}` | Get all todos for a user |
| POST | `/springbootcore/api/todos/{userId}` | Create a todo for a user |
| GET | `/springbootcore/api/todos/{id}` | Get todo by ID |
| PUT | `/springbootcore/api/todos/{id}` | Update todo by ID |
| DELETE | `/springbootcore/api/todos/{id}` | Delete todo by ID |

**Todo Request Body:**

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, and bread",
  "created_at": "2026-02-19T10:35:00",
  "updated_at": "2026-02-19T10:35:00"
}
```

### 8. Logging

Application logs are written to a file for easier debugging.

- **File Path:** `logs/application.log`
- **Check Logs (Linux/Terminal):**

  ```sh
  # View the last 100 lines
  tail -n 100 logs/application.log
  ```

- **Follow logs in real-time:**
  ```sh
  tail -f logs/application.log
  ```
- **LogLevel:** Configured via `logging.level.root` or specific packages in `application.properties`.

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

### 14. Database Operations (Docker)

To inspect the database running in Docker, use the following commands:

#### Find the Container
```sh
docker ps | grep postgres
```

#### Access Database via Terminal

```sh
# Enter the container
docker exec -it <container_id_or_name> bash
```

- **Connect to PostgreSQL (Use credentials from compose.yaml):**
  ```sh
  psql -U sopha -d springbootdb
  ```

#### Common psql Commands
- `\l` : List all databases
- `\c <db_name>` : Connect to a specific database
- `\dt` : List all tables in the current database
- `SELECT * FROM users;` : Query all users
- `\q` : Quit psql
- `exit` : Exit container bash

---

## References
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Guides](https://spring.io/guides)
- [Spring Security Docs](https://docs.spring.io/spring-security/reference/index.html)
- [Docker Docs](https://docs.docker.com/)
