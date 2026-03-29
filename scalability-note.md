# Scalability Note

This document outlines the architectural evolutions required to scale this application from a simplified prototype to an enterprise-grade, high-availability service.

## 1. Database & Persistence Layer
Currently, the application uses **SQLite**, which is excellent for rapid prototyping and review processes. For a production environment:
- **Migration to PostgreSQL:** Move to a distributed relational database like PostgreSQL or AWS Aurora to handle concurrent connections and ACID transactions effectively.
- **Connection Pooling:** Implement tools like PgBouncer or Prisma Accelerate to handle a massive influx of TCP connections.
- **Read Replicas:** If the application becomes read-heavy (e.g., retrieving tasks), implement read replicas to offload queries from the primary write database.

## 2. API & Caching Layer (Redis)
- **Token Blacklisting / Session Management:** Currently, JWTs are stateless. Integrating **Redis** would allow for immediate token revoking and session active state management.
- **Data Caching:** Frequently accessed, non-volatile data (like Task Categories or Public Lists) should be cached in Redis with a TTL to reduce database load.

## 3. Microservices Architecture
While the current setup is a Monolith (Node.js/Express), scaling development teams and services requires splitting:
- **Auth Service:** An isolated service handling OAuth, JWTs, and AuthN/AuthZ.
- **Task/Entity Service:** A domain-driven service responsible strictly for Task mutations.
- **Notification Service (New):** An asynchronous worker service consuming from a message broker (RabbitMQ/Kafka) to send emails or push notifications without blocking the API Event Loop.

## 4. Deployment & Infrastructure
- **Containerization (Docker):** Standardize environments across Dev, Staging, and Production by containerizing both the Node.js backend and building the React app into NGINX containers.
- **Kubernetes (K8s):** For dynamic scaling, deploying the containers to a Kubernetes cluster ensuring auto-scaling horizontally based on CPU/Memory usage.
- **Load Balancing:** Place an Application Load Balancer (ALB) or NGINX proxy in front of the application instances to distribute incoming HTTP traffic evenly.
- **Rate Limiting:** Implement rate limiters (e.g., via Redis or API Gateway) to protect against DDoS attacks and brute-force login attempts.

## 5. Security & Observability
- **Centralized Logging:** Implement ELK stack (Elasticsearch, Logstash, Kibana) or Datadog to aggregate cross-service logs.
- **APM:** Use Application Performance Monitoring (New Relic or Datadog) to identify slow database queries and memory leaks.
