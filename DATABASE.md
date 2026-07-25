# DATABASE.md

# NoveraOS Database Model & Schema Specifications

> **Rule 4: Never invent architecture. ARCHITECTURE.md is authoritative.**
> **Note: Do NOT write SQL code here. This document describes the data entities, relationships, indexes, and schemas conceptually.**

---

## Table of Contents

- [1. Database Architecture Overview](#1-database-architecture-overview)
- [2. Entity Relationship Diagram (Conceptual)](#2-entity-relationship-diagram-conceptual)
- [3. Core MVP Entities](#3-core-mvp-entities)
  - [3.1 User](#31-user)
  - [3.2 Thought](#32-thought)
  - [3.3 Embedding](#33-embedding)
  - [3.4 Conversation](#34-conversation)
  - [3.5 Message](#35-message)
  - [3.6 Summary & Entity Memory](#36-summary--entity-memory)
- [4. Deferred / Future Entities](#4-deferred--future-entities)
- [5. Indexing & Vector Search Strategy](#5-indexing--vector-search-strategy)
- [6. Data Lifecycle & Retention](#6-data-lifecycle--retention)
- [7. Cross References](#7-cross-references)

---

## 1. Database Architecture Overview

NoveraOS uses **PostgreSQL** managed via **Prisma ORM**. 

Vector similarity search is handled inside the same database instance using the **`pgvector`** extension, ensuring transactional consistency between core entity models (users, thoughts) and their high-dimensional vector representations.

---

## 2. Entity Relationship Diagram (Conceptual)

```
┌──────────────┐         1:N         ┌──────────────┐
│     User     ├────────────────────►│   Thought    │
└──────┬───────┘                     └──────┬───────┘
       │                                    │ 1:1
       │ 1:N                                ▼
       │                             ┌──────────────┐
       │                             │  Embedding   │
       │                             └──────────────┘
       ▼
┌──────────────┐         1:N         ┌──────────────┐
│ Conversation ├────────────────────►│   Message    │
└──────────────┘                     └──────────────┘
```

---

## 3. Core MVP Entities

### 3.1 User
Represents an authenticated individual operating within NoveraOS.
- **Fields**:
  - `id`: Unique Identifier (UUIDv4)
  - `email`: String (Unique, Indexed)
  - `passwordHash`: String (Nullable for OAuth users)
  - `name`: String (Optional)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp
- **Relationships**: Has many `Thought` entries and many `Conversation` sessions.

### 3.2 Thought
The fundamental unit of user input captured within Thought Dump.
- **Fields**:
  - `id`: Unique Identifier (UUIDv4)
  - `userId`: Foreign Key to `User`
  - `rawContent`: Long Text (Unstructured user input)
  - `summary`: Text (Async AI-generated summary)
  - `entities`: Array of Strings (Extracted concept tags, keywords)
  - `isArchived`: Boolean (Default false)
  - `createdAt`: Timestamp (Indexed)
  - `updatedAt`: Timestamp
- **Relationships**: Belongs to `User`; Has one `Embedding`; Referenced in RAG citations.

### 3.3 Embedding
High-dimensional vector storage for semantic retrieval.
- **Fields**:
  - `id`: Unique Identifier (UUIDv4)
  - `thoughtId`: Foreign Key to `Thought` (Unique 1:1)
  - `vector`: Vector (1536 dimensions, `pgvector`)
  - `model`: String (e.g., `text-embedding-3-small`)
  - `createdAt`: Timestamp
- **Relationships**: Belongs to `Thought`.

### 3.4 Conversation
A chat session inside the AI Workspace.
- **Fields**:
  - `id`: Unique Identifier (UUIDv4)
  - `userId`: Foreign Key to `User`
  - `title`: String (Auto-generated from first message context)
  - `createdAt`: Timestamp
  - `updatedAt`: Timestamp
- **Relationships**: Belongs to `User`; Has many `Message` records.

### 3.5 Message
Individual turn (user query or AI response) inside an AI Workspace conversation.
- **Fields**:
  - `id`: Unique Identifier (UUIDv4)
  - `conversationId`: Foreign Key to `Conversation`
  - `role`: Enum (`user`, `assistant`, `system`)
  - `content`: Text (Markdown content)
  - `citedThoughtIds`: Array of UUIDs (Referenced thought sources)
  - `createdAt`: Timestamp
- **Relationships**: Belongs to `Conversation`.

### 3.6 Summary & Entity Memory
Aggregated semantic memory derived across clusters of thoughts.
- **Fields**:
  - `id`: Unique Identifier (UUIDv4)
  - `userId`: Foreign Key to `User`
  - `entityName`: String (e.g., "PostgreSQL", "NoveraOS Architecture")
  - `condensedContext`: Text (Synthesized running memory)
  - `updatedAt`: Timestamp
- **Relationships**: Belongs to `User`.

---

## 4. Deferred / Future Entities

The following entities are explicitly **NOT** created in the MVP schema to enforce scope discipline:
- `Project` (Deferred to Post-MVP)
- `Task` (Deferred to Post-MVP)
- `CalendarEvent` (Deferred to Post-MVP)
- `Team` / `Organization` (Deferred to Post-MVP)

---

## 5. Indexing & Vector Search Strategy

- **B-Tree Indexes**: Applied to `User(email)`, `Thought(userId, createdAt)`, `Message(conversationId)`.
- **HNSW Vector Index**: Applied to `Embedding(vector)` using `vector_cosine_ops`.
  - HNSW Parameters: `m = 16`, `ef_construction = 64` for optimal balance between indexing speed and recall accuracy.

---

## 6. Data Lifecycle & Retention

- **Zero Hard Deletions**: Deleting a thought sets `isArchived = true` and updates vector search filters to exclude archived entries, allowing user recovery.
- **Data Export**: Users can export all thoughts and associated embeddings in JSON standard format.

---

## 7. Cross References

- System Architecture: [ARCHITECTURE.md](file:///c:/Users/gurpr/noveraos/noveraos/ARCHITECTURE.md)
- AI RAG Vector Operations: [AI.md](file:///c:/Users/gurpr/noveraos/noveraos/AI.md)
- Tech Stack Data Layer: [TECH_STACK.md](file:///c:/Users/gurpr/noveraos/noveraos/TECH_STACK.md)
