<div align="center">
  
# ☕ Cafe Management System
**A highly robust, decoupled full-stack application built with Java 21, Spring Boot, and Vanilla JS.**

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

</div>

---

## 📖 Overview

The Cafe Management System is an end-to-end web application designed to handle operations for a modern cafe. It provides dedicated interfaces for **Staff** (to process orders and manage order statuses) and **Admins** (to manage the menu and configuration).

The backend is engineered with a strict adherence to **Onion Architecture** and **SOLID principles**, demonstrating enterprise-grade design patterns, decoupled business logic, and stateless security. The frontend is built completely from scratch using **Vanilla JS, HTML5, and Custom CSS variables**, showcasing a deep understanding of core web technologies without relying on heavy frameworks.

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Secure, stateless authentication using JSON Web Tokens (JWT). Distinct roles for `ADMIN` and `STAFF`.
- **Admin Dashboard:** Full CRUD operations for managing Menu Items.
- **Staff POS System:** Interactive grid menu and cart system for taking orders. Real-time subtotal calculations.
- **Order Lifecycle Management:** Track orders from `PENDING` -> `PREPARING` -> `READY` -> `DELIVERED`.
- **Dynamic Pricing Engine:** Strategy pattern implementation allowing dynamic pricing (e.g., *Regular* vs *Happy Hour*).
- **High Performance:** In-memory caching using **Caffeine** for blazing-fast menu retrieval.
- **Dockerized:** Fully containerized multi-tier setup using `docker-compose`.

---

## 🏗️ Architecture & Design Patterns

The backend strictly follows **Onion Architecture** (Clean Architecture). The core domain knows nothing about databases, web frameworks, or security. All dependencies point inward.

### Layers:
1. **Domain (`com.cafe.domain`)**: Pure Java. Contains Entities, Enums, and Repository/Strategy Interfaces.
2. **Application (`com.cafe.application`)**: Orchestrates use cases. Contains Services, DTOs, Mappers, and Factories.
3. **Infrastructure (`com.cafe.infrastructure`)**: Framework specifics. Contains Spring Data JPA, JWT Security, Caching, and SQLite adapters.
4. **Presentation (`com.cafe.controller`)**: REST APIs and Global Exception Handling.

### Design Patterns Utilized:
- **Strategy Pattern:** `PricingStrategy` allows seamless switching between pricing algorithms at runtime.
- **Factory Pattern:** `OrderFactory` encapsulates the complex logic of validating items, calculating subtotals, and assembling `Order` entities.
- **Observer Pattern:** Spring `ApplicationEventPublisher` decouples order status changes from side-effects (like logging or potential WebSocket notifications).
- **Adapter Pattern:** `MenuItemRepositoryAdapter` bridges pure Domain interfaces to Spring Data JPA repositories (Dependency Inversion).

---

## 🛠️ Technology Stack

**Backend:**
- Java 21
- Spring Boot 3.x
- Spring Security (JWT)
- Spring Data JPA / Hibernate
- Caffeine Cache
- SQLite

**Frontend:**
- Vanilla JavaScript (ES6+)
- Semantic HTML5
- Custom CSS (CSS Variables, Flexbox/Grid, Glassmorphism)
- Native `fetch` API for REST communication

**DevOps & Testing:**
- Docker & Docker Compose
- Maven

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- *Or* Java 21, Maven, and Node.js (for local execution)

### Option 1: Run with Docker (Recommended)
1. Clone the repository.
2. Run the multi-container setup:
   ```bash
   docker-compose up --build
   ```
3. Access the frontend at: `http://localhost:3000`
4. The backend API runs at: `http://localhost:8080`

### Option 2: Run Locally (Without Docker)
**Backend:**
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```
**Frontend:**
```bash
cd frontend
npm install
node server.js
```


## 📚 Extensive Documentation

For an in-depth dive into the architecture, design decisions, and code structure, please refer to the `docs/` directory:

1. [`01_Architecture_and_Overview.md`](docs/01_Architecture_and_Overview.md)
2. [`02_Domain_Layer.md`](docs/02_Domain_Layer.md)
3. [`03_Application_Layer.md`](docs/03_Application_Layer.md)
4. [`04_Infrastructure_Layer.md`](docs/04_Infrastructure_Layer.md)
5. [`05_Presentation_Layer.md`](docs/05_Presentation_Layer.md)
6. [`06_Frontend_Architecture.md`](docs/06_Frontend_Architecture.md)
7. [`07_Interview_Cheat_Sheet.md`](docs/07_Interview_Cheat_Sheet.md)

---
