# WealthWise Architecture - Visual Diagrams

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WB[Web Browser]
        MB[Mobile Browser]
        MA[Mobile Apps]
    end
    
    subgraph "Frontend Application"
        RA[React App]
        AUTH[Auth Module]
        DASH[Dashboard]
        PORT[Portfolio]
        INV[Investments]
        TRANS[Transactions]
    end
    
    subgraph "API Gateway"
        GW[Express Gateway]
        MW[Middleware]
        RL[Rate Limiter]
    end
    
    subgraph "Backend Services"
        AS[Auth Service]
        US[User Service]
        PS[Portfolio Service]
        IS[Investment Service]
        TS[Transaction Service]
    end
    
    subgraph "Data Layer"
        MDB[(MongoDB)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "External Services"
        MP[Market Data APIs]
        PG[Payment Gateway]
        BA[Banking APIs]
        KYC[KYC Service]
    end
    
    WB --> RA
    MB --> RA
    MA --> RA
    
    RA --> AUTH
    RA --> DASH
    RA --> PORT
    RA --> INV
    RA --> TRANS
    
    AUTH --> GW
    DASH --> GW
    PORT --> GW
    INV --> GW
    TRANS --> GW
    
    GW --> MW
    MW --> RL
    RL --> AS
    RL --> US
    RL --> PS
    RL --> IS
    RL --> TS
    
    AS --> MDB
    US --> MDB
    PS --> MDB
    IS --> MDB
    TS --> MDB
    
    AS --> REDIS
    PS --> REDIS
    IS --> REDIS
    
    IS --> MP
    TS --> PG
    US --> BA
    US --> KYC
```

## 2. Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant AS as Auth Service
    participant DB as MongoDB
    participant R as Redis
    
    U->>F: Enter Credentials
    F->>A: POST /api/auth/login
    A->>AS: Validate Request
    AS->>DB: Check User
    DB-->>AS: User Data
    AS->>AS: Validate Password
    AS->>AS: Generate JWT
    AS->>R: Store Session
    AS-->>A: JWT Token
    A-->>F: Success + Token
    F->>F: Store Token
    F->>U: Redirect to Dashboard
```

## 3. Investment Purchase Flow

```mermaid
flowchart LR
    A[User Browses Assets] --> B{Select Asset}
    B --> C[Enter Quantity]
    C --> D{Check Balance}
    D -->|Sufficient| E[Confirm Order]
    D -->|Insufficient| F[Show Error]
    E --> G[Create Transaction]
    G --> H[Update Portfolio]
    H --> I[Update Balance]
    I --> J[Show Success]
    F --> A
```

## 4. Data Model Relationships

```mermaid
erDiagram
    USER ||--o{ PORTFOLIO : has
    USER ||--o{ TRANSACTION : makes
    PORTFOLIO ||--o{ HOLDING : contains
    HOLDING }o--|| ASSET : references
    TRANSACTION }o--|| ASSET : involves
    
    USER {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        boolean kycCompleted
        number totalBalance
    }
    
    PORTFOLIO {
        string id PK
        string userId FK
        array holdings
        number totalInvested
        number currentValue
        object assetAllocation
    }
    
    HOLDING {
        string assetType
        string symbol
        number quantity
        number averagePrice
        number currentValue
    }
    
    ASSET {
        string id PK
        string symbol UK
        string name
        string type
        number currentPrice
        number marketCap
    }
    
    TRANSACTION {
        string id PK
        string userId FK
        string type
        number amount
        string assetType
        string status
        date timestamp
    }
```

## 5. Component Hierarchy

```mermaid
graph TD
    APP[App.tsx]
    APP --> AUTH_PROVIDER[AuthProvider]
    AUTH_PROVIDER --> ROUTER[Router]
    
    ROUTER --> PUBLIC[Public Routes]
    ROUTER --> PRIVATE[Private Routes]
    
    PUBLIC --> LOGIN[Login Page]
    PUBLIC --> REGISTER[Register Page]
    
    PRIVATE --> LAYOUT[Layout Component]
    LAYOUT --> NAV[Navigation Bar]
    LAYOUT --> MAIN[Main Content]
    
    MAIN --> DASH_PAGE[Dashboard]
    MAIN --> PORT_PAGE[Portfolio]
    MAIN --> INV_PAGE[Investments]
    MAIN --> TRANS_PAGE[Transactions]
    
    DASH_PAGE --> SUMMARY[Summary Cards]
    DASH_PAGE --> ALLOCATION[Asset Allocation]
    DASH_PAGE --> RECENT[Recent Activity]
    
    PORT_PAGE --> HOLDINGS[Holdings Table]
    PORT_PAGE --> PERFORMANCE[Performance Chart]
    
    INV_PAGE --> SEARCH[Asset Search]
    INV_PAGE --> LIST[Asset List]
    INV_PAGE --> BUY_MODAL[Buy Modal]
    
    TRANS_PAGE --> FILTERS[Transaction Filters]
    TRANS_PAGE --> HISTORY[Transaction History]
```

## 6. API Request Flow

```mermaid
graph LR
    subgraph "Frontend"
        UI[User Interface]
        CTX[Context/State]
        API_CLIENT[API Service]
    end
    
    subgraph "Backend"
        CORS[CORS Handler]
        AUTH_MW[Auth Middleware]
        VALIDATOR[Validator]
        CONTROLLER[Controller]
        SERVICE[Service Layer]
        MODEL[Data Model]
    end
    
    subgraph "Database"
        DB[(MongoDB)]
    end
    
    UI --> CTX
    CTX --> API_CLIENT
    API_CLIENT -->|HTTP Request| CORS
    CORS --> AUTH_MW
    AUTH_MW --> VALIDATOR
    VALIDATOR --> CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> MODEL
    MODEL --> DB
    DB -->|Response| MODEL
    MODEL --> SERVICE
    SERVICE --> CONTROLLER
    CONTROLLER -->|HTTP Response| API_CLIENT
    API_CLIENT --> CTX
    CTX --> UI
```

## 7. Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DEV_FE[Frontend Dev Server :3000]
        DEV_BE[Backend Dev Server :5001]
        DEV_DB[Local MongoDB]
    end
    
    subgraph "Staging"
        STG_CDN[CDN]
        STG_LB[Load Balancer]
        STG_APP[App Servers]
        STG_DB[MongoDB Replica Set]
    end
    
    subgraph "Production"
        subgraph "Frontend Infrastructure"
            CF[CloudFlare CDN]
            S3[AWS S3 Static Hosting]
        end
        
        subgraph "Backend Infrastructure"
            ALB[Application Load Balancer]
            ECS[ECS Container Service]
            ASG[Auto Scaling Group]
        end
        
        subgraph "Data Infrastructure"
            ATLAS[MongoDB Atlas]
            ELASTICACHE[ElastiCache Redis]
        end
    end
    
    DEV_FE -->|Build| STG_CDN
    DEV_BE -->|Deploy| STG_APP
    
    STG_CDN -->|Promote| CF
    STG_APP -->|Promote| ECS
    
    CF --> S3
    ALB --> ECS
    ECS --> ASG
    ASG --> ATLAS
    ASG --> ELASTICACHE
```

## 8. Security Architecture

```mermaid
graph TD
    subgraph "Security Layers"
        WAF[Web Application Firewall]
        HTTPS[HTTPS/TLS Encryption]
        CORS_SEC[CORS Policy]
        
        subgraph "Application Security"
            JWT[JWT Authentication]
            BCRYPT[Password Hashing]
            VALIDATION[Input Validation]
            SANITIZE[Data Sanitization]
        end
        
        subgraph "Data Security"
            ENCRYPT_TRANSIT[Encryption in Transit]
            ENCRYPT_REST[Encryption at Rest]
            BACKUP[Automated Backups]
        end
        
        subgraph "Compliance"
            KYC_CHECK[KYC Verification]
            AML[AML Monitoring]
            AUDIT[Audit Logging]
            GDPR[GDPR Compliance]
        end
    end
    
    WAF --> HTTPS
    HTTPS --> CORS_SEC
    CORS_SEC --> JWT
    JWT --> VALIDATION
    VALIDATION --> SANITIZE
    SANITIZE --> ENCRYPT_TRANSIT
    ENCRYPT_TRANSIT --> ENCRYPT_REST
    
    KYC_CHECK --> AML
    AML --> AUDIT
    AUDIT --> GDPR
```

## 9. Performance Optimization Strategy

```mermaid
graph LR
    subgraph "Frontend Optimization"
        LAZY[Lazy Loading]
        CACHE_FE[Browser Cache]
        CDN_OPT[CDN Distribution]
        COMPRESS[Asset Compression]
    end
    
    subgraph "Backend Optimization"
        CACHE_BE[Redis Cache]
        INDEX[DB Indexing]
        POOL[Connection Pooling]
        COMPRESS_API[Response Compression]
    end
    
    subgraph "Infrastructure"
        LB[Load Balancing]
        SCALE[Auto Scaling]
        REGION[Multi-Region]
    end
    
    LAZY --> CACHE_FE
    CACHE_FE --> CDN_OPT
    CDN_OPT --> COMPRESS
    
    CACHE_BE --> INDEX
    INDEX --> POOL
    POOL --> COMPRESS_API
    
    LB --> SCALE
    SCALE --> REGION
```

## 10. Monitoring & Observability

```mermaid
graph TD
    subgraph "Application Monitoring"
        APP[Application]
        LOGS[Log Aggregation]
        METRICS[Performance Metrics]
        ERRORS[Error Tracking]
    end
    
    subgraph "Infrastructure Monitoring"
        SERVERS[Server Health]
        DB_MON[Database Metrics]
        API_MON[API Performance]
    end
    
    subgraph "Dashboards"
        GRAFANA[Grafana]
        KIBANA[Kibana]
        SENTRY[Sentry]
    end
    
    subgraph "Alerts"
        PAGER[PagerDuty]
        SLACK[Slack]
        EMAIL[Email]
    end
    
    APP --> LOGS
    APP --> METRICS
    APP --> ERRORS
    
    LOGS --> KIBANA
    METRICS --> GRAFANA
    ERRORS --> SENTRY
    
    SERVERS --> GRAFANA
    DB_MON --> GRAFANA
    API_MON --> GRAFANA
    
    GRAFANA --> PAGER
    KIBANA --> SLACK
    SENTRY --> EMAIL
```

---

*Note: These diagrams can be rendered using Mermaid-compatible markdown viewers or converted to images using Mermaid CLI tools.*