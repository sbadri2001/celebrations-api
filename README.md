You can use the following as a `docs/architecture-overview.md` in your repository.

# Celebrations Platform – Architecture Overview

## Overview

Celebrations is a scalable event and team management platform designed to organize recurring celebrations, tournaments, sports, cultural events, and community activities. The platform enables administrators to manage editions, teams, events, schedules, results, media, voting, subscriptions, and leaderboards while providing participants with a modern web experience.

The solution is built using a cloud-native, micro-frontend and microservice-inspired architecture that emphasizes scalability, maintainability, security, and independent feature evolution.

---

## Architecture Principles

* Domain-driven modular design
* API-first development
* Micro-frontend ready architecture
* Secure JWT-based authentication
* Stateless backend services
* Event-driven extensibility
* Cloud-native deployment model
* Infrastructure-as-code friendly
* CI/CD ready

---

## High-Level Architecture

```text
┌─────────────────────────────────────────────┐
│                 Browser                      │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│          Next.js Host Shell (BFF)           │
│---------------------------------------------│
│ Authentication                              │
│ Layout & Navigation                         │
│ API Gateway / Route Handlers                │
│ Shared Design System                        │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│             NestJS Backend APIs             │
├─────────────────────────────────────────────┤
│ Auth Module                                 │
│ Users Module                                │
│ Teams Module                                │
│ Events Module                               │
│ Results Module                              │
│ Leaderboard Module                          │
│ Media Module                                │
└─────────────────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
 PostgreSQL       Redis         MinIO/S3
 Persistence      Cache         Media Storage
```

---

## Frontend Architecture

### Technology Stack

* Next.js 15+
* React 19
* TypeScript
* Tailwind CSS
* TanStack Query
* Zustand
* Module Federation (future)
* Storybook

### Frontend Responsibilities

* Authentication and session management
* Team management UI
* Event scheduling and registration
* Results and leaderboard visualization
* Media gallery and voting experience
* Responsive and accessible user interfaces

### Future Micro Frontends

```text
host-shell
├── mfe-auth
├── mfe-teams
├── mfe-events
├── mfe-results
├── mfe-leaderboard
└── mfe-media
```

Each micro frontend can be independently developed, deployed, and versioned while sharing a common design system and authentication layer.

---

## Backend Architecture

### Technology Stack

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger/OpenAPI
* Redis
* MinIO

### Core Modules

#### Auth Module

Handles registration, login, refresh tokens, JWT generation, and authorization.

#### Users Module

User profile management and account operations.

#### Teams Module

Team creation, membership management, captains, vice captains, and team administration.

#### Events Module

Event scheduling, categorization, venue management, subscriptions, and participation.

#### Results Module

Result submission, validation, and point allocation.

#### Leaderboard Module

Aggregate scoring and ranking across teams and categories.

#### Media Module

Photo uploads, videos, team introductions, and gallery management.

---

## Data Architecture

### Primary Database

PostgreSQL serves as the system of record.

Core entities include:

* User
* Team
* TeamMember
* Edition
* Category
* Event
* Result
* Media
* Vote
* RefreshToken

### Relationships

```text
Edition
 ├── Teams
 ├── Categories
 └── Events

Team
 ├── Members
 ├── Media
 └── Results

Event
 ├── Results
 └── Subscriptions
```

---

## Security Model

### Authentication

* JWT Access Token
* Refresh Token Rotation
* BCrypt Password Hashing
* Stateless API Authentication

### Authorization

Platform Roles:

* ADMIN
* USER

Team Roles:

* MEMBER
* VICE_CAPTAIN
* CAPTAIN
* TEAM_ADMIN

### Security Controls

* Route Guards
* Role Guards
* Input Validation
* DTO Enforcement
* Secure Password Storage
* HttpOnly Refresh Tokens
* Helmet Security Headers

---

## Caching Strategy

### Redis

Used for:

* Leaderboard caching
* Frequently accessed event data
* Team statistics
* Session-related metadata

Cache invalidation occurs automatically when results, teams, or events change.

---

## Media Storage

### MinIO (Local Development)

Stores:

* Team logos
* Team introduction videos
* Event photos
* Event videos

### S3 Compatible Production Storage

The storage layer can be replaced with AWS S3, Azure Blob Storage, or Google Cloud Storage without application changes.

---

## Deployment Strategy

### Development

```text
Next.js
NestJS
PostgreSQL (Docker)
Redis (Docker)
MinIO (Docker)
```

### Production

```text
Load Balancer
       │
 ┌─────┴─────┐
 │ Next.js   │
 │ NestJS    │
 └─────┬─────┘
       │
 PostgreSQL
 Redis
 Object Storage
```

---

## Future Enhancements

* RabbitMQ Event Processing
* Real-time Notifications
* Live Scoring
* WebSocket Event Updates
* Mobile Applications
* AI-Based Event Insights
* Multi-Tenant Support
* Kubernetes Deployment
* Observability with Prometheus and Grafana

---

## Repository Goal

This repository demonstrates enterprise-grade frontend and backend architecture practices, including modular domain design, secure authentication, scalable APIs, micro-frontend readiness, and cloud-native deployment patterns through a real-world celebrations and event management platform.
