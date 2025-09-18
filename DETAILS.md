# 📊 Technical Details - KBTG Backend API

> Comprehensive technical documentation including database schema, system architecture, and UML diagrams

## 📋 Table of Contents

- [Database Design](#database-design)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Class Diagram](#class-diagram)
- [Sequence Diagrams](#sequence-diagrams)
- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)

---

## 🗄️ Database Design

### Database Schema Overview

The application uses SQLite database with two main tables for user management and session tracking:

#### Tables:
1. **USERTBL** - Stores user account information
2. **SESSION** - Manages user authentication sessions

### Database Relationships
- One-to-Many: UserTbl → Session (One user can have multiple sessions)
- Foreign Key: SESSION.user_id references USERTBL.id

---

## 🔗 Entity Relationship Diagram

```mermaid
erDiagram
    USERTBL {
        int id PK "Primary Key, Auto-increment"
        string firstname "User's first name, NOT NULL"
        string lastname "User's last name, NOT NULL"
        string title "User's title, NULLABLE"
        string username "Unique username, NOT NULL"
        string passwordhash "Bcrypt hashed password, NOT NULL"
        datetime created_at "Account creation timestamp"
        datetime updated_at "Last update timestamp"
    }
    
    SESSION {
        int id PK "Primary Key, Auto-increment"
        string session_id UK "UUID session identifier, UNIQUE"
        int user_id FK "Foreign key to USERTBL.id"
        datetime created_at "Session creation timestamp"
        datetime expires_at "Session expiration time"
        boolean is_active "Session status flag"
    }
    
    USERTBL ||--o{ SESSION : "has many"
    SESSION }o--|| USERTBL : "belongs to"
```

### Field Specifications

**USERTBL Table:**
- `id`: INTEGER, Primary Key, Auto-increment
- `firstname`: VARCHAR(100), NOT NULL
- `lastname`: VARCHAR(100), NOT NULL  
- `title`: VARCHAR(50), NULLABLE
- `username`: VARCHAR(80), UNIQUE, NOT NULL
- `passwordhash`: VARCHAR(128), NOT NULL
- `created_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP
- `updated_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE

**SESSION Table:**
- `id`: INTEGER, Primary Key, Auto-increment
- `session_id`: VARCHAR(36), UNIQUE, NOT NULL (UUID format)
- `user_id`: INTEGER, Foreign Key → USERTBL.id, NOT NULL
- `created_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP
- `expires_at`: DATETIME, NULLABLE
- `is_active`: BOOLEAN, DEFAULT TRUE

---

## 📐 Class Diagram

```mermaid
classDiagram
    class Flask {
        +app: Flask
        +config: Config
        +run()
        +route()
    }
    
    class UserTbl {
        -id: int
        -firstname: string
        -lastname: string
        -title: string
        -username: string
        -passwordhash: string
        -created_at: datetime
        -updated_at: datetime
        +__init__(firstname, lastname, title, username, passwordhash)
        +to_dict() dict
        +__repr__() string
    }
    
    class Session {
        -id: int
        -session_id: string
        -user_id: int
        -created_at: datetime
        -expires_at: datetime
        -is_active: boolean
        +__init__(session_id, user_id, expires_at)
        +__repr__() string
    }
    
    class AuthUtils {
        +hash_password(password string) string
        +verify_password(password string, hashed string) boolean
        +create_user(firstname, lastname, title, username, password) UserTbl
        +authenticate_user(username string, password string) UserTbl
        +create_session(user_id int) Session
        +validate_session(session_id string) Session
        +invalidate_session(session_id string) boolean
        +generate_session_id() string
    }
    
    class Config {
        <<abstract>>
        +SECRET_KEY string
        +SQLALCHEMY_DATABASE_URI string
        +SQLALCHEMY_TRACK_MODIFICATIONS boolean
    }
    
    class DevelopmentConfig {
        +DEBUG boolean
        +HOST string
        +PORT int
        +DATABASE_URL string
    }
    
    class ProductionConfig {
        +DEBUG boolean
        +HOST string
        +PORT int
        +DATABASE_URL string
    }
    
    class TestingConfig {
        +TESTING boolean
        +SQLALCHEMY_DATABASE_URI string
    }
    
    class APIEndpoints {
        +hello_world() Response
        +health_check() Response
        +register() Response
        +login() Response
        +validate_session() Response
        +logout() Response
        +api_docs() Response
    }
    
    UserTbl "1" *-- "many" Session : has
    AuthUtils --> UserTbl : creates
    AuthUtils --> Session : manages
    Config <|-- DevelopmentConfig
    Config <|-- ProductionConfig
    Config <|-- TestingConfig
    Flask --> Config : uses
    Flask --> APIEndpoints : routes
    APIEndpoints --> AuthUtils : uses
    APIEndpoints --> UserTbl : queries
    APIEndpoints --> Session : manages
```

### Class Descriptions

**Model Classes:**
- `UserTbl`: SQLAlchemy model for user data with validation and serialization
- `Session`: SQLAlchemy model for session management with expiration tracking

**Utility Classes:**
- `AuthUtils`: Static utility class for authentication operations (bcrypt hashing, session management)
- `Config`: Abstract base configuration class with environment-specific implementations

**Application Classes:**
- `Flask`: Main application instance with route definitions
- `APIEndpoints`: Logical grouping of all API endpoint functions

---

## 🔄 Sequence Diagrams

### User Registration Flow

```plantuml
@startuml Registration_Sequence
!theme plain
title User Registration Sequence

actor User as U
participant "Flask App" as F
participant "AuthUtils" as A
participant "UserTbl Model" as UM
participant "Database" as DB

U -> F: POST /v1/register\n{firstname, lastname, title, username, password}
activate F

F -> F: validate_registration_data()
alt validation successful
    F -> A: create_user(firstname, lastname, title, username, password)
    activate A
    
    A -> A: hash_password(password)
    A -> UM: new UserTbl(...)
    activate UM
    
    UM -> DB: INSERT INTO USERTBL
    activate DB
    DB --> UM: user_id
    deactivate DB
    
    UM --> A: user_object
    deactivate UM
    A --> F: user_object
    deactivate A
    
    F --> U: 201 Created\n{message, user}
else validation failed
    F --> U: 400 Bad Request\n{error, details}
end

deactivate F
@enduml
```

### User Login Flow

```plantuml
@startuml Login_Sequence
!theme plain
title User Login Sequence

actor User as U
participant "Flask App" as F
participant "AuthUtils" as A
participant "UserTbl Model" as UM
participant "Session Model" as SM
participant "Database" as DB

U -> F: POST /v1/login\n{username, password}
activate F

F -> A: authenticate_user(username, password)
activate A

A -> UM: query by username
activate UM
UM -> DB: SELECT FROM USERTBL WHERE username=?
activate DB
DB --> UM: user_record
deactivate DB
UM --> A: user_object
deactivate UM

A -> A: verify_password(password, user.passwordhash)
alt authentication successful
    A --> F: user_object
    deactivate A
    
    F -> A: create_session(user.id)
    activate A
    A -> A: generate_session_id()
    A -> SM: new Session(session_id, user_id, expires_at)
    activate SM
    SM -> DB: INSERT INTO SESSION
    activate DB
    DB --> SM: session_id
    deactivate DB
    SM --> A: session_object
    deactivate SM
    A --> F: session_object
    deactivate A
    
    F --> U: 200 OK\n{message, user, redirect_url}\nHeader: sessionid
else authentication failed
    A --> F: None
    deactivate A
    F --> U: 401 Unauthorized\n{error, message}
end

deactivate F
@enduml
```

### Session Validation Flow

```plantuml
@startuml Session_Validation_Sequence
!theme plain
title Session Validation Sequence

actor User as U
participant "Flask App" as F
participant "AuthUtils" as A
participant "Session Model" as SM
participant "Database" as DB

U -> F: GET /v1/validate-session\nHeader: sessionid
activate F

F -> A: validate_session(session_id)
activate A

A -> SM: query by session_id
activate SM
SM -> DB: SELECT FROM SESSION WHERE session_id=? AND is_active=TRUE
activate DB
DB --> SM: session_record
deactivate DB

alt session found and valid
    SM -> A: check expires_at > now()
    alt not expired
        SM --> A: session_object (with user)
        deactivate SM
        A --> F: session_object
        deactivate A
        F --> U: 200 OK\n{message, user, session_id}
    else expired
        SM -> DB: UPDATE SESSION SET is_active=FALSE
        activate DB
        DB --> SM: updated
        deactivate DB
        SM --> A: None
        deactivate SM
        A --> F: None
        deactivate A
        F --> U: 401 Unauthorized\n{error, message}
    end
else session not found
    SM --> A: None
    deactivate SM
    A --> F: None
    deactivate A
    F --> U: 401 Unauthorized\n{error, message}
end

deactivate F
@enduml
```

### User Logout Flow

```plantuml
@startuml Logout_Sequence
!theme plain
title User Logout Sequence

actor User as U
participant "Flask App" as F
participant "AuthUtils" as A
participant "Session Model" as SM
participant "Database" as DB

U -> F: POST /v1/logout\nHeader: sessionid
activate F

F -> A: invalidate_session(session_id)
activate A

A -> SM: query by session_id
activate SM
SM -> DB: SELECT FROM SESSION WHERE session_id=?
activate DB
DB --> SM: session_record
deactivate DB

alt session found
    SM -> DB: UPDATE SESSION SET is_active=FALSE
    activate DB
    DB --> SM: updated
    deactivate DB
    SM --> A: True
    deactivate SM
    A --> F: True
    deactivate A
    F --> U: 200 OK\n{message}
else session not found
    SM --> A: False
    deactivate SM
    A --> F: False
    deactivate A
    F --> U: 404 Not Found\n{error, message}
end

deactivate F
@enduml
```

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Web Browser]
        C2[Mobile App]
        C3[API Client]
    end
    
    subgraph "API Gateway"
        G[Flask Application]
    end
    
    subgraph "Business Logic Layer"
        BL1[Authentication Utils]
        BL2[Validation Utils]
        BL3[API Endpoints]
    end
    
    subgraph "Data Access Layer"
        DAL1[SQLAlchemy ORM]
        DAL2[Model Classes]
    end
    
    subgraph "Database Layer"
        DB[(SQLite Database)]
    end
    
    subgraph "External Services"
        EXT1[Swagger UI]
        EXT2[Health Monitoring]
    end
    
    %% Connections
    C1 --> G
    C2 --> G
    C3 --> G
    
    G --> BL3
    BL3 --> BL1
    BL3 --> BL2
    
    BL1 --> DAL1
    BL2 --> DAL1
    DAL1 --> DAL2
    DAL2 --> DB
    
    G --> EXT1
    G --> EXT2
    
    %% Styling
    classDef client fill:#e1f5fe
    classDef business fill:#f3e5f5
    classDef data fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef external fill:#fce4ec
    
    class C1,C2,C3 client
    class BL1,BL2,BL3 business
    class DAL1,DAL2 data
    class DB database
    class EXT1,EXT2 external
```

### Component Responsibilities

**Client Layer:**
- Web browsers, mobile apps, and API clients
- Responsible for user interaction and API consumption

**API Gateway:**
- Flask application serving as the main entry point
- Handles HTTP requests/responses and routing

**Business Logic Layer:**
- `AuthUtils`: Password hashing, user authentication, session management
- `ValidationUtils`: Input validation and data sanitization
- `APIEndpoints`: Request handling and response formatting

**Data Access Layer:**
- `SQLAlchemy ORM`: Object-relational mapping and database abstraction
- `Model Classes`: Data models with business logic and relationships

**Database Layer:**
- SQLite database for data persistence
- Handles ACID transactions and data integrity

---

## 🌊 Data Flow

### Request Processing Flow

```mermaid
flowchart TD
    A[Client Request] --> B{Authentication Required?}
    B -->|Yes| C[Extract sessionid Header]
    B -->|No| G[Process Request]
    
    C --> D[Validate Session]
    D --> E{Session Valid?}
    E -->|Yes| F[Extract User Context]
    E -->|No| Z[Return 401 Unauthorized]
    
    F --> G[Process Request]
    G --> H[Validate Input Data]
    H --> I{Validation Passed?}
    I -->|No| Y[Return 400 Bad Request]
    I -->|Yes| J[Execute Business Logic]
    
    J --> K{Database Operation Needed?}
    K -->|Yes| L[Perform Database Operation]
    K -->|No| P[Format Response]
    
    L --> M{Operation Successful?}
    M -->|Yes| N[Commit Transaction]
    M -->|No| O[Rollback Transaction]
    
    N --> P[Format Response]
    O --> X[Return 500 Internal Error]
    
    P --> Q[Add Security Headers]
    Q --> R[Return JSON Response]
    
    %% Error paths
    X --> R
    Y --> R
    Z --> R
    
    %% Styling
    classDef process fill:#e3f2fd
    classDef decision fill:#fff3e0
    classDef success fill:#e8f5e8
    classDef error fill:#ffebee
    
    class A,C,F,G,H,J,L,N,P,Q,R process
    class B,E,I,K,M decision
    class N success
    class O,X,Y,Z error
```

### Authentication Data Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant AU as AuthUtils
    participant DB as Database
    
    Note over C,DB: Registration Flow
    C->>A: POST /v1/register {user_data}
    A->>A: Validate input data
    A->>AU: create_user(user_data)
    AU->>AU: hash_password(password)
    AU->>DB: INSERT new user
    DB-->>AU: user_id
    AU-->>A: user_object
    A-->>C: 201 Created {user}
    
    Note over C,DB: Login Flow
    C->>A: POST /v1/login {credentials}
    A->>AU: authenticate_user(username, password)
    AU->>DB: SELECT user by username
    DB-->>AU: user_record
    AU->>AU: verify_password(password, hash)
    AU->>AU: generate_session_id()
    AU->>DB: INSERT new session
    DB-->>AU: session_record
    AU-->>A: session_object
    A-->>C: 200 OK {user} + sessionid header
    
    Note over C,DB: Protected Request Flow
    C->>A: GET /v1/validate-session + sessionid
    A->>AU: validate_session(session_id)
    AU->>DB: SELECT session by session_id
    DB-->>AU: session_record
    AU->>AU: check expiration
    AU-->>A: session_object
    A-->>C: 200 OK {user, session}
```

---

## 🔧 Technical Implementation Notes

### Security Considerations
- **Password Hashing**: Using bcrypt with automatic salt generation
- **Session Management**: UUID-based tokens with configurable expiration
- **SQL Injection Prevention**: Parameterized queries through SQLAlchemy ORM
- **Input Validation**: Comprehensive validation on all endpoints
- **Error Handling**: Sanitized error messages without sensitive information

### Performance Optimizations
- **Database Indexing**: Unique indexes on username and session_id
- **Session Cleanup**: Automatic expiration handling
- **Connection Pooling**: SQLAlchemy connection management
- **Lazy Loading**: Efficient database queries with relationships

### Scalability Considerations
- **Stateless Design**: Session data stored in database, not memory
- **Database Migration Support**: SQLAlchemy Alembic integration ready
- **Configuration Management**: Environment-based configuration
- **Containerization**: Docker support for easy deployment

---

*This technical documentation provides comprehensive details about the system architecture, data models, and implementation patterns used in the KBTG Backend API project.*
