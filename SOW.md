# Statement of Work (SoW)

## Breakdown Assistance & Spare Parts Marketplace

**Document Version:** 1.0
**Date:** February 24, 2026
**Project Code:** REPAIR-ASSIST

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature List](#2-feature-list)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Dependencies](#7-dependencies)
8. [Mobile Applications](#8-mobile-applications)
9. [API Design](#9-api-design)
10. [Security & Compliance](#10-security--compliance)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Testing Strategy](#12-testing-strategy)
13. [Project Phases & Milestones](#13-project-phases--milestones)

---

## 1. Executive Summary

**Repair Assist** is a comprehensive on-demand roadside assistance and spare parts marketplace platform. It connects stranded vehicle owners (riders) with verified nearby mechanics for emergency breakdown support, while also enabling local workshops to list and sell used, refurbished, and surplus spare parts.

The platform comprises:
- **Web Application** (Next.js) — Admin dashboard, workshop inventory management, analytics
- **Mobile Applications** (React Native) — Rider app, Mechanic app
- **Backend Services** — API gateway, real-time dispatch, payment processing, notification engine

### Key Value Propositions
- Real-time GPS-based mechanic discovery and dispatch
- Transparent pricing with digital invoicing (GST compliant)
- Integrated spare parts marketplace with escrow-based transactions
- Trust system with dual ratings, KYC verification, and fraud detection
- Scalable architecture supporting future IoT and AI integrations

---

## 2. Feature List

### 2.1 Emergency Breakdown Support (On-Demand Roadside Assistance)

| # | Feature | Priority |
|---|---------|----------|
| 1 | Real-time breakdown request with live GPS location capture | P0 |
| 2 | Auto-detection of nearest available verified mechanic | P0 |
| 3 | Option for rider to manually select preferred mechanic (rating, distance, response time) | P1 |
| 4 | Instant job notification to nearby mechanics with accept/decline window | P0 |
| 5 | Live ETA tracking of mechanic en route | P0 |
| 6 | In-app masked calling/chat between rider and mechanic | P1 |
| 7 | Emergency priority tagging (accident, engine failure, electrical fault, puncture, etc.) | P0 |
| 8 | Digital job summary with photos of issue and repair completed | P1 |
| 9 | Transparent on-spot pricing estimation before work begins | P0 |

### 2.2 Mechanic Onboarding & Verification

| # | Feature | Priority |
|---|---------|----------|
| 1 | Mechanic self-registration with OTP login | P0 |
| 2 | KYC verification (Aadhaar, PAN, Trade License where applicable) | P0 |
| 3 | Skill tagging (2-wheeler, 4-wheeler, EV, diesel, battery specialist, etc.) | P0 |
| 4 | Service coverage radius selection | P1 |
| 5 | Emergency availability toggle (Online / Offline / Busy) | P0 |
| 6 | Admin approval workflow | P0 |
| 7 | Performance score tracking (response time, resolution rate, ratings) | P1 |

### 2.3 Smart Location & Dispatch Engine

| # | Feature | Priority |
|---|---------|----------|
| 1 | GPS-based mechanic discovery within configurable radius | P0 |
| 2 | Intelligent dispatch algorithm (nearest + highest rating + availability weightage) | P0 |
| 3 | Load balancing to prevent over-allocation to same mechanic | P1 |
| 4 | Heatmap view for high breakdown zones (Admin dashboard) | P2 |
| 5 | Offline caching for low-network areas | P1 |

### 2.4 Used & Spare Parts Marketplace

| # | Feature | Priority |
|---|---------|----------|
| 1 | Workshop inventory listings (used, refurbished, new surplus stock) | P0 |
| 2 | Part categorization (vehicle type > brand > model > component type) | P0 |
| 3 | Condition tagging (Used-Good / Refurbished / Like New / OEM Surplus) | P0 |
| 4 | Real images upload with condition notes | P1 |
| 5 | Discounted pricing display vs estimated market price | P1 |
| 6 | Stock quantity management per workshop | P0 |
| 7 | Search by part name, vehicle model, or compatibility | P0 |
| 8 | Filter by distance, price range, and condition | P1 |

### 2.5 Instant Part Request (From Breakdown Screen)

| # | Feature | Priority |
|---|---------|----------|
| 1 | Rider can request required part directly from nearby listed inventory | P1 |
| 2 | Mechanic can recommend part from marketplace within job flow | P1 |
| 3 | In-app purchase or reserve-for-pickup option | P1 |
| 4 | Delivery coordination (mechanic pickup / workshop delivery - configurable) | P2 |
| 5 | Escrow-based payment hold until part confirmation | P1 |

### 2.6 Pricing & Payments

| # | Feature | Priority |
|---|---------|----------|
| 1 | Transparent labor + part cost breakdown | P0 |
| 2 | Dynamic pricing (late night / emergency surcharge - optional) | P2 |
| 3 | Digital invoice generation with GST | P0 |
| 4 | Wallet, UPI, Card, COD options | P0 |
| 5 | Commission auto-calculation for platform | P0 |
| 6 | Refund & dispute management system | P1 |

### 2.7 Ratings, Trust & Quality Control

| # | Feature | Priority |
|---|---------|----------|
| 1 | Dual rating system (Mechanic rating + Workshop/part seller rating) | P0 |
| 2 | Return/Replacement window for listed parts (configurable by seller) | P1 |
| 3 | Fraud detection triggers (excessive cancellation, abnormal pricing, duplicates) | P1 |
| 4 | Warranty tagging for replaced parts (if applicable) | P2 |

### 2.8 Admin Controls

| # | Feature | Priority |
|---|---------|----------|
| 1 | Approve/reject mechanic and workshop registrations | P0 |
| 2 | Monitor breakdown frequency by geography | P1 |
| 3 | Inventory moderation & suspicious listing review | P1 |
| 4 | Commission configuration (service vs part sale) | P0 |
| 5 | Dispute resolution panel | P1 |
| 6 | Analytics dashboard (breakdown types, response time, part demand trends) | P1 |

### 2.9 Future Extensions (Scalable Enhancements)

| # | Feature | Priority |
|---|---------|----------|
| 1 | AI-based failure prediction suggestions (recurring issues) | P3 |
| 2 | EV-specific roadside battery swap module | P3 |
| 3 | Fleet subscription plans for delivery companies | P3 |
| 4 | API integration for insurance roadside assistance partnerships | P3 |
| 5 | IoT-triggered automatic breakdown alert from connected vehicles | P3 |

---

## 3. Tech Stack

### 3.1 Frontend (Web)

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** (App Router) | Web framework - SSR, routing, API routes |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Accessible, customizable UI component library |
| **ReactBits** (reactbits.dev) | Advanced animations and interactive effects |
| **Zustand** | Lightweight client-side state management |
| **React Query (TanStack)** | Server state management, caching |
| **React Hook Form + Zod** | Form handling and validation |
| **Socket.io Client** | Real-time communication |
| **Mapbox GL JS / Google Maps** | Map rendering and geolocation |
| **Recharts** | Charts and analytics visualization |

### 3.2 Mobile Applications

| Technology | Purpose |
|-----------|---------|
| **React Native** (with Expo) | Cross-platform mobile development |
| **React Navigation** | Mobile navigation |
| **NativeWind** | Tailwind CSS for React Native |
| **React Native Maps** | Native map components |
| **Expo Location** | GPS and geofencing |
| **Expo Camera** | Photo capture for job documentation |
| **Expo Notifications** | Push notifications |
| **React Native Reanimated** | Smooth animations |

### 3.3 Backend

| Technology | Purpose |
|-----------|---------|
| **Node.js** (v20 LTS) | Runtime |
| **Next.js API Routes** | REST API (web-facing endpoints) |
| **Express.js / Fastify** | Standalone microservices (dispatch, payments) |
| **Socket.io** | Real-time bi-directional communication |
| **Bull / BullMQ** | Job queue for async tasks (notifications, reports) |
| **Redis** | Caching, session store, pub/sub, geospatial queries |
| **Prisma ORM** | Database access and migrations |

### 3.4 Database

| Technology | Purpose |
|-----------|---------|
| **PostgreSQL 16** | Primary relational database |
| **PostGIS Extension** | Geospatial queries (mechanic discovery by radius) |
| **Redis** | Caching layer, real-time location store |
| **AWS S3 / Cloudinary** | Image and document storage |

### 3.5 Third-Party Services

| Service | Purpose |
|---------|---------|
| **Razorpay** | Payment gateway (UPI, cards, wallets, COD) |
| **Twilio / Exotel** | Masked calling, SMS, OTP |
| **Firebase Cloud Messaging** | Push notifications |
| **Google Maps Platform** | Geocoding, directions, ETA calculation |
| **DigiLocker / KYC Provider** | Aadhaar/PAN verification |
| **SendGrid / AWS SES** | Transactional emails |
| **Sentry** | Error monitoring |

### 3.6 DevOps & Infrastructure

| Technology | Purpose |
|-----------|---------|
| **Vercel** | Web app hosting, edge functions, CI/CD |
| **AWS (EC2/ECS/Lambda)** | Microservices hosting, background jobs |
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD pipelines |
| **Terraform** | Infrastructure as code |
| **Nginx** | Reverse proxy, load balancing |
| **Prometheus + Grafana** | Monitoring and alerting |

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │  Rider App   │  │ Mechanic App │  │   Web Dashboard          │   │
│  │ (React Native│  │ (React Native│  │   (Next.js)              │   │
│  │  + Expo)     │  │  + Expo)     │  │   Admin / Workshop Panel │   │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘   │
│         │                  │                       │                  │
└─────────┼──────────────────┼───────────────────────┼─────────────────┘
          │                  │                       │
          ▼                  ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / EDGE                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │   Vercel Edge Functions / Next.js API Routes                 │    │
│  │   - Authentication & Authorization (JWT + Refresh Tokens)    │    │
│  │   - Rate Limiting                                            │    │
│  │   - Request Validation                                       │    │
│  │   - API Versioning                                           │    │
│  └──────────────────────────┬───────────────────────────────────┘    │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                                   │
│                                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐     │
│  │   Auth     │ │  Breakdown │ │ Marketplace│ │   Payment    │     │
│  │  Service   │ │  & Dispatch│ │  Service   │ │   Service    │     │
│  │            │ │  Service   │ │            │ │              │     │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └──────┬───────┘     │
│        │               │              │               │              │
│  ┌─────┴──────┐ ┌──────┴─────┐ ┌─────┴──────┐ ┌──────┴───────┐     │
│  │Notification│ │  Location  │ │   Rating   │ │   Admin      │     │
│  │  Service   │ │  Service   │ │  Service   │ │   Service    │     │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘     │
│                                                                      │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                      │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ PostgreSQL   │  │    Redis     │  │    S3 / Cloudinary       │   │
│  │ + PostGIS    │  │  (Cache +    │  │    (Images, Docs)        │   │
│  │ (Primary DB) │  │   Geo + PubSub│ │                          │   │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Real-Time Communication Architecture

```
┌──────────┐     WebSocket      ┌──────────────┐     Redis PubSub    ┌──────────────┐
│  Rider   │◄──────────────────►│  Socket.io   │◄───────────────────►│  Dispatch    │
│   App    │                    │   Server     │                     │   Engine     │
└──────────┘                    └──────┬───────┘                     └──────────────┘
                                       │
┌──────────┐     WebSocket             │
│ Mechanic │◄──────────────────────────┘
│   App    │
└──────────┘
```

### 4.3 Dispatch Algorithm Flow

```
Breakdown Request
       │
       ▼
┌──────────────────┐
│ Capture GPS Loc  │
│ + Emergency Type │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌─────────────────┐
│ Query Redis for  │────►│ PostGIS Radius  │
│ Online Mechanics │     │ Query (5-15 km) │
└────────┬─────────┘     └─────────────────┘
         │
         ▼
┌──────────────────┐
│ Scoring Engine   │
│ ─────────────────│
│ Distance    (40%)│
│ Rating      (30%)│
│ Response    (20%)│
│ Load Balance(10%)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send Notification│
│ to Top 3-5       │
│ Mechanics        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐    Timeout (60s)    ┌──────────────────┐
│ Wait for Accept  │───────────────────►│ Expand Radius    │
│                  │                     │ + Retry Next Batch│
└────────┬─────────┘                     └──────────────────┘
         │ Accept
         ▼
┌──────────────────┐
│ Assign Job       │
│ Start ETA Track  │
└──────────────────┘
```

---

## 5. Database Architecture

### 5.1 Entity Relationship Diagram

```
┌───────────────┐       ┌──────────────────┐       ┌─────────────────┐
│    users      │       │    mechanics      │       │   workshops     │
├───────────────┤       ├──────────────────┤       ├─────────────────┤
│ id (PK)       │       │ id (PK)          │       │ id (PK)         │
│ phone         │       │ user_id (FK)     │──────►│ owner_id (FK)   │
│ email         │       │ aadhaar_number   │       │ name            │
│ name          │       │ pan_number       │       │ address         │
│ role          │       │ trade_license    │       │ location (GIS)  │
│ avatar_url    │       │ skills (JSONB)   │       │ gst_number      │
│ created_at    │       │ radius_km        │       │ is_verified     │
│ updated_at    │       │ status           │       │ rating          │
└───────┬───────┘       │ rating           │       │ created_at      │
        │               │ total_jobs       │       └────────┬────────┘
        │               │ location (GIS)   │                │
        │               │ is_verified      │                │
        │               │ is_online        │                │
        │               │ created_at       │                │
        │               └──────────────────┘                │
        │                                                    │
        ▼                                                    ▼
┌───────────────────┐                          ┌──────────────────────┐
│  breakdown_       │                          │  spare_parts         │
│  requests         │                          ├──────────────────────┤
├───────────────────┤                          │ id (PK)              │
│ id (PK)           │                          │ workshop_id (FK)     │
│ rider_id (FK)     │                          │ name                 │
│ mechanic_id (FK)  │                          │ description          │
│ location (GIS)    │                          │ vehicle_type         │
│ emergency_type    │                          │ brand                │
│ description       │                          │ model                │
│ status            │                          │ component_type       │
│ estimated_price   │                          │ condition            │
│ final_price       │                          │ price                │
│ photos (JSONB)    │                          │ market_price         │
│ mechanic_eta      │                          │ stock_quantity       │
│ started_at        │                          │ images (JSONB)       │
│ completed_at      │                          │ condition_notes      │
│ created_at        │                          │ warranty_days        │
└───────┬───────────┘                          │ is_active            │
        │                                      │ created_at           │
        │                                      └──────────┬───────────┘
        │                                                  │
        ▼                                                  ▼
┌───────────────────┐                          ┌──────────────────────┐
│  payments         │                          │  part_orders         │
├───────────────────┤                          ├──────────────────────┤
│ id (PK)           │                          │ id (PK)              │
│ breakdown_id (FK) │                          │ part_id (FK)         │
│ part_order_id(FK) │                          │ buyer_id (FK)        │
│ amount            │                          │ breakdown_id (FK)    │
│ labor_cost        │                          │ quantity             │
│ parts_cost        │                          │ total_price          │
│ platform_fee      │                          │ delivery_mode        │
│ gst_amount        │                          │ escrow_status        │
│ payment_method    │                          │ status               │
│ payment_status    │                          │ created_at           │
│ razorpay_id       │                          └──────────────────────┘
│ invoice_url       │
│ created_at        │        ┌──────────────────────┐
└───────────────────┘        │  ratings             │
                             ├──────────────────────┤
┌───────────────────┐        │ id (PK)              │
│  notifications    │        │ from_user_id (FK)    │
├───────────────────┤        │ to_user_id (FK)      │
│ id (PK)           │        │ breakdown_id (FK)    │
│ user_id (FK)      │        │ part_order_id (FK)   │
│ title             │        │ rating (1-5)         │
│ body              │        │ review_text          │
│ type              │        │ type                 │
│ data (JSONB)      │        │ created_at           │
│ is_read           │        └──────────────────────┘
│ created_at        │
└───────────────────┘        ┌──────────────────────┐
                             │  disputes            │
┌───────────────────┐        ├──────────────────────┤
│  chat_messages    │        │ id (PK)              │
├───────────────────┤        │ raised_by (FK)       │
│ id (PK)           │        │ breakdown_id (FK)    │
│ breakdown_id (FK) │        │ part_order_id (FK)   │
│ sender_id (FK)    │        │ reason               │
│ message           │        │ description          │
│ type              │        │ status               │
│ created_at        │        │ resolution           │
└───────────────────┘        │ resolved_by (FK)     │
                             │ created_at           │
                             └──────────────────────┘
```

### 5.2 Key Database Indexes

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| `mechanics` | `location` | GiST (PostGIS) | Geospatial radius queries |
| `mechanics` | `is_online, is_verified` | B-tree | Filter available mechanics |
| `spare_parts` | `vehicle_type, brand, model` | Composite B-tree | Part search |
| `spare_parts` | `workshop_id, is_active` | Composite B-tree | Workshop inventory |
| `breakdown_requests` | `rider_id, status` | Composite B-tree | User history |
| `breakdown_requests` | `mechanic_id, status` | Composite B-tree | Mechanic jobs |
| `breakdown_requests` | `location` | GiST (PostGIS) | Heatmap analytics |
| `payments` | `payment_status` | B-tree | Payment reconciliation |

### 5.3 Redis Data Structures

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `mechanic:loc:{id}` | GeoSet | - | Real-time mechanic location |
| `mechanic:status:{id}` | String | - | Online/Offline/Busy status |
| `breakdown:active:{id}` | Hash | 24h | Active breakdown session data |
| `otp:{phone}` | String | 5m | OTP verification |
| `rate_limit:{ip}` | Counter | 1m | API rate limiting |
| `session:{token}` | Hash | 7d | User session data |

---

## 6. Data Flow Diagrams

### 6.1 Breakdown Request Flow

```
┌───────┐                                                     ┌──────────┐
│ Rider │                                                     │ Mechanic │
└───┬───┘                                                     └─────┬────┘
    │                                                               │
    │  1. Tap "SOS / Request Help"                                  │
    │  (GPS auto-captured)                                          │
    ├──────────────────────────►┌──────────────┐                    │
    │                           │  API Gateway │                    │
    │                           └──────┬───────┘                    │
    │                                  │                            │
    │                    2. Validate & Create                       │
    │                       Breakdown Request                      │
    │                                  │                            │
    │                           ┌──────▼───────┐                    │
    │                           │   Dispatch   │                    │
    │                           │   Engine     │                    │
    │                           └──────┬───────┘                    │
    │                                  │                            │
    │                    3. Query nearby mechanics                  │
    │                       (PostGIS + Redis)                      │
    │                                  │                            │
    │                    4. Score & rank candidates                 │
    │                                  │                            │
    │                           ┌──────▼───────┐                    │
    │                           │ Notification │    5. Push + Socket│
    │                           │   Service    │───────────────────►│
    │                           └──────────────┘                    │
    │                                                               │
    │                                              6. Accept Job    │
    │                                               ◄───────────────┤
    │                           ┌──────────────┐                    │
    │  7. Mechanic Assigned     │   Socket.io  │                    │
    │  + Live ETA               │   Server     │                    │
    │◄──────────────────────────┤              ├───────────────────►│
    │                           └──────────────┘  8. Navigation     │
    │                                                Start          │
    │  9. Chat / Call                                               │
    │◄─────────────────────────────────────────────────────────────►│
    │                                                               │
    │                          10. Job Completed                    │
    │                              + Photos                        │
    │                                               ◄───────────────┤
    │  11. Invoice + Pay                                            │
    │◄──────────────────────────┌──────────────┐                    │
    │──────────────────────────►│   Razorpay   │───────────────────►│
    │  12. Payment Complete     └──────────────┘   13. Payout       │
    │                                                               │
    │  14. Rate Mechanic                           15. Rate Rider   │
    │──────────────────────────►┌──────────────┐◄───────────────────┤
    │                           │   Rating     │                    │
    │                           │   Service    │                    │
    │                           └──────────────┘                    │
```

### 6.2 Spare Parts Purchase Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Rider /     │     │  Marketplace │     │   Workshop   │     │ Payment  │
│  Mechanic    │     │   Service    │     │   Owner      │     │ Service  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └────┬─────┘
       │                    │                     │                  │
       │ 1. Search Part     │                     │                  │
       ├───────────────────►│                     │                  │
       │                    │                     │                  │
       │ 2. Results with    │                     │                  │
       │    price, condition│                     │                  │
       │◄───────────────────┤                     │                  │
       │                    │                     │                  │
       │ 3. Place Order     │                     │                  │
       ├───────────────────►│                     │                  │
       │                    │ 4. Notify Workshop  │                  │
       │                    ├────────────────────►│                  │
       │                    │                     │                  │
       │ 5. Pay (Escrow)    │                     │                  │
       ├────────────────────┼─────────────────────┼─────────────────►│
       │                    │                     │                  │
       │                    │                     │ 6. Confirm       │
       │                    │                     │    Availability  │
       │                    │◄────────────────────┤                  │
       │                    │                     │                  │
       │ 7. Part Dispatched │                     │                  │
       │◄───────────────────┤                     │                  │
       │                    │                     │                  │
       │ 8. Confirm Receipt │                     │                  │
       ├───────────────────►│                     │                  │
       │                    │ 9. Release Escrow   │                  │
       │                    ├─────────────────────┼─────────────────►│
       │                    │                     │   10. Payout     │
       │                    │                     │◄─────────────────┤
       │                    │                     │                  │
       │ 11. Rate Part/Shop │                     │                  │
       ├───────────────────►│                     │                  │
```

### 6.3 Admin Moderation Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  New      │     │   Admin      │     │  Notification│     │   Database   │
│  Request  │     │  Dashboard   │     │  Service     │     │              │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
     │                   │                    │                     │
     │ 1. Mechanic/      │                    │                     │
     │    Workshop       │                    │                     │
     │    Registration   │                    │                     │
     ├───────────────────┼────────────────────┼────────────────────►│
     │                   │                    │                     │
     │                   │ 2. Pending Queue   │                     │
     │                   │◄───────────────────┼─────────────────────┤
     │                   │                    │                     │
     │                   │ 3. Review KYC Docs │                     │
     │                   ├────────────────────┼────────────────────►│
     │                   │                    │                     │
     │                   │ 4. Approve/Reject  │                     │
     │                   ├────────────────────┼────────────────────►│
     │                   │                    │                     │
     │ 5. Status Update  │                    │                     │
     │◄──────────────────┼────────────────────┤                     │
     │  (Push + SMS)     │                    │                     │
```

---

## 7. Dependencies

### 7.1 NPM Packages (Web)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^15.x | Web framework |
| `react` / `react-dom` | ^19.x | UI library |
| `typescript` | ^5.x | Type system |
| `tailwindcss` | ^4.x | CSS framework |
| `@shadcn/ui` | latest | UI components |
| `reactbits` | latest | Animation effects |
| `prisma` / `@prisma/client` | ^6.x | ORM |
| `@tanstack/react-query` | ^5.x | Data fetching |
| `zustand` | ^5.x | State management |
| `socket.io-client` | ^4.x | WebSocket client |
| `react-hook-form` | ^7.x | Form management |
| `zod` | ^3.x | Schema validation |
| `mapbox-gl` / `@react-google-maps/api` | latest | Maps |
| `recharts` | ^2.x | Charts |
| `next-auth` | ^5.x | Authentication |
| `razorpay` | latest | Payments SDK |
| `sharp` | latest | Image optimization |
| `lucide-react` | latest | Icons |

### 7.2 NPM Packages (Mobile)

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~52.x | Mobile framework |
| `react-native` | ^0.76.x | Mobile UI |
| `@react-navigation/native` | ^7.x | Navigation |
| `nativewind` | ^4.x | Tailwind for RN |
| `react-native-maps` | latest | Maps |
| `expo-location` | latest | GPS |
| `expo-camera` | latest | Camera |
| `expo-notifications` | latest | Push notifications |
| `react-native-reanimated` | ^3.x | Animations |
| `socket.io-client` | ^4.x | WebSocket client |

### 7.3 Backend Services

| Package | Version | Purpose |
|---------|---------|---------|
| `socket.io` | ^4.x | WebSocket server |
| `bullmq` | ^5.x | Job queues |
| `ioredis` | ^5.x | Redis client |
| `jsonwebtoken` | ^9.x | JWT handling |
| `bcryptjs` | ^2.x | Password hashing |
| `multer` / `@aws-sdk/client-s3` | latest | File uploads |
| `nodemailer` | ^6.x | Email sending |
| `winston` | ^3.x | Logging |

### 7.4 External Service Dependencies

| Service | Dependency Type | Fallback |
|---------|----------------|----------|
| Google Maps API | Critical | Mapbox |
| Razorpay API | Critical | PayU / Cashfree |
| Twilio / Exotel | High | MSG91 |
| Firebase (FCM) | High | OneSignal |
| AWS S3 | High | Cloudinary |
| DigiLocker KYC | Medium | Manual verification |

---

## 8. Mobile Applications

### 8.1 App Overview

Two separate mobile applications will be developed:

#### Rider App (Consumer-facing)
Target Users: Vehicle owners needing roadside assistance or spare parts

#### Mechanic App (Service Provider)
Target Users: Verified mechanics providing breakdown services

### 8.2 Rider App Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Splash / Onboarding** | App introduction, feature highlights (3 slides) |
| 2 | **Login / OTP** | Phone number entry + OTP verification |
| 3 | **Home (Map View)** | Full-screen map with current location + SOS button |
| 4 | **Breakdown Request** | Emergency type selector, description, photo capture |
| 5 | **Mechanic Selection** | Nearby mechanics list with ratings, distance, ETA |
| 6 | **Live Tracking** | Real-time mechanic location on map + ETA countdown |
| 7 | **In-Progress Job** | Chat/call with mechanic, job status updates |
| 8 | **Job Summary** | Repair details, photos, cost breakdown |
| 9 | **Payment** | Payment method selection, invoice, tip option |
| 10 | **Rating & Review** | Star rating + text review for mechanic |
| 11 | **Spare Parts Search** | Search, filter, browse marketplace |
| 12 | **Part Detail** | Images, condition, pricing, workshop info |
| 13 | **Cart & Checkout** | Part order summary, delivery options |
| 14 | **Order Tracking** | Part order status tracking |
| 15 | **My Requests History** | Past breakdown requests and orders |
| 16 | **Profile** | Personal details, vehicles, saved addresses |
| 17 | **Wallet** | Balance, transaction history, add money |
| 18 | **Notifications** | Push notification center |
| 19 | **Support & Disputes** | Raise issues, track dispute resolution |
| 20 | **Settings** | Language, notification preferences, help |

### 8.3 Mechanic App Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Splash / Onboarding** | App introduction for mechanics |
| 2 | **Registration** | Phone, skills, KYC document upload |
| 3 | **Login / OTP** | Phone-based authentication |
| 4 | **Home (Dashboard)** | Today's stats, online toggle, active job |
| 5 | **Incoming Request** | Full-screen alert with job details, accept/decline |
| 6 | **Navigation to Rider** | Turn-by-turn navigation to breakdown location |
| 7 | **Active Job** | Job details, chat, update status, capture photos |
| 8 | **Price Estimation** | Labor + parts cost entry with breakdown |
| 9 | **Part Recommendation** | Browse marketplace, recommend parts to rider |
| 10 | **Job Completion** | Upload repair photos, add notes, generate invoice |
| 11 | **Earnings** | Daily/weekly/monthly earnings, payout history |
| 12 | **Job History** | Past completed/cancelled jobs |
| 13 | **Performance** | Ratings, response time, completion rate |
| 14 | **Profile & KYC** | Personal info, documents, skill management |
| 15 | **Availability** | Schedule, radius, specialization settings |
| 16 | **Notifications** | Push notification center |
| 17 | **Settings** | Language, availability preferences |

### 8.4 Web Dashboard Screens (Admin + Workshop)

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Admin Login** | Email/password admin authentication |
| 2 | **Admin Dashboard** | KPIs, active breakdowns map, alerts |
| 3 | **Mechanic Management** | List, verify, approve/reject, performance |
| 4 | **Workshop Management** | List, verify, approve/reject |
| 5 | **Breakdown Monitor** | Live map, active requests, intervention tools |
| 6 | **Spare Parts Moderation** | Review listings, flag suspicious items |
| 7 | **Commission Config** | Set service and parts sale commission rates |
| 8 | **Dispute Center** | View, investigate, resolve disputes |
| 9 | **Analytics** | Breakdown heatmap, demand trends, revenue |
| 10 | **Heatmap View** | Geographic breakdown frequency visualization |
| 11 | **Reports** | Exportable reports (CSV/PDF) |
| 12 | **Settings** | Platform configuration, pricing rules |
| 13 | **Workshop Dashboard** | Inventory overview, orders, revenue |
| 14 | **Inventory Management** | Add/edit/delete parts, stock levels |
| 15 | **Order Management** | Incoming orders, dispatch, returns |
| 16 | **Workshop Analytics** | Sales, popular items, revenue charts |

---

## 9. API Design

### 9.1 API Structure (RESTful)

```
/api/v1
├── /auth
│   ├── POST   /send-otp
│   ├── POST   /verify-otp
│   ├── POST   /refresh-token
│   └── POST   /logout
│
├── /users
│   ├── GET    /me
│   ├── PUT    /me
│   └── PUT    /me/avatar
│
├── /mechanics
│   ├── POST   /register
│   ├── GET    /nearby?lat=&lng=&radius=
│   ├── GET    /:id
│   ├── PUT    /:id/status
│   ├── PUT    /:id/location
│   └── GET    /:id/reviews
│
├── /breakdowns
│   ├── POST   /                    (create request)
│   ├── GET    /:id
│   ├── PUT    /:id/accept          (mechanic accepts)
│   ├── PUT    /:id/status          (update status)
│   ├── PUT    /:id/estimate        (price estimate)
│   ├── PUT    /:id/complete
│   ├── POST   /:id/photos
│   └── GET    /my-history
│
├── /marketplace
│   ├── GET    /parts?search=&filters=
│   ├── GET    /parts/:id
│   ├── POST   /parts               (workshop creates)
│   ├── PUT    /parts/:id
│   ├── DELETE /parts/:id
│   └── GET    /workshops/:id/inventory
│
├── /orders
│   ├── POST   /                    (place part order)
│   ├── GET    /:id
│   ├── PUT    /:id/status
│   └── GET    /my-orders
│
├── /payments
│   ├── POST   /create-order
│   ├── POST   /verify
│   ├── GET    /invoices/:id
│   └── POST   /refund
│
├── /ratings
│   ├── POST   /
│   └── GET    /:entity_type/:entity_id
│
├── /disputes
│   ├── POST   /
│   ├── GET    /:id
│   └── PUT    /:id/resolve
│
├── /notifications
│   ├── GET    /
│   ├── PUT    /:id/read
│   └── PUT    /read-all
│
└── /admin
    ├── GET    /dashboard-stats
    ├── GET    /mechanics/pending
    ├── PUT    /mechanics/:id/verify
    ├── GET    /workshops/pending
    ├── PUT    /workshops/:id/verify
    ├── GET    /breakdowns/active
    ├── GET    /disputes
    ├── PUT    /disputes/:id/resolve
    ├── GET    /analytics/heatmap
    ├── GET    /analytics/breakdown-trends
    └── PUT    /config/commission
```

### 9.2 WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `breakdown:new` | Server → Mechanic | `{ breakdownId, location, emergencyType, distance }` |
| `breakdown:accepted` | Server → Rider | `{ mechanicId, eta, mechanicLocation }` |
| `mechanic:location` | Mechanic → Server | `{ lat, lng, heading, speed }` |
| `eta:update` | Server → Rider | `{ eta, mechanicLocation }` |
| `job:status` | Server → Both | `{ breakdownId, status, message }` |
| `chat:message` | Both → Server | `{ breakdownId, message, type }` |
| `mechanic:status` | Mechanic → Server | `{ status: online/offline/busy }` |

---

## 10. Security & Compliance

### 10.1 Authentication & Authorization
- **JWT-based auth** with short-lived access tokens (15min) and refresh tokens (7 days)
- **OTP-based login** via SMS (no password storage for riders/mechanics)
- **Role-based access control** (RBAC): Rider, Mechanic, Workshop Owner, Admin, Super Admin
- **Masked phone numbers** for rider-mechanic communication

### 10.2 Data Security
- All data encrypted in transit (TLS 1.3)
- Sensitive data encrypted at rest (AES-256)
- PII data (Aadhaar, PAN) stored with field-level encryption
- GDPR-compliant data handling with user consent
- Secure file uploads with virus scanning

### 10.3 Payment Security
- PCI DSS compliance via Razorpay (no card data stored on platform)
- Escrow handling via payment gateway
- Transaction audit logging

### 10.4 API Security
- Rate limiting per IP and per user
- Input validation and sanitization (Zod schemas)
- CORS configuration
- Helmet.js security headers
- SQL injection prevention via Prisma ORM

---

## 11. Deployment Strategy

### 11.1 Environments

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Development | Local development | `localhost:3000` |
| Staging | Pre-production testing | `staging.repairassist.in` |
| Production | Live application | `app.repairassist.in` |

### 11.2 CI/CD Pipeline

```
GitHub Push → GitHub Actions
    │
    ├── Lint + Type Check
    ├── Unit Tests
    ├── Integration Tests
    ├── Build
    │
    ├── [Staging] Auto-deploy on `develop` branch merge
    └── [Production] Deploy on `main` branch with approval gate
```

### 11.3 Infrastructure

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │     │   AWS ECS    │     │   AWS RDS    │
│   (Next.js)  │     │ (Microservices│    │ (PostgreSQL) │
│              │     │  + Socket.io)│     │  + PostGIS)  │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ ElastiCache  │     │     S3       │     │ CloudFront   │
│  (Redis)     │     │  (Images)    │     │   (CDN)      │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 12. Testing Strategy

| Test Type | Tool | Coverage Target |
|-----------|------|----------------|
| Unit Tests | Vitest / Jest | 80%+ core logic |
| Component Tests | React Testing Library | All UI components |
| Integration Tests | Playwright / Cypress | Critical user flows |
| API Tests | Supertest | All endpoints |
| Mobile Tests | Detox / Maestro | Core mobile flows |
| Load Tests | k6 / Artillery | 10K concurrent users |
| Security Tests | OWASP ZAP | Vulnerability scan |

---

## 13. Project Phases & Milestones

### Phase 1: Foundation (Weeks 1-4)
- Project setup, CI/CD, database design
- Authentication system (OTP + JWT)
- User, Mechanic, Workshop data models
- Basic web dashboard scaffold

### Phase 2: Core Breakdown Flow (Weeks 5-8)
- Breakdown request creation
- Dispatch engine with geospatial queries
- Real-time tracking (Socket.io)
- Mechanic app - accept/decline/navigate
- In-app chat and masked calling

### Phase 3: Marketplace (Weeks 9-12)
- Spare parts listing CRUD
- Search and filter engine
- Part ordering with escrow payments
- Workshop inventory management

### Phase 4: Payments & Ratings (Weeks 13-15)
- Razorpay integration
- Invoice generation with GST
- Wallet system
- Rating and review system
- Commission calculation

### Phase 5: Admin & Analytics (Weeks 16-18)
- Admin dashboard
- Mechanic/Workshop verification workflow
- Analytics and heatmaps
- Dispute resolution system
- Reports and exports

### Phase 6: Mobile Apps (Weeks 12-20, parallel)
- Rider app (React Native)
- Mechanic app (React Native)
- Push notifications
- Offline support

### Phase 7: QA & Launch (Weeks 19-22)
- End-to-end testing
- Performance optimization
- Security audit
- Beta testing
- Production deployment

---

*This Statement of Work is a living document and will be updated as requirements evolve.*
